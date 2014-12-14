/**
 * BackboneJS view that implements the Filter settings of the Geo view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/geo-filter-settings.html'
], function($, _, Backbone, template) {

    var GeoFilterSettingsView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.filters) )
                throwError('No filters passed to geo filters view');

            this.locators = {
                filterChooser: '#geo-filter-chooser'
            };
            
            this.filters = args.filters;

            this.template = template;

            this.colors = {
                time: args.timeColor,
                score: args.scoreColor
            };
        },

        render: function(){

            var compiled = _.template(this.template)({
                filters: this.filters
            });
            this.$el.html(compiled);

            // Enable JS components
            this.$el.find(this.locators.filterChooser).bootstrapSwitch({
                onText: 'Time',
                offText: 'Score',
                size: 'large'
            });

            // Event listeners
            this.$el.find(this.locators.filterChooser).on('switchChange.bootstrapSwitch', _.bind(this._dataFilterChanged, this));

            this.$el.find('.bootstrap-switch-handle-off').css('background-color', this.colors.score);
            this.$el.find('.bootstrap-switch-handle-off').css('color', 'white');
            this.$el.find('.bootstrap-switch-handle-on').css('background-color', this.colors.time);
            this.$el.find('.bootstrap-switch-handle-on').css('color', 'white');

        },

        _dataFilterChanged: function(evt, state) {

            evt.preventDefault();
            evt.stopPropagation();

            var visualization = state ? 'time' : 'score';

            this.trigger('change:filter', visualization);
        },

    });

    return GeoFilterSettingsView;
});