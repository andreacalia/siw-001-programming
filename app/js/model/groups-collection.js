/**
 * BackboneJS collection of group models. Provide helpers that apply on all the groups.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'js/model/group-model'
], function($, _, Backbone, GroupModel) {

	var GroupsCollection = Backbone.Collection.extend({

        model: GroupModel,

        digestElements: function(elements) {

        	// Stores the elements
        	_.each(elements, function(element) {

                this._digestElement(element);

            }, this);

            // Process groups
            this.each(function(group) {

            	group.processData();
            });
        },

        _digestElement: function(element) {

        	// Filter the groups that have this country on it
	        var groupsWithThisElement = this.filter(function(group) {

	            return group.isThisElementNeeded(element);
	        });

	        if(_.size(groupsWithThisElement) === 0) {

	            console.debug('No groups found for element ' + JSON.stringify(element));
	            return;
	        }

	        // Add the element to each group
	        _.each(groupsWithThisElement, function(group) {

	            // Mark this country as available
	            group.storeElement(element);

	            // Get the groups of this element of the rawData without the current (it can't conflict with itself)
	            var myId = group.get('id');
	            var groupsWithThisElementWithoutMe = _.reduce(groupsWithThisElement, function(memo, el) {

	                if( el.get('id') !== myId ) {

	                    var conflict = {
	                        id: el.get('id'),
	                        name: el.get('name')
	                    };

	                    memo.push(conflict);
	                }

	                return memo;

	            }, []);

	            // Set the new conflicts
	            var newConflicts = _
	                .chain(groupsWithThisElementWithoutMe)
	                .union(group.get('groupConflicts'))
	                .uniq(function(item) {
	                    return item.id;
	                })
	                .value(); // This does not merge duplicates

	            // Set the conflicts with this group
	            group.set('groupConflicts', newConflicts);
	            
	        });
        },

        cleanDynamicGroupsData: function() {

        	this.forEach(function(group) {

                group.resetDynamicData();
            });
        }

    });

	return GroupsCollection;
});



