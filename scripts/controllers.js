define(function(require) {

    var Em = require('ember')
    var App = require('app')

    App.LandingController = Em.ObjectController.extend({

        isMehndiSelected: true,
        isBaraatSelected: true,
        isValimaSelected: true,
        isOtherSelected: false,

        actions: {
            getStarted: function() {
                var isMehndiSelected = this.get('isMehndiSelected')
                var isBaraatSelected = this.get('isBaraatSelected')
                var isValimaSelected = this.get('isValimaSelected')
                var isOtherSelected = this.get('isOtherSelected')
                if ( !isMehndiSelected && !isBaraatSelected && !isValimaSelected && !isOtherSelected ) {
                    alert('Please select an event you’d like to plan.')
                    return
                }
                this.transitionToRoute('planner')
            }
        }

    })

    App.PlannerController = Em.ObjectController.extend({
        budget: null,
        activeRouteName: null,
        needs: ['landing'],
        isMehndiSelected: Em.computed.alias('controllers.landing.isMehndiSelected'),
        isBaraatSelected: Em.computed.alias('controllers.landing.isBaraatSelected'),
        isValimaSelected: Em.computed.alias('controllers.landing.isValimaSelected'),
        isOtherSelected: Em.computed.alias('controllers.landing.isOtherSelected'),
        isBudgetActive: function() {
            return this.get('activeRouteName') == 'planner.index'
        }.property('activeRouteName'),
        isMehndiActive: function() {
            return this.get('isMehndiSelected') && this.get('activeRouteName') == 'planner.mehndi'
        }.property('activeRouteName'),
        isBaraatActive: function() {
            return this.get('isBaraatSelected') && this.get('activeRouteName') == 'planner.baraat'
        }.property('activeRouteName'),
        isValimaActive: function() {
            return this.get('isValimaSelected') && this.get('activeRouteName') == 'planner.valima'
        }.property('activeRouteName'),
        isOtherActive: function() {
            return this.get('isOtherSelected') && this.get('activeRouteName') == 'planner.other'
        }.property('activeRouteName'),
        categories: function() {
            var vendors = this.get('model.vendors')
            var categories = []
            vendors.forEach(function(vendor) {
                var category = categories.findBy('name', vendor.category)
                if ( !category ) {
                    categories.push({
                        name: vendor.category,
                        drag_id: 'category_' + vendor.category.toLowerCase().replace(/ /g, '_')
                    })
                }
            })
            return categories
        }.property('model.vendors'),
        checkHasSelectedSomething: function() {
            var isMehndiSelected = this.get('isMehndiSelected')
            var isBaraatSelected = this.get('controllers.landing.isBaraatSelected')
            var isValimaSelected = this.get('controllers.landing.isValimaSelected')
            var isOtherSelected = this.get('controllers.landing.isOtherSelected')
            if ( !isMehndiSelected && !isBaraatSelected && !isValimaSelected && !isOtherSelected ) {
                this.transitionToRoute('landing')
                return
            }
        }.on('init'),
        checkHasEnteredBudget: function() {
            if ( !this.get('budget') ) {
                this.transitionToRoute('planner.index')
                return
            }
        }.on('init'),
        goToEither: function(sections) {
            for ( var i = 0; i < sections.length; i++ ) {
                var section = sections[i]
                if ( this.get('is' + section.classify() + 'Selected') ) {
                    this.transitionToRoute('planner.' + section)
                    return true
                }
            }
            return false
        },
        actions: {
            goToBudget: function() {
                this.transitionToRoute('planner.index')
            },
            goToMehndi: function() {
                if ( !this.get('budget') ) {
                    alert('Please enter a budget first.')
                    return
                }
                this.transitionToRoute('planner.mehndi')
            },
            goToBaraat: function() {
                if ( !this.get('budget') ) {
                    alert('Please enter a budget first.')
                    return
                }
                this.transitionToRoute('planner.baraat')
            },
            goToValima: function() {
                if ( !this.get('budget') ) {
                    alert('Please enter a budget first.')
                    return
                }
                this.transitionToRoute('planner.valima')
            },
            goToOther: function() {
                if ( !this.get('budget') ) {
                    alert('Please enter a budget first.')
                    return
                }
                this.transitionToRoute('planner.other')
            },
            nextStep: function() {
                var budget = this.get('budget')
                if ( !budget || !/^[\d, ]+$/.test(budget) ) {
                    alert('Please enter a valid budget first (numbers and commas only).')
                    return
                }
                var activeRouteName = this.get('activeRouteName')
                if ( activeRouteName == 'planner.index' ) {
                    if ( this.goToEither(['mehndi', 'baraat', 'valima', 'other']) ) {
                        return
                    }
                }
                if ( activeRouteName == 'planner.mehndi' ) {
                    if ( this.goToEither(['baraat', 'valima', 'other']) ) {
                        return
                    }
                }
                if ( activeRouteName == 'planner.baraat' ) {
                    if ( this.goToEither(['valima', 'other']) ) {
                        return
                    }
                }
                if ( activeRouteName == 'planner.valima' ) {
                    if ( this.goToEither(['other']) ) {
                        return
                    }
                }
                this.transitionToRoute('customizer')
            }
        },
    })

    App.PlannerIndexController = Em.ObjectController.extend({
        needs: ['planner'],
        categories: Em.computed.alias('controllers.planner.categories'),
    })

    App.PlannerMehndiController = App.PlannerIndexController.extend()

    App.PlannerBaraatController = App.PlannerIndexController.extend()

    App.PlannerValimaController = App.PlannerIndexController.extend()

    App.PlannerOtherController = App.PlannerIndexController.extend()

    App.CustomizerController = Em.ObjectController.extend({
        needs: ['planner'],
        categories: function() {
            var vendors = this.get('vendors')
            if ( !vendors ) {
                return
            }
            var categories = []
            vendors.forEach(function(vendor) {
                var category = categories.findBy('name', vendor.category)
                if ( !category ) {
                    category = {
                        name: vendor.category,
                        vendors: [],
                    }
                    categories.push(category)
                }
                category.vendors.push(vendor)
            })
            return categories
        }.property('vendors'),
        vendors: function() {
            var vendors = this.get('model.vendors')
            var suggestedVendors = this.get('controllers.planner.vendors')
            if ( !suggestedVendors ) {
                this.transitionToRoute('planner.index')
                return
            }
            vendors = vendors.map(function(vendor) {
                vendor.isSelected = true
                return vendor
            })
            suggestedVendors = suggestedVendors.filter(function(vendor) {
                return !vendors.findBy('id', vendor.id)
            })
            return vendors.concat(suggestedVendors)
        }.property('model.vendors')
    })

})
