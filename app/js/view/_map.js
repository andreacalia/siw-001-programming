/**
 * BackboneJS view that implements the Map subview of the Geo view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/map.html'
], function($, _, Backbone, template) {

    var MapView = Backbone.View.extend({

        initialize: function() {

            this.template = template;
            this.dataTable = null;

            this.locators = {
                map: '#map-map-locator',
                mapZoomControl: '#map-zoom-control',
                mapZoomControlIcon: '#map-zoom-control > i'
            };

            this.chartOptions = {
                colorAxis: {colors: ['white', 'black']},
                backgroundColor: '#E2F4FF',
                datalessRegionColor: '#FDFDFD'
            };

            this.chart = null;

            this.on('please-render-chart', this._drawGeoChart, this);
        },

        render: function(){

            this.$el.html(this.template);

            // Events
            this.$el.find(this.locators.mapZoomControl).on('click', _.bind(this._triggerZoom, this));

            this._drawGeoChart();
        },

        setData: function(data) {

            var dataTable = new google.visualization.DataTable(data);

            this.dataTable = dataTable;

            this.trigger('please-render-chart');
        },

        setAxisColors: function(newColors) {

            this.chartOptions.colorAxis = {colors: newColors};
        },

        redrawChart: function() {

            this.trigger('please-render-chart');
        },

        _triggerZoom: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            // Switch the icon
            this.$el.find(this.locators.mapZoomControlIcon).toggleClass('fa-expand fa-compress');

            this.trigger('toggle:zoom');
        },

        _drawGeoChart: function() {

            if( _.isNull(this.dataTable) )
                return;

            // If it is the first time, create the chart
            if( _.isNull(this.chart) ) {

                var mapLocator = this.$el.find(this.locators.map)[0];
                this.chart = new google.visualization.GeoChart(mapLocator);
            }

            var data = this.dataTable;

            this.chart.draw(data, this.chartOptions);
        }
    });

    return MapView;
});