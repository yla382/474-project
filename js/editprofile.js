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

    function editProfile(name, email, experience, description) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/editprofile',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Profile: {
                    Name: name,
                    Email: email,
                    Experience: experience,
                    Description: description
                }
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
    	alert(result);
    }


    $(function onDocReady() {
        $('#edit_button').click(handleRequestClick);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });
    });

    function handleRequestClick(event) {
    	 event.preventDefault();
    	 let get_name = $('#form_name').val();
    	 let get_email = $('#form_email').val();
    	 let get_exp = $('form_exp').val();
    	 let get_desc = $('#form_desc').val();
    	 editProfile(get_name, get_email, get_exp, get_desc);

    }
}(jQuery));