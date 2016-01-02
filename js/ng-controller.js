angular.module('ContiApp', ['localization'])
.controller('ContiController', [ '$scope', function($scope) {
	
	$scope.users = { from: {}, to: {} }
	
	var params = parseQueryString();
	$scope.users.from = Users[params.from];
	$scope.users.to = Users[params.to];
	
	$scope.formData = {
		expense: { 
			what: {}, howmuch: {}, when: {}, where: {} 	
		}, 
		credit: { 
			what: {}, howmuch: {}, when: {}
		}		
	}
	
  $scope.expenseRows = ['0'];
	$scope.expenseIndex = 0;
  $scope.expenseRowsFutureCounter = 2;  
  $scope.expenseAddRow = function() {
		$scope.expenseIndex++;
    $scope.expenseRows.push( $scope.expenseIndex );
    $scope.expenseRowsFutureCounter++;
  }
  $scope.expenseRemoveRow = function() {
    $scope.expenseRows.pop( $scope.expenseIndex );
		$scope.expenseIndex--;
    $scope.expenseRowsFutureCounter--;
  }
  
  
	$scope.creditRows = ['0'];
	$scope.creditIndex = 0;
  $scope.creditRowsFutureCounter = 2;  
  $scope.creditAddRow = function() {
		$scope.creditIndex++;
    $scope.creditRows.push( $scope.creditIndex );
    $scope.creditRowsFutureCounter++;
  }
  $scope.creditRemoveRow = function() {
    $scope.creditRows.pop( $scope.creditIndex );
		$scope.creditIndex--;
    $scope.creditRowsFutureCounter--;
  }
  
  // init
//   for (var i=0;i<2;i++) {
// 		$scope.expenseAddRow();
// 		$scope.creditAddRow();
// 	}
	
	
	$scope.submit = function() {
    // check to make sure the form is completely valid
		console.log($scope.formData);
    if ($scope.formData) {
//       alert('our form is amazing');
			console.log( JSON.stringify($scope.formData));
			
			var formdata = $scope.formData;
			
			var expense = formdata.expense;
			var expenseLength = Object.size(formdata.expense.what);
			console.log(expenseLength);
			var expenseParse = [];
			for (var i=0;i<expenseLength;i++) {
				expenseParse.push( { what: expense.what[i], howmuch: expense.howmuch[i], when: expense.when[i], where: expense.where[i] } );
			}
			
			var credit = formdata.credit;
			var creditLength = Object.size(formdata.credit.what);
			console.log(creditLength);
			var creditParse = [];
			for (var i=0;i<creditLength;i++) {
				creditParse.push( { what: credit.what[i], howmuch: credit.howmuch[i], when: credit.when[i] } );
			}
			
			console.log( JSON.stringify(expenseParse));
			console.log( JSON.stringify(creditParse));
    }
  };
}])
// from https://gist.github.com/maikeldaloo/5133963 and https://gist.github.com/wladston/5610098
.directive('customSubmit', function() {
	return {
		restrict: 'A',
		link: function( scope , element , attributes ) {
			
			element.bind('submit', function(e) {
				e.preventDefault();
				
				['input', 'textarea', 'select'].forEach(function(e){
						element.find(e).removeClass('ng-pristine');
				});
				
				// Get the form object.
				var form = scope[ attributes.name ];
					
				// Set all the fields to dirty and apply the changes on the scope so that
				// validation errors are shown on submit only.
				angular.forEach( form , function ( formElement , fieldName ) {
						// If the fieldname starts with a '$' sign, it means it's an Angular
						// property or function. Skip those items.
						if ( fieldName[0] === '$' ) return;
						
						formElement.$pristine = false;
						formElement.$dirty = true;
						formElement.$setDirty();
				});
				scope.$apply();
					
				// Do not continue if the form is invalid.
				if ( form.$invalid ) {
					// original, not working
					// $element.find('.ng-invalid').first().focus();
					// fix - k0smik0
					var elemToFocus = null;
					angular.forEach(document.querySelectorAll('input.ng-invalid'), function(elem) {
						if (elem!=null) {
							elem.focus();
							if (elemToFocus==null) {
								elemToFocus = elem;
							}
						}
					});
					elemToFocus.focus();
						
					return false;
				}
					
				// From this point and below, we can assume that the form is valid.
				scope.$eval( attributes.customSubmit );
				scope.$apply();
			});
		}
	};
});




// (function init(){
// 	for (var i=0;i<9;i++) {
// 		angular.element(document.getElementById('div1')).scope().addRow();
// 	}
// })();

function getLanguage() {
	var lang = window.navigator.language || window.navigator.userLanguage;
	console.log(lang);
	return lang;
}