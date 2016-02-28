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

var isEmptyItem = function(literalObject, exceptionKeysArrays) {
	var keys = Object.keys(literalObject);
	for (var i in keys) {
		var key = keys[i];
		if (keys.length<=exceptionKeysArrays.length) {
			return true;
		}
		
		var skip = false;
		for (var ekI in exceptionKeysArrays) {
			var ek = exceptionKeysArrays[ekI];
			if (key == ek) {
//				console.log("skipping "+key);
				skip = true;
			}
		}
		// too bad, but it seems "continue" do not reach external loop
		if (skip) {
//			console.log("continue loop due: "+key);
			continue;
		}
		
		var value = literalObject[key];
		if (value == null || value == undefined || value == "" /*|| value == 0*/) {
			return true;
		}
	}
	return false;
};

function getLanguage() {
	var lang = window.navigator.language || window.navigator.userLanguage;
	console.log(lang);
	return lang;
}

function getEpochTime(dateAsString) {
	return new Date(dateAsString).getTime();
}

var ConsoleTest = {
	one: function() {
		var formDataMock = { 
				expense:[ 
				          {what:"banane",howmuch:10,when:"2016-02-13",where:"abdul"},
				          {what:"lamponi",howmuch:15,when:"2016-01-07",where:"abdul"},
		                  {what:"pomodori",howmuch:13,when:"2016-02-01",where:"abdul"},
		                  {what:"noci",howmuch:5,when:"2016-12-10",where:"abdul"},
						  {what:"",howmuch:"",when:"2016-03-01",where:""} 
		                 ],
				credit:[ 
				         {what:"cose",howmuch:30,when:"2016-01-18"},
				         {what:"cose2",howmuch:20,when:"2016-01-02"} 
				        ]
		};
						 		  
		var i = 0;
		for (var j in formDataMock.expense) {
			var e = formDataMock.expense[j];
			var idPrefix = 'expenseInnerForm'+i+"_";
			for (var f in e) {
				var id = idPrefix+f;
//					console.log(id);
				var el = document.getElementById(id);
				el.value = e[f];
				el.className = "";
				el.className = "ng-touched ng-dirty ng-valid-required";
			}
			console.log(idPrefix);
//				document.getElementById(idPrefix+"username").value = "giovanna";
//				document.getElementById(idPrefix+"sheeted").value = f;
			document.getElementById("button__expense_add_row").click();
			i++;
		}
		i=0;
		for (var j in formDataMock.credit) {
			var e = formDataMock.credit[j];
			var idPrefix = 'creditInnerForm'+i+"_";
			for (var f in e) {
				var id = idPrefix+f;
//					console.log(id);
				var el = document.getElementById(id);
				el.value = e[f];
				el.className = "";
				el.className = "ng-touched ng-dirty ng-valid-required";
			}
//				document.getElementById(idPrefix+'username').value = "giovanna";
//				document.getElementById(idPrefix+'sheeted').value = f;
			document.getElementById("button__credit_add_row").click();
			i++;
		}
	}
}