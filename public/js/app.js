var app = angular.module('ChatApp', ['ngResource']);

app.controller('ChatController',[ '$rootScope' ,'$scope','Users','Messages', ChatController]);

app.factory('Users', ['$resource',UsersFactory]);
app.factory('Messages', ['$resource',MessageFactory]);
