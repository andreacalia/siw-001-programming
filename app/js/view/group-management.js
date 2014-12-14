/**
 * BackboneJS view that implements the group management view. Can edit or create groups.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/router',
    'js/model/group-model',
    'text!resources/templates/group-management.html',
    'text!resources/templates/group-management-countries-control.html'
], function($, _, Backbone, Router, GroupModel, template, templateCountriesControl) {

    var GroupManagementView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError('No group collection passed to the manager view');

            this.locators = {
                map: '#group-map-locator',
                countries: '#group-control-countries-locator',
                nameInput: '#group-control-name',
                descriptionInput: '#group-control-description'
            };

            this.modes = {
                create: 'create',
                edit: 'edit'
            }

            this.template = template;
            
            this.templateCountriesControl = templateCountriesControl;
            this.groupsCollection = args.groupsCollection;

            this.dataTable = new google.visualization.DataTable();
            // The dataTable consists in only one column
            this.dataTable.addColumn('string', 'Country');
            this.chart = null;

            this.shadowGroup = new GroupModel();

            // The edit or creation mode is defined by if a model is passed as a parameter
            if( _.isUndefined(args.groupID) ) {

                // Create
                this.shadowGroup.set('id', '');
                this.shadowGroup.set('name', '');
                this.shadowGroup.set('description', '');
                this.shadowGroup.set('countryCodes', []);

                this.mode = this.modes.create;

            } else {

                // Edit
                var group = this.groupsCollection.get(args.groupID);

                this.shadowGroup.set('id', group.get('id'));
                this.shadowGroup.set('name', group.get('name'));
                this.shadowGroup.set('description', group.get('description'));
                this.shadowGroup.set('countryCodes', group.get('countryCodes'));
                
                this.mode = this.modes.edit;

            }

            // Events
            this.listenTo(this.shadowGroup, 'change:countryCodes', this._updateDataTable);
            this.listenTo(this.shadowGroup, 'change:countryCodes', this._updateCountriesControl);
            this.on('please-redraw-chart', this._drawGeoChart, this);
            this.on('remove:countryCode', this._removeCountryCode, this);
        },

        render: function(){

            var compiled = _.template(this.template)({
                mode: this.mode,
                group: this.shadowGroup
            });

            this.$el.html(compiled);

            // Default values for controls
            this._setControlsFromShadowModel();

            // JS elements
            this.$el.find('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover focus click'
            });

            // Events
            this.$el.find('#group-controls-form').on('submit', _.bind(this._applyClicked, this));
            this.$el.find('#group-control-cancel').on('click', _.bind(this._cancelClicked, this));

            this._drawGeoChart();
        },

        _setControlsFromShadowModel: function() {

            this.$el.find(this.locators.nameInput).val(this.shadowGroup.get('name'));
            this.$el.find(this.locators.descriptionInput).val(this.shadowGroup.get('description'));
            this._updateCountriesControl();
            this._updateDataTable();
        },

        _applyClicked: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            // If creation mode, set the name and id
            if( this.mode === this.modes.create ) {

                var name = this.$el.find(this.locators.nameInput).val().trim();

                this.shadowGroup.set('id', name.toLowerCase());
                this.shadowGroup.set('name', name);
            }

            var description = this.$el.find(this.locators.descriptionInput).val().trim();
            this.shadowGroup.set('description', description);

            if( this._validate() ) {

                var eventToTrigger = this.mode === this.modes.create ? 'new:group' : 'edited:group';

                this.trigger(eventToTrigger, this.shadowGroup);
            }
        },

        _cancelClicked: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            if( confirm('Unsaved work will be lost. Are you sure?') )
                Router.navigate(Router.routes.dataManager());
        },

        _validate: function() {

            // Check the name only in creation mode. In edit, is readonly
            if( this.mode == this.modes.create ) {

                // Model must have a name
                if( _.isNull(this.shadowGroup.get('name')) ) {

                    showWarning('You have to enter a name for the group');
                    this._shakeElementByID(this.locators.nameInput);

                    return false;
                }

                // The name must be unique
                if( ! _.isUndefined(this.groupsCollection.get(this.shadowGroup.id)) ) {

                    showWarning('A group with the same name (case insensitive) already exists');
                    this._shakeElementByID(this.locators.nameInput);

                    return false;
                }
            }

            // Model must have a description
            if( _.isNull(this.shadowGroup.get('description')) ) {

                showWarning('You have to enter a description for the group');
                this._shakeElementByID(this.locators.descriptionInput);

                return false;
            }

            // Model must have some countries
            if( _.size(this.shadowGroup.get('countryCodes')) <= 0 ) {

                showWarning('You have to select at least a country for the group');
                this._shakeElementByID(this.locators.countries);

                return false;
            }

            return true;
        },

        _shakeElementByID: function(elID) {

            var el = this.$el.find(elID);

            if( ! el.hasClass('animated') )
                el.addClass('animated');

            // Remove the shake animator
            el.removeClass('shake');
            // After a bit, animate it
            _.delay(function() {
                el.addClass('shake');
            }, 100);
        },

        _chartClicked: function(chartEvent) {

            var countryClicked = chartEvent.region;

            console.debug('clicked:' + countryClicked);

            var countries = this.shadowGroup.get('countryCodes');

            // Check if the country is already in the group
            if( _.contains(countries, countryClicked) ) {
                // If yes, remove it
                countries = _.without(countries, countryClicked);

            } else {
                // If not, add it
                countries = _.union(countries, [countryClicked]);
            }
                
            this.shadowGroup.set('countryCodes', countries);
        },

        _removeCountryCode: function(countryToBeRemoved) {

            var countries = this.shadowGroup.get('countryCodes');
            countries = _.without(countries, countryToBeRemoved);
            this.shadowGroup.set('countryCodes', countries);
        },

        _updateCountriesControl: function() {

            var countriesControlContainer = this.$el.find(this.locators.countries);

            var compiled = _.template(this.templateCountriesControl)({group: this.shadowGroup});

            countriesControlContainer.empty();
            countriesControlContainer.html(compiled);

            // Events
            countriesControlContainer.find('.group-countries-entry-remove').on('click', _.bind(function(evt) {

                var target = $(evt.currentTarget);
                var countryToBeRemoved = target.attr('data-country');

                this.trigger('remove:countryCode', countryToBeRemoved);

            }, this));
        },

        _updateDataTable: function() {

            // Clear the data table
            this.dataTable.removeRows(0, this.dataTable.getNumberOfRows());
            // Add the new rows
            this.dataTable.addRows(_.reduce(this.shadowGroup.get('countryCodes'), function(rows, countryCode) {

                rows.push([countryCode]);
                return rows;

            }, []));
            // Trigger map redraw
            this.trigger('please-redraw-chart');
        },

        _drawGeoChart: function() {

            // If it is the first time, create the chart
            if( _.isNull(this.chart) ) {

                var mapLocator = this.$el.find(this.locators.map)[0];
                this.chart = new google.visualization.GeoChart(mapLocator);

                // Click event
                google.visualization.events.addListener(this.chart, 'regionClick', _.bind(this._chartClicked, this));
            }

            var options = null;
            var data = this.dataTable;

            this.chart.draw(data, options);
        }
    });

    return GroupManagementView;
});