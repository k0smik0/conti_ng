'use strict';

function ParseServiceImpl() {
	var timeout = 2000;
	var exec = function(formData,result) {
// 		console.log("formData: "+JSON.stringify(formData));
		var promises = [];
		for (var i in ParseConfig.classes) {
			var parseClassAsString = ParseConfig.classes[i];
			var arrayData = formData[parseClassAsString];
//console.log("arrayData("+arrayData.length+"):"+JSON.stringify(arrayData)+" from "+parseClassAsString);
			var resultClass = result.classes[parseClassAsString];
			resultClass.progress.processed = 0;
			resultClass.progress.toProcess = arrayData.length;

			var ParseClass = Parse.Object.extend(parseClassAsString);
//console.log("ParseClass: "+parseClassAsString+" - start");
			for (var j in arrayData) {
				var item = arrayData[j];
				// remove empty item from empty row in form
				/*if (isEmptyItem(d, ['sheeted','username'])) {
					arrayData.splice(j,1);
					resultClass.progress.toProcess--;
//console.log("spliced empty "+JSON.stringify(d)+" from "+parseClassAsString+" - arrayData.length:"+arrayData.length);
					continue;
				}*/
				console.log("saving: "+item);
				resultClass.remaining.push(item);
				var parseObject = new ParseClass();
//console.log("parseObject: "+console.log(JSON.stringify(parseObject)));
				// TODO restore two below
				var pobj = {};
				for (var key in item) {
					var value = item[key];
					if (value instanceof Date) {
						var epoch = getEpochTime(value);
						console.log(epoch);
						pobj[key] = epoch;
					} else {
//						console.log("date? "+(value instanceof Date)+" - "+value);
						pobj[key] = value;
					}
				}
				console.log("converted to:"+JSON.stringify(pobj));
				var p = parseObject.save(pobj);
				promises.push( p );
console.log("pushed:"+JSON.stringify(p)+" to "+parseClassAsString);
			}
//console.log("ParseClass: "+parseClassAsString+" - end");
//console.log("");
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
				}, 
				errorHandler = function(response) {
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
}