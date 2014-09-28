define(function(require) {

    var Em = require('ember')

    var fileNames = [
        'application',
            'landing',
            'planner',
                'planner/index',
                'planner/mehndi',
                'planner/baraat',
                'planner/valima',
            'customizer',
            'profile',
    ]

    var requiredPaths = fileNames.map(function(file) {
        return 'text!/ShadiExpress/templates/' + file + '.hbs'
    })

    require(requiredPaths, function() {

        for ( var i = 0; i < fileNames.length; i+= 1 ) {
            var fileName = fileNames[i]
            var fileContent = arguments[i]
            if ( fileName in Em.TEMPLATES ) {
                throw 'The template "' + fileName + '" is already registered.'
            }
            Em.TEMPLATES[fileName] = Em.Handlebars.compile(fileContent)
        }

        require(['app', 'routes', 'controllers', 'views'], function(App) {
            App.advanceReadiness()
        })

    })

})
