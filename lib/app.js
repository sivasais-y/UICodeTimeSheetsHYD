/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('myApp', ['ui.router', 'ui.bootstrap','ui.grid','ui.grid.pagination','ui.grid.treeView']);

app.config(function ($stateProvider) {

    $stateProvider.state({
        name: 'home',
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
    }).state({
        name: 'practice',
        url: '/practice',
        templateUrl: 'views/practice.html',
        controller: 'practiceCtrl'
    }).state({
        name: 'toDoItems',
        url: '/toDoItems',
        templateUrl: 'views/application/todoitems.html',
        controller: 'AppToDoItemsController'
    }).state({
        name: 'notes',
        url: '/notes',
        templateUrl: 'views/application/appnotesdoc.html',
        controller: 'AppNotesController',
        controllerAs: 'appNtndDc'
    }).state({
        name: 'documents',
        url: '/documents',
        templateUrl: 'views/application/appDocuments.html',
        controller: 'AppDocsController'
    }).state({
        name: 'scores',
        url: '/scores',
        templateUrl: 'views/application/appScores.html',
        controller: 'AppScoreController'
    }).state({
        name: 'timeSheets',
        url: '/timeSheets',
        templateUrl: 'views/timesheets/timesheet.html',
        controller: 'AppTimeSheetsController'
    }).state({
        name: 'timeSheetDetails',
        url: '/timeSheetDetails',
        templateUrl: 'views/timesheets/timesheetDetails.html',
        controller: 'AppTimeSheetDetailsController'
    }).state({
        name: 'editTimeSheet',
        url: '/editTimeSheet/:id',
        templateUrl: 'views/timesheets/timesheet.html',
        controller: 'AppEditTimeSheetController'
    }).state({
        name: 'devResults',
        url: '/devResults',
        templateUrl: 'views/timesheets/devResults.html',
        controller: 'devResultsController',
        controllerAs:'devRes'
    });

});