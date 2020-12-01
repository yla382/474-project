var WildRydes = window.WildRydes || {};

(function editprofScopeWrapper($) {
	var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = './signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = './signin.html';
    });

    function getProfile() {
    	$.ajax({
    		method: 'GET',
    		url: _config.api.invokeUrl + '/editprofile',
    		headers: {
    			Authorization: authToken
    		},
    		contentType: 'json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
    	});
    }

    function completeRequest(result) {
    	alert(result.body);
    }

    $(function onDocReady() {
        getProfile();


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });
    });
}(jQuery));