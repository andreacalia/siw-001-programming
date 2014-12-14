/**
 * BackboneJS view that implements the Analysis section of the Dashboard view.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/dashboard-analysis.html'
], function($, _, Backbone, template) {

    var DashboardAnalysisView = Backbone.View.extend({

        initialize: function(args) {

            this.group = null;
            this.analysis = null;
            
            this.template = template;
        },

        render: function(){

            var compiled = _.template(this.template)({
                analysis: this.analysis
            });
            this.$el.html(compiled);
        },

        setGroup: function(group) {

            this.group = group;

            this._analyze();
        },

        _analyze: function() {

            var minTimeData = _.min(this.group.get('rawData'), function(raw) {
                return raw.time_average;
            });
            var maxTimeData = _.max(this.group.get('rawData'), function(raw) {
                return raw.time_average;
            });

            var minScoreData = _.min(this.group.get('rawData'), function(raw) {
                return raw.score_average;
            });
            var maxScoreData = _.max(this.group.get('rawData'), function(raw) {
                return raw.score_average;
            });

            var table = _.reduce(this.group.get('rawData'), function(memo, raw) {

                memo.push({
                    name: raw.country,
                    time: parseFloat(raw.time_average).toFixed(2),
                    score: parseFloat(raw.score_average).toFixed(2),
                });

                return memo;

            }, []);

            this.analysis = {
                minTime: {
                    country: minTimeData.country,
                    value: minTimeData.time_average
                },
                maxTime: {
                    country: maxTimeData.country,
                    value: maxTimeData.time_average
                },
                minScore: {
                    country: minScoreData.country,
                    value: minScoreData.time_average
                },
                maxScore: {
                    country: maxScoreData.country,
                    value: maxScoreData.time_average
                },
                table: table,
                groupName: this.group.get('name'),
                groupAggTime: this.group.get('aggTime'),
                groupAggScore: this.group.get('aggScore'),
                description: this.group.get('description')
            };
        }

    });

    return DashboardAnalysisView;
});