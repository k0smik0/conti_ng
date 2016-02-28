/**
 * 
 */
var GoogleApiServiceClient = {
	client_id: "343159070149-5kb3but4ev07fcd6rsdlju694idr25ph.apps.googleusercontent.com",
	scopes: [
		// "https://www.googleapis.com/auth/script.external_request",
		// "https://www.googleapis.com/auth/script.storage",
		// "https://www.googleapis.com/auth/script.storage"
		"https://www.googleapis.com/auth/spreadsheets" ],
	script_id: "MgBSW7vErQNLflZXN0pSo_Bmb0qzzQGAX",
	authorized: false,
	methods: {
		update: function callUpdateOnGA() {
			if (!this.authorized) {
				console.log("not authorized?!");
				return;
			}
			// ID of the script to call. Acquire this from the Apps Script editor,
			// under Publish > Deploy as API executable.
			var scriptId = /*GoogleApiServiceClient.script_id;*/
				this.script_id;
			
			// Initialize parameters for function call.
		//	var sheetId = "1-Cz8cQVpuMFNMmiMHLzjw-roPPi081NI7teOb7lBuX4";
			
			// Create execution request.
			var request = {
			    'function': 'updateFromParse'
			//    'parameters': [sheetId],
		    	,'parameters': [""+(new Date())]
		//	    ,'devMode': true   // Optional.
			};
			
			// Make the request.
			var op = gapi.client.request({
			    'root': 'https://script.googleapis.com',
			    'path': 'v1/scripts/' + scriptId + ':run',
			    'method': 'POST',
			    'body': request
			});
			
			// Log the results of the request.
			op.execute(function(resp) {
				console.log(new Date()+": calling the update");
		//		console.log(JSON.stringify(resp));
				if (resp.error && resp.error.status) {
				    // The API encountered a problem before the script started executing.
					console.log('Error calling API: ' + JSON.stringify(resp, null, 2));
				} else if (resp.error) {
				    // The API executed, but the script returned an error.
					var error = resp.error.details[0];
					console.log('Script error! Message: ' + error.errorMessage);
				} else {
				    // Here, the function returns an array of strings.
				//	    var sheetNames = resp.response.result;
				//	    console.log('Sheet names in spreadsheet:');
				//	    sheetNames.forEach(function(name){
				//	      console.log(name);
				//	    });
				//		  console.log('results: ');
				  console.log('results: '+JSON.stringify( resp.response ));
				}
			});
		//	console.log("after calling");
		}
	}
};

//var GoogleApiServiceInit = new GoogleApiServiceClass().init();
var GoogleApiService = {
	deferred: {},
	handleAuthResult: function (authResult) {
		var authorizeDiv = document.getElementById('authorize-div');
		if (authResult && !authResult.error) {
			// Hide auth UI, then load client library.
			authorizeDiv.style.display = 'none';
			GoogleApiServiceClient.authorized = true;
//			console.log("google authorized: "+GoogleApiServiceClient.authorized);
			var d = GoogleApiService.deferred;
//			console.log(d);
			d.resolve(true);
		} else {
			// Show auth UI, allowing the user to initiate authorization by
			// clicking authorize button.
			authorizeDiv.style.display = 'inline';
			GoogleApiServiceClient.authorized = false;
			var d = GoogleApiService.deferred;
			console.log(d);
			d.reject('error');
		}		
	},
	checkAuth: function (client_id, scopes) {
//		console.log(JSON.stringify(gapi));
		gapi.auth.authorize({
			'client_id' : 
//				GoogleApiServiceClient.client_id,
				client_id,
			'scope' : 
//				GoogleApiServiceClient.scopes.join(),
				scopes,
			'immediate' : true
		}, this.handleAuthResult);
		return GoogleApiService.deferred.promise;
	},
	init: function(deferred, client_id, scopes) {
//		console.log("checking auth");
		GoogleApiService.deferred = deferred;
//		console.log(this.deferred);
		return this.checkAuth(client_id, scopes);
	},
	handleAuthClick: function(event) {
		gapi.auth.authorize({
			client_id : GoogleApiServiceClient.client_id,
			scope : GoogleApiServiceClient.scopes,
			immediate : false
		}, this.handleAuthResult);
		return false;
	}
};

/*function initGoogleApiClient() {
//	console.log("here");
	checkAuth();
}
function checkAuth() {
	gapi.auth.authorize({
		'client_id' : CLIENT_ID,
		'scope' : SCOPES.join(),
		'immediate' : true
	}, handleAuthResult);
}*/
/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
/*function handleAuthClick(event) {
	gapi.auth.authorize({
		client_id : CLIENT_ID,
		scope : SCOPES,
		immediate : false
	}, handleAuthResult);
	return false;
}*/
/*function handleAuthResult(authResult) {
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		authorizeDiv.style.display = 'none';
		authorized = true;
	} else {
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		authorizeDiv.style.display = 'inline';
		authorized = false;
	}
}*/
