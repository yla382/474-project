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

    function requestCategory() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/category',
            headers: {
                Authorization: authToken
            },
/*            data: JSON.stringify({
                Category: {
                    Id: '0',
                    Title: 'This is a title'
                }
            }),*/
            //dataType: 'json',
            contentType: 'json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting category: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your category:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
/*        var unicorn;
        var pronoun;*/
        console.log('Response received from API: ', result);
/*        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');*/
        displayUpdate(result);
/*        animateArrival(function animateCallback() {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });*/
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request2').click(handleRequestClick);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
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

        //var dummyText = 'Dummy Test';
        event.preventDefault();
        requestCategory();
        alert("Category js click");

    }


    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }

    function handleLogin() {
/*        $('#signIn').hide();
        $('#signOut').show();*/
        //alert("User Logged In " + $("#signin").text());
        $('#signOut').append($('<a class="nav-link" href="./signout.html"> Sign Out </a>'));
        $('#signIn').remove();
    }


}(jQuery));
