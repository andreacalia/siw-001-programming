/**
 * BackboneJS view that implements the Dashboard view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/view/_dashboard-analysis',
    'text!resources/templates/dashboard.html'
], function($, _, Backbone, DashboardAnalysisView, template) {

    var DashboardView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError('No groups passed to dashboard view');

            if( _.isUndefined(args.rawCollection) )
                throwError('No raw data passed to dashboard view');

            this.locators = {
                analysis: '#dash-analysis-locator',
                radioInputs: 'input[type="radio"]' 
            };

            this.groupsCollection = args.groupsCollection;
            this.rawCollection = args.rawCollection;

            this.analysisView = new DashboardAnalysisView();
            
            this.template = template;

            this.on('please-change:groupID', this._updateAnalysisView, this);
        },

        render: function(){

            var compiled = _.template(this.template)({
                groups: this.groupsCollection
            });
            this.$el.html(compiled);

            this.analysisView.setElement(this.$el.find(this.locators.analysis));
            this.analysisView.render();

            // Events
            this.$el.find(this.locators.radioInputs).on('change', _.bind(this._groupChanged, this));
        },

        _groupChanged: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var radioClicked = $(evt.target);
            var clickedID = radioClicked.attr('value');

            this.trigger('please-change:groupID', clickedID);
        },

        _updateAnalysisView: function(groupID) {

            var selectedGroup = this.groupsCollection.get(groupID);

            this.analysisView.setGroup(selectedGroup);
            this.analysisView.render();
        },

        /**
         * Overrided to call remove on the child views
         */
        remove: function() {

            this.analysisView.remove();

            // Call super.remove
            Backbone.View.prototype.remove.call(this);
        }

    });

    return DashboardView;
});