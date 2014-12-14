/**
 * BackboneJS collection that stores raw data models.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/model/raw-model'
], function($, _, Backbone, RawModel) {

	var RawCollection = Backbone.Collection.extend({

        model: RawModel,

        digestElements: function(elements) {

        	// Stores the elements
        	_.each(elements, function(element) {

                this._digestElement(element);

            }, this);

        },

        _digestElement: function(element) {

        	var model = new RawModel();
        	model.fromRawData(element);

        	this.add(model);
        },

        clean: function() {

            this.reset();
        }

    });

	return RawCollection;
});



