define(function(require) {

    var Em = require('ember')
    var App = require('app')

    App.Router.map(function() {
        this.resource('landing', { path: '/' })
        this.resource('login')
        this.resource('about')
        this.resource('donate')
        this.resource('planner', { path: '/planner' }, function() {
            this.route('mehndi')
            this.route('baraat')
            this.route('valima')
            this.route('other')
        })
        this.resource('customizer', { path: '/customizer' }, function() {})
        this.resource('profile', { path: '/profile' }, function() {})
        this.resource('product')
        this.resource('cart')
        this.resource('payment')
    })

    App.PlannerRoute = Em.Route.extend({
        model: function() {
            return $.getJSON('/ShadiExpress/fixtures/vendors.json').then(function(data) {
                return {
                    vendors: data
                }
            })
        },
    })

    App.PlannerIndexRoute = Em.Route.extend({
        actions: {
            didTransition: function() {
                this.controller.set('controllers.planner.activeRouteName', 'planner.index')
            }
        }
    })

    App.PlannerMehndiRoute = Em.Route.extend({
        actions: {
            didTransition: function() {
                this.controller.set('controllers.planner.activeRouteName', 'planner.mehndi')
            }
        }
    })

    App.PlannerBaraatRoute = Em.Route.extend({
        actions: {
            didTransition: function() {
                this.controller.set('controllers.planner.activeRouteName', 'planner.baraat')
            }
        }
    })

    App.PlannerValimaRoute = Em.Route.extend({
        actions: {
            didTransition: function() {
                this.controller.set('controllers.planner.activeRouteName', 'planner.valima')
            }
        }
    })

    App.PlannerOtherRoute = Em.Route.extend({
        actions: {
            didTransition: function() {
                this.controller.set('controllers.planner.activeRouteName', 'planner.other')
            }
        }
    })

    App.CustomizerRoute = Em.Route.extend({
        model: function() {
            return $.getJSON('/ShadiExpress/fixtures/selected_vendors.json').then(function(data) {
                return {
                    vendors: data
                }
            })
        }
    })

    App.ProfileRoute = Em.Route.extend({
        model: function() {
            return $.getJSON('/ShadiExpress/fixtures/profile_vendor.json')
        }
    })

})
