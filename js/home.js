/*global WildRydes _config*/

// Code modified from AWS WildRydes example for 474 Project. Modified by SM

var WildRydes = window.WildRydes || {};


(function scopeWrapper($) {
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

    function requestArticle() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/article',
            headers: {
                Authorization: authToken
            },
/*            data: JSON.stringify({
                Category: {
                    Id: '0',
                    Title: 'Category Title'
                }
            }),*/
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
        
        console.log('Response received from API: ', result);

    }

    // Register click handler for #request button
    $(function onDocReady() {
        //$('#request').click(handleRequestClick);
        //$('#request2').click(handleRequest2Click);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                $('.authToken').text(token);
                handleLogin();
            }
        });
/*
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }*/
    });


    function handleRequestClick(event) {

        event.preventDefault();
        requestArticle();
        alert("Home js click");

    }

    function handleRequest2Click(event) {

        event.preventDefault();
        requestCategory();
        alert("Category js click");

    }

    function handleLogin() {

        $('#nav-signIn').hide();
        $('#nav-register').hide();
        $('#nav-signOut').show();
    }


}(jQuery));
