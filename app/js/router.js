/**
 * Router of the application. Manages the routing according to BackboneJS
 */
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

    var allRoutes = {
        dataManager: function() {
            return '#/data-manager';
        },
        dashboard: function() {
            return '#/dashboard';
        },
        geo: function() {
            return '#/geo';
        },
        home: function() {
            return '#/';
        },
        createGroup: function() {
            return '#/group/new';
        },
        editGroup: function(id) {
            return '#/group/edit/' + id.toString();
        }
    };

    var dynamicRoutes = {
    }

    var AppRouter = Backbone.Router.extend({
        routes: {
            'data-manager': "show-data-manager",
            'dashboard': "show-dashboard",
            'geo': "show-geo",
            'group/new': 'group-new',
            'group/edit/:id': 'group-edit',
            '*actions': 'show-home'
        }
    });

    var app_router = new AppRouter();

    var initialize = function(app) {

        app_router.on('route:show-data-manager', function(actions) {

            console.log('router:show-data-manager');

            app.showDataManager.call(app);
        });

        app_router.on('route:show-dashboard', function(actions) {

            console.log('router:show-dashboard');

            app.showDashboard.call(app);
        });

        app_router.on('route:show-geo', function(actions) {

            console.log('router:show-geo');

            app.showGeo.call(app);
        });

        app_router.on('route:group-edit', function(id) {

            console.log('router:group-edit');

            app.showGroupEdit.call(app, id);
        });

        app_router.on('route:group-new', function(actions) {

            console.log('router:group-new');

            app.showGroupNew.call(app);
        });

        app_router.on('route:show-home', function(actions) {

            console.log('router:show-home');

            app.showHome.call(app);
        });

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    };

    return {
        initialize: initialize,
        routes: allRoutes,
        navigate: _.bind(app_router.navigate, app_router)
    };
});