angular.module('ContiApp', ['localization','ngResource'])
.service('ParseService', [function() {
	var app_id = ParseConfig.application_id;
	var js_key = ParseConfig.javascript_key;
	Parse.initialize(app_id, js_key);
}])
.factory('SubmitWithResult',function($q,$timeout){	
	var timeout = 2000;
	var exec = function(formData,result) {
// 		console.log("formData: "+JSON.stringify(formData));
		var promises = [];
		for (var i in ParseConfig.classes) {
			var parseClassAsString = ParseConfig.classes[i];
			var arrayData = formData[parseClassAsString];
			var resultClass = result.classes[parseClassAsString];
      resultClass.progress.processed = 0;
// 			console.log(parseClassAsString+": "+arrayData.length);
      resultClass.progress.toProcess = arrayData.length;

			var ParseClass = Parse.Object.extend(parseClassAsString);
// 			console.log("ParseClass: "+console.log(ParseClass));
			for (var j in arrayData) {
				var d = arrayData[j];
				// remove empty item from empty row in form
				if (isEmptyItem(d, 'sheeted')) {
					arrayData.splice(j,1);
					resultClass.progress.toProcess--;
					console.log("spliced "+JSON.stringify(d)+" from "+ parseClassAsString +" - parseClassAsString: "+arrayData.length);
					continue;
				}
				resultClass.remaining.push(d);
// 				console.log("pushing: "+JSON.stringify(d));
				var parseObject = new ParseClass();
// 				console.log("parseObject: "+console.log(parseObject));
				var p = parseObject.save(d);
				promises.push( p );
			}
		} // end for
		
		for (var i in promises) {
			var promise = promises[i];
// 			console.log("satisfying promise: "+JSON.stringify(promise));
			promise.then(
				goodHandler = function(response) {
					$timeout(function(){
//						console.log("response: "+JSON.stringify(response));
						var obj = JSON.parse( JSON.stringify(response) );
						var type;
						if (obj.where==null || obj.where==undefined || obj.where=="") {
							type = "credit";
							delete obj.where;
						} else {
							type = "expense";
						}
						delete obj.objectId; delete obj.createdAt; delete obj.updatedAt;
						result.classes[type].remaining.splice(obj, 1);
						result.classes[type].progress.processed++;
// 						console.log(type+" remaining: "+JSON.stringify(result.classes[type].remaining.length)+" "+JSON.stringify( obj )+", processed:" +result.classes[type].progress.processed);
					},timeout);
				}, errorHandler = function(response) {
					$timeout(function(){
//						console.log(status+" "+JSON.stringify(response));						
						result.isError = true;
						result.error.details.push( {code: JSON.stringify(response.error), message: JSON.stringify(response.code) } );
//						result.classes[type].progress.processed++;
// 						console.log(JSON.stringify(response));
					},timeout);
				}
			);
		}
	};	
	return {
		exec: exec
	};
})
.controller('ContiController', [ '$scope', 'ParseService', '$http', '$httpParamSerializerJQLike','$q', '$timeout', 'SubmitWithResult', function($scope,ParseService, $http,$httpParamSerializerJQLike,$q,$timeout,SubmitWithResult) {
	
	$scope.users = { from: {}, to: {} };
	var params = parseQueryString();
	if (params.from==undefined || params.to==undefined) {
		$scope.isParamsExistant = false;
	} else {
		$scope.isParamsExistant = true;
		$scope.users.from = Users[params.from];
		$scope.users.to = Users[params.to];
    $scope.sheeted_default = false;
	}
	
	$scope.formData = {
		expense: [], 
		credit: []				
	};
	
	$scope.expenseRows = ['0'];
	$scope.expenseIndex = 0;
	$scope.expenseRowsFutureCounter = 2;  
	$scope.expenseAddRow = function() {
		$scope.expenseIndex++;
		$scope.expenseRows.push( $scope.expenseIndex );
		$scope.expenseRowsFutureCounter++;
	};
	$scope.expenseRemoveRow = function() {
	   $scope.expenseRows.pop( $scope.expenseIndex );
		$scope.expenseIndex--;
	   $scope.expenseRowsFutureCounter--;
	};
  
  
	$scope.creditRows = ['0'];
	$scope.creditIndex = 0;
	$scope.creditRowsFutureCounter = 2;  
	$scope.creditAddRow = function() {
		$scope.creditIndex++;
		$scope.creditRows.push( $scope.creditIndex );
		$scope.creditRowsFutureCounter++;
	};
	$scope.creditRemoveRow = function() {
		$scope.creditRows.pop($scope.creditIndex);
		$scope.creditIndex--;
		$scope.creditRowsFutureCounter--;
	};
	
	$scope.resultBackground = function(processed, toProcess) {
		if (processed!=toProcess) {
			return "y";
		}
		if (processed==toProcess) {
			return "g";
		}
	};
  
  // init TODO restore
//   for (var i=0;i<2;i++) {
// 		$scope.expenseAddRow();
// 		$scope.creditAddRow();
// 	}
	
	var formData = { expense:[ {username:"giovanna",what:"banane",howmuch:10,when:"2016-11-30T23:00:00.000Z",where:"abdul",sheeted:$scope.sheeted_default},
	                           {username:"giovanna",what:"lamponi",howmuch:15,when:"2016-11-01T23:00:00.000Z",where:"abdul",sheeted:$scope.sheeted_default},
	                           {username:"giovanna",what:"pomodori",howmuch:13,when:"2016-12-01T23:00:00.000Z",where:"abdul",sheeted:$scope.sheeted_default},
	                           {username:"massimiliano",what:"noci",howmuch:5,when:"2016-12-10T23:00:00.000Z",where:"abdul",sheeted:$scope.sheeted_default},
														 {username:"",what:"",howmuch:"",when:"",where:"",sheeted:$scope.sheeted_default} ],
										credit:[ {username:"giovanna",what:"cose",howmuch:30,when:"2016-01-01T23:00:00.000Z",sheeted:$scope.sheeted_default},
														 {username:"giovanna",what:"cose2",howmuch:20,when:"2016-01-02T23:00:00.000Z",sheeted:$scope.sheeted_default} ]};
	$scope.formDataFake = formData;
	
	$scope.result = {
		classes: {
			expense: {
        progress: { processed: 0, toProcess: 0 },
				remaining: [],
			},
			credit: {
        progress: { processed: 0, toProcess: 0 },
				remaining: [],
			}
		},
		error: { isError: false, details: [{code: "", message: ""}] }
	};
	
	$scope.submitUsingFactory = function() {
		// TODO in production use $scope.formData
		SubmitWithResult.exec($scope.formDataFake,$scope.result);
//		$scope.divResultTarget.focus();
	};
	
	// TODO in production use $scope.formData
	/*$scope.submitObjectFake = function() {
		var promises = [];
		for (var i in ParseConfig.classes) {
			var parseClassAsString = ParseConfig.classes[i];
			var arrayData = formData[parseClassAsString];
			$scope.result.classes[parseClassAsString].progress.toProcess = arrayData.length;
			
			var ParseClass = Parse.Object.extend(parseClassAsString);
			var parseObject = new ParseClass();
			for (var j in arrayData) {
				var d = arrayData[j];
				// remove empty item from empty row in form
				if (isEmptyItem(d)) {
					console.log("splicing: "+JSON.stringify(d));
					arrayData.splice(j,1);
					$scope.result.classes[parseClassAsString].progress.toProcess--;
					continue;
				}
				$scope.result.classes[parseClassAsString].remaining.push(d);
				var p = parseObject.save(d);
				promises.push( p );
			}
			console.log("");
		} // end for
		
		for (var i in promises) {
			var promise = promises[i];
			promise.then(
				function(response) {
					$timeout(function() {
					console.log("response: "+JSON.stringify(response));
					var obj = JSON.parse( JSON.stringify(response)) ;
					var type;
					if (obj.where == null || obj.where==undefined || obj.where == "") {
						type = "credit";
						delete obj.where;
					} else {
						type = "expense";
					}
					delete obj.objectId; delete obj.createdAt;delete obj.updatedAt;
					console.log(type+" obj: "+JSON.stringify(obj));
					
					console.log("splicing obj from remaining: "+JSON.stringify(obj));
					$scope.result.classes[type].remaining.splice(obj, 1);
					console.log(type+" remaining: "+JSON.stringify($scope.result.classes[type].remaining));
					
					$scope.result.classes[type].progress.processed++;
					console.log(type+": "+JSON.stringify($scope.result.classes[type]));
					
					console.log("");
//					$scope.$apply;
					},0);
				}, function(response) {
					$timeout(function() {
					console.log(status+" "+JSON.stringify(response));
					$scope.result.isError = true;
					$scope.result.error.details.push( {code: JSON.stringify(response.error), message: JSON.stringify(response.code) } );
					$scope.result.classes[type].progress.processed++;
					},0);
				}
			);
		}
	};*/
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
})
/*.directive('focusOn',function($timeout) {
    return {
        restrict : 'A',
        link : function($scope,$element,$attr) {
            $scope.$watch($attr.focusOn,function(_focusVal) {
                $timeout(function() {
                    _focusVal ? $element.focus() : $element.blur();
                });
            });
        }
    };
})*/
.directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }

        }
    };
})
;

function getLanguage() {
	var lang = window.navigator.language || window.navigator.userLanguage;
	console.log(lang);
	return lang;
}
