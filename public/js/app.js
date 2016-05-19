var app = angular.module('ChatApp', ['ngResource','ngCookies']);

app.controller('ChatController',[ '$rootScope' ,'$scope','Users','Messages','$cookies', ChatController]);

app.factory('Users', ['$resource',UsersFactory]);
app.factory('Messages', ['$resource',MessageFactory]);
