/**
 * BackboneJS model that takes care of getting the information from the remote web service.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

	var RemoteDataModel = Backbone.Model.extend({

		defaults: {
			remoteURL: 'http://emotional-apps.com/apis/meit/stats/getdata.php',
			rawData: null
		},

		initialize: function() {

		},

		loadData: function(params) {

			var url = this.get('remoteURL') + "?";

			url += 'test=';
			if( params.test ) {
				url += params.test;
			}

			url += '&gender=';
			if( params.gender ) {
				url += params.gender;
			}

			url += '&age=';
			if( params.age ) {
				url += params.age;
			}

			url += '&begindate=';
			if( params.beginDate ) {
				url += params.beginDate;
			}

			url += '&enddate=';
			if( params.endDate ) {
				url += params.endDate;
			}

			console.info('Getting: ' + url);

			var that = this;

			$.getJSON(url)
			.done(function(data) {

				// Assure always a change
				that.unset('rawData', {silent: true});
				that.set('rawData', data);

				console.debug('Data loaded');
			})
			.fail(function( jqxhr, textStatus, error ) {

				console.error('Request failed [' + url + ']: ' + jqxhr.statusText + ' ( ' + jqxhr.status + ' )');

				throwError(new Error('Error getting data from ' + that.get('remoteURL')));
			});
		}

	});

	return RemoteDataModel;
});



