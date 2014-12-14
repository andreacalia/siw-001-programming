/**
 * BackboneJS view that implements the home page of the web app.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/router',
    'text!resources/templates/home.html'
], function($, _, Backbone, Router, template) {

    var HomeView = Backbone.View.extend({

        initialize: function() {

            this.template = template;
        },

        render: function(){

            var compiled = _.template(this.template)({
                Router: Router
            });
            this.$el.html(compiled);
        }

    });

    return HomeView;
});