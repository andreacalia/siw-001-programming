/**
 * BackboneJS view that implements the Geo view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/geo.html',
    'js/view/_map',
    'js/view/_geo-grouping-settings',
    'js/view/_geo-filter-settings'
], function($, _, Backbone, template, MapView, GeoGrupingSettingsView, GeoFilterSettingsView) {

    var GeoView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError('No groups passed to geo view');

            if( _.isUndefined(args.rawCollection) )
                throwError('No raw data passed to geo view');

            if( _.isUndefined(args.filters) )
                throwError('No filters passed to geo view');

            this.groupsCollection = args.groupsCollection;
            this.rawCollection = args.rawCollection;
            this.appliedFilters = args.filters;

            this.template = template;

            this.locators = {
                map: '#geo-map-locator',
                groupingSettings: '#geo-grouping-settings-locator',
                filterSettings: '#geo-filter-settings-locator'
            };

            this.uiState = {
                selectedIDs: null,
                selectedVisualization: 'time',
                areGroupsEnabled: false
            };

            this.chartColors = {
                'time': {
                    from: '#F3B0DD',
                    to: '#A40663'
                },
                'score': {
                    from: '#FFACAC',
                    to: '#AE0909'
                }
            };

            // Views
            this.mapView = new MapView();
            this.groupingSettingsView = new GeoGrupingSettingsView({groupsCollection: this.groupsCollection});
            this.filterSettingsView = new GeoFilterSettingsView({
                timeColor: this.chartColors.time.to,
                scoreColor: this.chartColors.score.to,
                filters: {
                    test: this.appliedFilters.test.text,
                    gender: this.appliedFilters.gender.text,
                    age: this.appliedFilters.age.text,
                    beginDate: this.appliedFilters.beginDate.text,
                    endDate: this.appliedFilters.endDate.text
                }
            });

            this.groupingSettingsView.on('change:group-selection', this._groupSelectionChanged, this);
            this.groupingSettingsView.on('change:groups-state', this._groupStateChanged, this);
            this.filterSettingsView.on('change:filter', this._dataFilterChanged, this);
            this.mapView.on('toggle:zoom', this._toggleZoom, this);
            this.on('please-update-map', this._updateMapView, this);
            this.on('please-redraw-map', this.mapView.redrawChart, this.mapView);
        },

        render: function() {

            this.$el.html(this.template);
            //this.$el.addClass('super-fast animated rollIn');

            this.mapView.setElement(this.$el.find(this.locators.map));
            this.mapView.render();

            this.groupingSettingsView.setElement(this.$el.find(this.locators.groupingSettings));
            this.groupingSettingsView.render();

            this.filterSettingsView.setElement(this.$el.find(this.locators.filterSettings));
            this.filterSettingsView.render();

            this.trigger('please-update-map');
        },

        _toggleZoom: function() {

            // Switch the size of the map
            this.$el.find('#geo-map-locator-container').toggleClass('col-md-9 col-md-12');
            // Switch the size of the controls columns
            this.$el.find('#geo-settings-container').toggleClass('col-md-3 col-md-12');
            // Switch the size of the settings views
            this.$el.find(this.locators.groupingSettings).toggleClass('col-md-12 col-md-6');
            this.$el.find(this.locators.filterSettings).toggleClass('col-md-12 col-md-6');

            // Make sure all the animations are done.
            // Is a bit tricky, but is trickier to detect the width changes on a div. Hope DOM API will improove
            _.delay(_.bind(function() {
                this.trigger('please-redraw-map');
            }, this), 500);
        },

        _groupSelectionChanged: function(selectedIDs) {

            this.uiState.selectedIDs = selectedIDs;

            this.trigger('please-update-map');
        },

        _groupStateChanged: function(state) {

            this.uiState.areGroupsEnabled = state;

            if( ! this.uiState.areGroupsEnabled )
                this.uiState.selectedIDs = null;

            this.trigger('please-update-map');
        },

        _dataFilterChanged: function(visualization) {

            this.uiState.selectedVisualization = visualization;

            this.trigger('please-update-map');
        },

        _updateMapView: function() {

            // Filter selected groups, selected data, etc...
            var data = this.uiState.areGroupsEnabled ? this._filterGroups() : this._filterRawData();

            // Now create the JSON version of the data table that the Google API expects (https://developers.google.com/chart/interactive/docs/reference#dataparam)
            // The array data is in form [{countryCode, avg}, ]
            // Transform it to [{c:[{v:countryCode}, {v:avg}]}, ]

            var objRows = _.map(data, function(el) {

                return {c: [ {v: el.countryCode}, {v: el.average} ]};

            });

            var obj = {
                cols: [
                    {id: 'country', label: 'Country Name', type: 'string'},
                    {id: 'avg', label: 'Average', type: 'number'}
                ],
                rows: objRows
            };

            this.mapView.setAxisColors([
                this.chartColors[this.uiState.selectedVisualization].from,
                this.chartColors[this.uiState.selectedVisualization].to
            ]);
            this.mapView.setData(obj);
        },

        _filterGroups: function() {

            var dataVisualizationFilter = this.uiState.selectedVisualization;

            var selectedGroups = this.groupsCollection.filter(function(group) {

                return _.contains(this.uiState.selectedIDs, group.get('id'));

            }, this);

            var data = selectedGroups.reduce(function(merged, group) {

                return _.union(merged, group.getAggregatedDataAsArray(dataVisualizationFilter));

            }, []);

            return data;
        },

        _filterRawData: function() {

            var filter = this.uiState.selectedVisualization;

            var data = this.rawCollection.map(function(rawData) {

                return {
                    countryCode: rawData.get('countryCode'),
                    average: filter === 'time' ? rawData.get('timeAverage') : filter === 'score' ? rawData.get('scoreAverage') : throwError('Filter not correct')
                };

            });

            return data;
        },

        /**
         * Overrided to call remove on the child views
         */
        remove: function() {

            this.mapView.remove();
            this.groupingSettingsView.remove();
            this.filterSettingsView.remove();

            // Call super.remove
            Backbone.View.prototype.remove.call(this);
        }
    });

    return GeoView;
});