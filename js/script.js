var Users = {
	gio: {
		name: "Giò",
	},
	max: {
		name: "Max",
	}
}

Object.size = function(obj) {
    var size = 0, key;
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