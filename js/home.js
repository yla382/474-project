/*global WildRydes _config*/

// Code modified from AWS WildRydes example for 474 Project. Modified by SM

var WildRydes = window.WildRydes || {};


(function rideScopeWrapper($) {
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

    function requestArticle(dummyText) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/article',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Article: {
                    Heading: 'This is a heading',
                    Topic: 'This is topic',
                    Content: dummyText
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
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
/*        animateArrival(function animateCallback() {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });*/
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                handleLogin();
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });
/*
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }*/
    });

/*    function handlePickupChanged() {
        var requestButton = $('#request');
        requestButton.text('Request Unicorn');
        requestButton.prop('disabled', false);
    }*/

    function handleRequestClick(event) {

        var dummyText = 'Dummy Test';

        handleLogin();
        event.preventDefault();
        requestArticle(dummyText);

    }


    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }

    function handleLogin() {
        $('#signIn').hide();
        $('#signOut').show();
        alert("User Logged In " + $("#signin").text());
    }


}(jQuery));
