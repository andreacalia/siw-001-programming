/**
 * BackboneJS view that implements the Management view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/data-manager.html',
    'js/view/_data-filter',
    'js/view/_data-groups'
], function($, _, Backbone, template, DataFilterView, DataGroupsView) {

    var DataManagerView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError('No groups passed to data management view');

            if( _.isUndefined(args.currentFilters) )
                throwError('No filter passed to data management view');

            this.groupsCollection = args.groupsCollection;

            this.template = template;

            this.locators = {
                filter: '#dm-filter-locator',
                groups: '#dm-groups-locator'
            }
            // Views
            this.dataFilterView = new DataFilterView({
                currentFilters: args.currentFilters
            });
            this.dataGroupsView = new DataGroupsView({groupsCollection: this.groupsCollection});

            // View events binding
            this.listenTo(this.dataFilterView, 'change:filter', this._filterChanged);
            this.listenTo(this.dataGroupsView, 'delete:group', this._groupRemoveTriggered);
        },

        render: function(){

            this.$el.html(this.template);
            //this.$el.addClass('super-fast animated fadeInDown');

            this.dataFilterView.setElement(this.$el.find(this.locators.filter));
            this.dataFilterView.render();

            this.dataGroupsView.setElement(this.$el.find(this.locators.groups));
            this.dataGroupsView.render();
        },

        enableFilterSelection: function() {

            this.dataFilterView.enableApply();
        },

        _filterChanged: function(newFilter) {

            this.dataFilterView.disableApply();

            this.trigger('change:filter', newFilter);
        },

        _groupRemoveTriggered: function(groupID) {

            this.trigger('delete:group', groupID);
        },

        /**
         * Overrided to call remove on the child views
         */
        remove: function() {

            this.dataFilterView.remove();
            this.dataGroupsView.remove();

            // Call super.remove
            Backbone.View.prototype.remove.call(this);
        }

    });

    return DataManagerView;
});