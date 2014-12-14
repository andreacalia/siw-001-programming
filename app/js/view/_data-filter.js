/**
 * BackboneJS view that implements the Filter management section of the Manager view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/data-filter.html'
], function($, _, Backbone, template) {

    var DataFilterView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.currentFilters) )
                throwError('No filter passed to filter view');

            this.locators = {
                form: '#df-filter-form',
                beginDate: '#df-filter-begin-date',
                endDate: '#df-filter-end-date',
                test: '#df-filter-test',
                gender: '#df-filter-gender',
                age: '#df-filter-age',
                applyButton: '#df-filter-apply',
                applyLoading: '#df-filter-loading'
            };

            this.filters = args.currentFilters;

            this.template = template;
        },

        render: function(){

            this.$el.html(this.template);

            // Defaults
            this._setControlsFromFilter();

            // Event listeners
            this.$el.find(this.locators.form).on('submit', _.bind(this._filterClicked, this));
        },

        _setControlsFromFilter: function() {

            this.$el.find(this.locators.test).val(this.filters.test.value),
            this.$el.find(this.locators.gender).val(this.filters.gender.value),
            this.$el.find(this.locators.age).val(this.filters.age.value),
            this.$el.find(this.locators.beginDate).val(this.filters.beginDate.value);
            this.$el.find(this.locators.endDate).val(this.filters.endDate.value);
        },

        _filterClicked: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            if( ! this._validate() )
                return;

            // Collect the selections
            var newFilter = {
                test: {
                    value: this.$el.find(this.locators.test).val(),
                    text: this.$el.find(this.locators.test).find('option:selected').text()
                },
                gender: {
                    value: this.$el.find(this.locators.gender).val(),
                    text: this.$el.find(this.locators.gender).find('option:selected').text()
                },
                age: {
                    value: this.$el.find(this.locators.age).val(),
                    text: this.$el.find(this.locators.age).find('option:selected').text()
                },
                beginDate: {
                    value: this.$el.find(this.locators.beginDate).val(),
                    text: this.$el.find(this.locators.beginDate).val()
                },
                endDate: {
                    value: this.$el.find(this.locators.endDate).val(),
                    text: this.$el.find(this.locators.endDate).val()
                }
            };

            this.trigger('change:filter', newFilter);
        },

        _validate: function() {

            var begin = this.$el.find(this.locators.beginDate).val();
            var end = this.$el.find(this.locators.endDate).val();

            if( end === '' ) // Not completed yet
                return true;

            if( begin === '' ) // begin not selected yet. Every end date is valid
                return true;

            if( new Date(end).getTime() > new Date(begin).getTime() ) // End is after begin
                return true;

            showWarning('The begin date must be before the end date');
            this._shakeElementByID(this.locators.beginDate);
            this._shakeElementByID(this.locators.endDate);

            return false;
        },

        _shakeElementByID: function(elID) {

            var el = this.$el.find(elID);

            if( ! el.hasClass('animated') )
                el.addClass('animated');

            // Remove the shake animator
            el.removeClass('shake');
            // After a bit, animate it
            _.delay(function() {
                el.addClass('shake');
            }, 100);
        },

        disableApply: function() {

            var applyButton = this.$el.find(this.locators.applyButton);
            var loading = this.$el.find(this.locators.applyLoading);

            applyButton.attr('disabled', 'disabled');
            loading.removeClass('transparent').addClass('opaque');
        },

        enableApply: function() {

            var applyButton = this.$el.find(this.locators.applyButton);
            var loading = this.$el.find(this.locators.applyLoading);

            applyButton.removeAttr('disabled');
            loading.removeClass('opaque').addClass('transparent');
        }

    });

    return DataFilterView;
});