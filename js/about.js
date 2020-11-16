/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};

(function aboutScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    function getUnicorn() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/about',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: function (data) {
                alert(data);
              },
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }
    
    function handleRequestClick(event) {
        event.preventDefault();
        getUnicorn();
    }

    $(function onDocReady() {
        $('#clickme').click(handleRequestClick);
    });
}(jQuery));
