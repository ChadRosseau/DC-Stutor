angular.module("myApp", [])

var app = angular.module("myApp", ["ngRoute", "ui.router", "firebase"]);


app.directive('navbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/navbar.html'
    }
});

app.directive('myfooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/footer.html'
    }
});


app.config(function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "home.html",
        })

        .when("/about", {
            templateUrl: "about.html",
        })

        .when("/contact", {
            templateUrl: "contact.html",
        })

        .when("/profile", {
            templateUrl: "profile.html",
        })

        .when("/tickets", {
            templateUrl: "tickets.html",
        })

        .when("/login", {
            templateUrl: "login.html",
        })

        .otherwise({
            redirectTo: '/home'
        });
});