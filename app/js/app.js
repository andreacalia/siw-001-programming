/**
 * Web application "controller". Manages the views and the application state and business logic.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/router',
    'js/view/nav',
    'js/view/home',
    'js/view/data-manager',
    'js/view/loading',
    'js/view/geo',
    'js/view/dashboard',
    'js/view/group-management',
    'js/model/group-model',
    'js/model/groups-collection',
    'js/model/raw-collection',
    'js/model/remote-data-model'
], function($, _, Backbone, Router,
            NavView, HomeView, DataManagerView, LoadingView, GeoView, DashboardView, GroupManagementView,
            GroupModel, GroupsCollection, RawCollection, RemoteDataModel) {

    var App = _.extend({

        // Attributes
        locators: {
            body: '#body-locator',
            nav: '#nav-locator'
        },
        dataFilters: { // Set default filters
            test: {
                value: '1',
                text: ''
            },
            gender: {
                value: 'all',
                text: ''
            },
            age: {
                value: 'all',
                text: ''
            },
            beginDate: {
                value: '2000-01-01',
                text: ''
            },
            endDate: {
                value: '2015-01-01',
                text: ''
            }
        },
        groupsCollection: null,
        rawCollection: null,
        remoteModel: null,
        currentView: null,

        // Methods
        initialize: function() {

            // Groups collection
            this.groupsCollection = new GroupsCollection();
            // Raw collection
            this.rawCollection = new RawCollection();
            // 
            // Populate with default groups
            this._createInitialGroups();

            // Remote model
            this.remoteModel = new RemoteDataModel();
            // When data changes, it is needed to repopulate the groups
            this.listenTo(this.remoteModel, 'change:rawData', this._populateCollections);

            // Initial view elements
            this.navView = new NavView({el: $(this.locators.nav)});
            this.navView.render();

            // Backbone router init
            Router.initialize(this);
        },

        showDataManager: function() {

            this._showLoadingView();

            var dmView = new DataManagerView({
                groupsCollection: this.groupsCollection,
                currentFilters: this.dataFilters
            });

            // Bind events
            this.listenTo(dmView, 'change:filter', function(newFilter) {

                this.dataFilters = newFilter;

                var remoteParameters = {
                    test: newFilter.test.value,
                    gender: newFilter.gender.value,
                    age: newFilter.age.value,
                    beginDate: newFilter.beginDate.value,
                    endDate: newFilter.endDate.value
                };
                
                this.remoteModel.loadData.call(this.remoteModel, remoteParameters);

            });
            this.listenTo(dmView, 'delete:group', function(groupID) {

                this._removeGroupByID(groupID);

            })
            // This view has to listen to the raw data changes, to reenable controls
            dmView.listenTo(this.remoteModel, 'change:rawData', dmView.enableFilterSelection);

            this._updateAndRenderCurrentView(dmView);
            this.navView.markActive(this.navView.locators.dataManagerEntry);
        },

        showDashboard: function() {

            this._showLoadingView();

            if( ! this._areDataLoaded() ) {
                // Alert
                showMessage('You have to select which data you want to analyse first');
                // Redirect to the manager
                Router.navigate(Router.routes.dataManager());

                return;
            }

            var dashboardView = new DashboardView({
                groupsCollection: this.groupsCollection,
                rawCollection: this.rawCollection
            });

            this._updateAndRenderCurrentView(dashboardView);
            this.navView.markActive(this.navView.locators.dashboardEntry);
        },

        showGeo: function() {

            this._showLoadingView();

            if( ! this._areDataLoaded() ) {
                // Alert
                showMessage('You have to select which data you want to analyse first');
                // Redirect to the manager
                Router.navigate(Router.routes.dataManager());

                return;
            }

            var geoView = new GeoView({
                groupsCollection: this.groupsCollection,
                rawCollection: this.rawCollection,
                filters: this.dataFilters
            });

            this._updateAndRenderCurrentView(geoView);
            this.navView.markActive(this.navView.locators.geoEntry);
        },

        showGroupEdit: function(groupID) {

            this._showLoadingView();

            var groupToBeEdited = this.groupsCollection.get(groupID);

            if( _.isNull(groupToBeEdited) || _.isUndefined(groupToBeEdited) )
                throwError('Attempted to edit ' + groupID + '. It does not exists in the collection');

            var groupEditView = new GroupManagementView({
                groupsCollection: this.groupsCollection,
                groupID: groupID
            });

            // When a model is edited, add it to the collection
            this.listenTo(groupEditView, 'edited:group', this._updateModel);

            this._updateAndRenderCurrentView(groupEditView);
        },

        showGroupNew: function() {

            this._showLoadingView();

            var groupCreateView = new GroupManagementView({
                groupsCollection: this.groupsCollection
            });

            // When a model is created, add it to the collection
            this.listenTo(groupCreateView, 'new:group', this._addNewModel);

            this._updateAndRenderCurrentView(groupCreateView);
        },

        showHome: function() {

            this._showLoadingView();

            var homeView = new HomeView();

            this._updateAndRenderCurrentView(homeView);
            // Actually this does not activate the home link. The main goal is to disable the others activated links
            this.navView.markActive(this.navView.locators.homeEntry);
        },

        _areDataLoaded: function() {

            // Check if the user has selected data
            return this.rawCollection.length > 0;
        },

        _removeGroupByID: function(groupID) {

            var modelToBeRemoved = this.groupsCollection.get(groupID);

            if( _.isNull(modelToBeRemoved) || _.isUndefined(modelToBeRemoved) )
                throwError('Attempted to remove ' + groupID + '. It does not exists in the collection');

            this.groupsCollection.remove(modelToBeRemoved);
            // It's needed to recalculate all the groups data, conflicts, etc..
            this._populateCollections();
        },

        _populateCollections: function() {

            // Forget old data in collections
            this.groupsCollection.cleanDynamicGroupsData();
            this.rawCollection.clean();
            
            var rawData = this.remoteModel.get('rawData');

            // Process new data
            this.groupsCollection.digestElements(rawData);
            this.rawCollection.digestElements(rawData);
        },

        _addNewModel: function(model) {

            // Add the model to the collection
            this.groupsCollection.add(model);
            // It's needed to recalculate all the groups data, conflicts, etc..
            this._populateCollections();
            // Go to the settings page
            Router.navigate(Router.routes.dataManager());
        },

        _updateModel: function(updatedModel) {

            // Swap models
            var oldModel = this.groupsCollection.get(updatedModel.get('id'));

            this.groupsCollection.remove(oldModel);
            this.groupsCollection.add(updatedModel);

            // It's needed to recalculate all the groups data, conflicts, etc..
            this._populateCollections();

            // Go to the settings page
            Router.navigate(Router.routes.dataManager());
        },

        // Defaul groups
        _createInitialGroups: function() {

            var groups = [
                {
                    "id": "europe",
                    "name": "Europe",
                    "description": "Eurozone countries",
                    "countryCodes": ["GG", "JE", "AX", "DK", "EE", "FI", "FO", "GB", "IE", "IM", "IS", "LT", "LV", "NO", "SE", "SJ", "AT", "BE", "CH", "DE", "DD", "FR", "FX", "LI", "LU", "MC", "NL", "BG", "BY", "CZ", "HU", "MD", "PL", "RO", "RU", "SU", "SK", "UA", "AD", "AL", "BA", "ES", "GI", "GR", "HR", "IT", "ME", "MK", "MT", "CS", "RS", "PT", "SI", "SM", "VA", "YU"]
                },
                {
                    "id": "africa",
                    "name": "Africa",
                    "description": "African countries",
                    "countryCodes": ["DZ", "EG", "EH", "LY", "MA", "SD", "TN", "BF", "BJ", "CI", "CV", "GH", "GM", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SL", "SN", "TG", "AO", "CD", "ZR", "CF", "CG", "CM", "GA", "GQ", "ST", "TD", "BI", "DJ", "ER", "ET", "KE", "KM", "MG", "MU", "MW", "MZ", "RE", "RW", "SC", "SO", "TZ", "UG", "YT", "ZM", "ZW", "BW", "LS", "NA", "SZ", "ZA"]
                },
                {
                    "id": "americas",
                    "name": "Americas",
                    "description": "Countries of both Americas and Caribbean",
                    "countryCodes": ["BM", "CA", "GL", "PM", "US", "AG", "AI", "AN", "AW", "BB", "BL", "BS", "CU", "DM", "DO", "GD", "GP", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "TC", "TT", "VC", "VG", "VI", "BZ", "CR", "GT", "HN", "MX", "NI", "PA", "SV", "AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PE", "PY", "SR", "UY", "VE"]
                },
                {
                    "id": "asia",
                    "name": "Asia",
                    "description": "Asia countries",
                    "countryCodes": ["TM", "TJ", "KG", "KZ", "UZ", "CN", "HK", "JP", "KP", "KR", "MN", "MO", "TW", "AF", "BD", "BT", "IN", "IR", "LK", "MV", "NP", "PK", "BN", "ID", "KH", "LA", "MM", "BU", "MY", "PH", "SG", "TH", "TL", "TP", "VN", "AE", "AM", "AZ", "BH", "CY", "GE", "IL", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "NT", "SY", "TR", "YE", "YD"]
                },
                {
                    "id": "oceania",
                    "name": "Oceania",
                    "description": "Oceania",
                    "countryCodes": ["AU", "NF", "NZ", "FJ", "NC", "PG", "SB", "VU", "FM", "GU", "KI", "MH", "MP", "NR", "PW", "AS", "CK", "NU", "PF", "PN", "TK", "TO", "TV", "WF", "WS"]
                }

            ];

            this.groupsCollection.add(groups);
        },

        _showLoadingView: function() {

            var loadingView = new LoadingView();
            this._updateAndRenderCurrentView(loadingView);
        },

        _updateAndRenderCurrentView: function(newView) {

            // Remove the old view (if it exists) the Backbone-way
            if( ! _.isNull(this.currentView) && ! _.isUndefined(this.currentView) ) {

                this.stopListening(this.currentView);
                this.currentView.remove();
            }

            this.currentView = newView;

            // Get the father of the view body
            var parent = $(this.locators.body);
            // Create a new container for the view (because the .remove will delete it)
            var container = $(document.createElement('div'));
            // Clear the father and append the new child
            parent.empty();
            parent.append(container);

            // Now render the new view
            newView.setElement(container);
            newView.render();
        }

    }, Backbone.Events); // Backbone events enabled object

    return App;
});