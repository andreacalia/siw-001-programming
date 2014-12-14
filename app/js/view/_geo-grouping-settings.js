/**
 * BackboneJS view that implements the Grouping settings of the Geo view. Manage the grouping of the data
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/geo-grouping-settings.html'
], function($, _, Backbone, template) {

    var GeoGrupingSettingsView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError(new Error('No groups passed to geo setting view'));

            this.locators = {
                groupingEnabler: '#geo-grouping-group-enabler',
                groupingWarnings: '.geo-grouping-group-warning',
                groupingCheckboxes: 'input[type="checkbox"]',
                groupingLabels: '.geo-grouping-group-label',
                groupingEntries: '.geo-grouping-group-entry'
            }

            this.groupsCollection = args.groupsCollection;

            this.template = template;
        },

        render: function(){

            var compiled = _.template(this.template)({groups: this.groupsCollection})
            this.$el.html(compiled);

            // Enable JS components
            this.$el.find(this.locators.groupingEnabler).bootstrapSwitch({
                size: 'small'
            });
            this.$el.find(this.locators.groupingWarnings).tooltip();

            // Event listeners
            this.$el.find(this.locators.groupingEnabler).on('switchChange.bootstrapSwitch', _.bind(this._groupEnablerChanged, this));
            this.$el.find(this.locators.groupingCheckboxes).on('change', _.bind(this._groupChanged, this)); // Enable or disable conflicts
            this.$el.find(this.locators.groupingCheckboxes).on('change', _.bind(this._triggerChangeGroupSelection, this)); // Trigger visualization

            // Defaults
            this._disableGrouping();
        },

        _triggerChangeGroupSelection: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var selectedIDs = _.reduce(this.$el.find('input[data-group-id]:checked'), function(memo, el) {

                memo.push($(el).attr('data-group-id'));
                return memo;

            }, [])
            
            this.trigger('change:group-selection', selectedIDs);
        },

        _groupChanged: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var target = $(evt.target);
            
            // Find conflicting groups
            var targetGroupID = target.attr('data-group-id');
            var conflictingGroups = this.groupsCollection.get(targetGroupID).get('groupConflicts'); // [{id, name}, ...]

            // Find which function is appropriate
            var applier = target.prop('checked') ? this._disableConflictingEntry : this._enableConflictingEntry;

            _.each(conflictingGroups, function(conflictingGroup) {

                // Select the entry
                var conflictingEntry = this.$el.find('p[data-group-id="' + conflictingGroup.id + '"]');

                applier.call(this, conflictingEntry);

            }, this);
        },

        _disableConflictingEntry: function(entry) {

            // Checkbox
            entry.find(this.locators.groupingCheckboxes)
                    .attr('disabled', 'disabled') // Disable the checkbox
                    .addClass('disabled') // Add disable CSS class
                    .prop('checked', false); // Untick the checkbox
            // Label
            entry.find(this.locators.groupingLabels)
                    .addClass('disabled'); // Add disable CSS class
            // Warning
            entry.find(this.locators.groupingWarnings).show();            
        },

        _enableConflictingEntry: function(entry) {

            // Checkbox
            entry.find(this.locators.groupingCheckboxes)
                    .removeAttr('disabled') // Enable the checkbox
                    .removeClass('disabled') // Remove disable CSS class
                    .prop('checked', false); // Untick the checkbox
            // Label
            entry.find(this.locators.groupingLabels)
                    .removeClass('disabled'); // Remove disable CSS class
            // Warning
            entry.find(this.locators.groupingWarnings).hide();
        },

        _groupEnablerChanged: function(evt, state) {

            evt.preventDefault();
            evt.stopPropagation();

            state ? this._enableGrouping() : this._disableGrouping();

            this.trigger('change:groups-state', state);
        },

        _enableGrouping: function() {

            this.$el.find(this.locators.groupingEntries).each(_.bind(function(i, entry) {

                var entry = $(entry);
                entry.removeClass('disabled');
                entry.find(this.locators.groupingCheckboxes).removeAttr('disabled');

            }, this));
        },

        _disableGrouping: function() {

            this.$el.find(this.locators.groupingEntries).each(_.bind(function(i, entry) {

                var entry = $(entry);

                // Enable the entry if it was a conflict (because conflict disable is different from this kind of disable)
                this._enableConflictingEntry(entry);

                entry.addClass('disabled'); // Add disable CSS class
                entry.find(this.locators.groupingCheckboxes)
                    .attr('disabled', 'disabled'); // Disable the checkbox

            }, this));
        }

    });

    return GeoGrupingSettingsView;
});