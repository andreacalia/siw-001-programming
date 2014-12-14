/**
 * BackboneJS model that represents a group of countries.
 * It stores all the relevant information. Also contains some duplicate (reference only) data (eg. rawData) for performance reasons.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

	var GroupModel = Backbone.Model.extend({

		defaults: {
			id: null,
			name: null,
			description: null,
			countryCodes: [], // Codes that should be in the group
			availableCountryCodes: [], // Codes that really are in the group. For example, may be the case that we select a country for this group but that country does not appear in the data.
			groupConflicts: [], // {id, name} of the groups that conflicts with this. That is, that share one or more countries.
			rawData: [], // Stores a reference of the "availableCountryCodes" raw data
			aggTime: null,
			aggScore: null
		},

		initialize: function() {

		},

        /**
         * These data are the ones that are calculated at runtime. Can be deleted without altering the group "meaning" (eg Europe still have the right regions)
         */
		resetDynamicData: function() {

			this.set('availableCountryCodes', []);
            this.set('groupConflicts', []);
            this.set('rawData', []);
            this.set('aggTime', null);
            this.set('aggScore', null);
		},

        isThisElementNeeded: function(element) {
        	
        	return _.contains(this.get('countryCodes'), element.country);
        },

        storeElement: function(element) {

        	// This element is now available
        	this.get('availableCountryCodes').push(element.country);
            // Store a reference of the raw data
            this.get('rawData').push(element);
        },

        processData: function() {

        	var numElements = _.size(this.get('rawData'));

            // If there are no raw data, skip
            if( numElements <= 0 )
                return;

            // Calculate aggregate data
            var timeSum = _.reduce(this.get('rawData'), function(sum, el) {

                return sum + parseInt(el.time_average);
                
            }, 0);

            var scoreSum = _.reduce(this.get('rawData'), function(sum, el) {

                return sum + parseInt(el.score_average);

            }, 0);

        	this.set('aggTime', (timeSum / numElements).toFixed(2));
        	this.set('aggScore', (scoreSum / numElements).toFixed(2));
        },

        getAggregatedDataAsArray: function(name) {

        	var arr = [];

        	_.each(this.get('availableCountryCodes'), function(countryCode) {

        		var avg = name === 'time' ? this.get('aggTime') : name === 'score' ? this.get('aggScore') : throwError('Parameter not correct');
        		
        		arr.push({
        			countryCode: countryCode,
        			average: avg
        		});

        	}, this);

        	return arr;
        }

	});

	return GroupModel;
});



