/**
 * User: jim.lavin
 */

'use strict';

function AppController($scope, localize) {
//    $scope.People = [{FirstName:"Jim", LastName:"Lavin", Email:"jlavin@jimlavin.net", Bio:"Creator and Host of Coding Smackdown TV"}];

    $scope.setEnglishLanguage = function() {
        localize.setLanguage('en-US');
    };

    $scope.setItalianLanguage = function() {
        localize.setLanguage('it');
    };
}
