/**
 * BackboneJS view that implements the a simple loading widget.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone, template) {

    var LoadingView = Backbone.View.extend({

        initialize: function() {

            this.template = [
                '<div id="loading-container" class="animated bounceInDown" title="Loading">',
                    '<div class="fab">',
                        '<i class="fa fa-circle-o-notch fa-spin"></i>',
                    '</div>',
                '</div>'
            ].join('');
        },

        render: function(){

            this.$el.html(this.template);
        }

    });

    return LoadingView;
});