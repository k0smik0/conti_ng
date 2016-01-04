var Users = {
	giovanna: {
		name: "Giovanna",
		username: "giovanna"
	},
	massimiliano: {
		name: "Massimiliano",
		username: "massimiliano"
	}
};

var ParseConfig = {
	"application_id": "MZQdm0ZZ0EaTYYE8GnuWlqWu2fzgwscDVtIU5cWs",
	"rest_api_key": "XtI77oOBItZjMtCu0lTKVyPHe8vw0gbgGcgTpiVD",
	"javascript_key": "v1MQE4NZyJWkqe29V93yR6MYgzssdfqpuDFdJ7xT",
	classes: ['expense','credit']
};
Parse.initialize(ParseConfig.application_id, ParseConfig.javascript_key);

Object.size = function(obj) {
    var size = 0, key = 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var parseQueryString = function() {
	var str = window.location.search;
	var objURL = {};
	str.replace( new RegExp( "([^?=&]+)(=([^&]*))?", "g" ), function( $0, $1, $2, $3 ) { objURL[ $1 ] = $3; } );
	return objURL;
};

var isEmptyItem = function(literalObject) {
	var keys = Object.keys(literalObject);
//	console.log(keys);
	for (var i in keys) {
		var key = keys[i];
		var value = literalObject[key];
//		console.log(key+" "+value);		
		if (value == null || value == undefined || value == "" || value == 0) {
//			console.log(key+" "+value);
			return true;
		}
	}
	return false;
};