define(function(require) {

    var Em = require('ember')
    var $ = require('jquery')
    var App = require('app')
    require('jquery.sortable')

    App.LandingView = Em.View.extend({
        willInsertElement: function() {
            $('html').addClass('landing')
        },
        willDestroyElement: function() {
            $('html').removeClass('landing')
        }
    })

    App.PlannerBaraatView = Em.View.extend({
        didInsertElement: function() {
            enableSorting(this.$().find('.js-sortable'))
        }
    })

    App.PlannerMehndiView = Em.View.extend({
        didInsertElement: function() {
            enableSorting(this.$().find('.js-sortable'))
        }
    })

    App.PlannerValimaView = Em.View.extend({
        didInsertElement: function() {
            enableSorting(this.$().find('.js-sortable'))
        }
    })

    function enableSorting($el) {
        var adjustment
        $el.sortable('destroy')
        $el.sortable({
            group: 'js-sortable',
            pullPlaceholder: false,

            onMousedown: function($item, _super, event) {
                return $item.find('input[type=checkbox]').is(':checked')
            },

            // set item relative to cursor position
            onDragStart: function ($item, container, _super) {
                var offset = $item.offset(),
                pointer = container.rootGroup.pointer

                adjustment = {
                    left: pointer.left - offset.left,
                    top: pointer.top - offset.top
                }

                _super($item, container)
            },

            onDrag: function ($item, position) {
                $item.css({
                    left: position.left - adjustment.left,
                    top: position.top - adjustment.top
                })
            },

            // animation on drop
            onDrop: function  (item, targetContainer, _super) {
                var clonedItem = $('<li/>').css({height: 0})
                item.before(clonedItem)
                clonedItem.animate({'height': item.height()})

                item.animate(clonedItem.position(), function  () {
                    clonedItem.detach()
                    _super(item)
                })
            }
        })
    }

})
