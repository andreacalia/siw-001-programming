/**
 * BackboneJS model that represents a raw data. Raw data are the objects loaded from the web service.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

	var RawModel = Backbone.Model.extend({

		defaults: {
            countryCode: null,
            scoreAverage: null,
            timeAverage: null
		},

		initialize: function() {

		},

        fromRawData: function(data) {

            this.set('countryCode', data.country);
            this.set('scoreAverage', parseFloat(data.score_average).toFixed(2));
            this.set('timeAverage', parseFloat(data.time_average).toFixed(2));
        }

	});

	return RawModel;
});



