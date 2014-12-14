/**
 * BackboneJS view that implements the Group management section of the Manager view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/router',
    'text!resources/templates/data-groups.html',
    'text!resources/templates/data-groups-table.html'
], function($, _, Backbone, Router, template, tableTemplate) {

    var DataGroupsView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError(new Error('No groups passed to setting view'));

            this.groupsCollection = args.groupsCollection;

            this.template = template;
            this.tableTemplate = tableTemplate;

            this.locators = {
                table: '#dg-table-locator',
                deleteGroupButtons: '.dg-group-delete'
            };

            // Bind change events on collection and each model. Needed to update the table with always update data.
            this.listenTo(this.groupsCollection, 'all', this._renderTable);
            this.groupsCollection.each(function(group) {

                this.listenTo(group, 'all', this._renderTable);

            }, this);
        },

        render: function(){

            var compiled = _.template(this.template)({
                Router: Router
            });

            this.$el.empty();
            this.$el.html(compiled);

            this._renderTable();
        },

        _renderTable: function() {

            var compiled = _.template(this.tableTemplate)({
                Router: Router,
                groups: this.groupsCollection
            });

            var tableLocator = this.$el.find(this.locators.table);
            tableLocator.empty();
            tableLocator.html(compiled);

            // Event listeners
            tableLocator.find(this.locators.deleteGroupButtons).on('click', _.bind(this._deleteClicked, this));
        },

        _deleteClicked: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var button = $(evt.currentTarget);
            var groupID = button.attr('data-group-id');
            var groupName = button.attr('data-group-name');

            if( confirm('Are you sure you want to delete "' + groupName + '"?') )
                this.trigger('delete:group', groupID);

        }

    });

    return DataGroupsView;
});