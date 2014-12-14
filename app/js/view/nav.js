/**
 * BackboneJS view that implements the navbar of the web app.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/router',
    'text!resources/templates/nav.html'
], function($, _, Backbone, Router, template) {

    var NavView = Backbone.View.extend({

        initialize: function() {

            this.locators = {
                dataManagerEntry: '#nav-data-manager-entry',
                dashboardEntry: '#nav-dashboard-entry',
                geoEntry: '#nav-geo-entry',
                homeEntry: '#nav-home-entry'
            }

            this.template = template;
        },

        render: function(){

            var compiled = _.template(this.template)({
                Router: Router
            });
            this.$el.html(compiled);
        },

        markActive: function(entry) {

            // Deactivate all entries
            this.$el.find('.nav-entry').removeClass('active');
            // Activate the selected entry
            this.$el.find(entry).addClass('active');
        }

    });

    return NavView;
});