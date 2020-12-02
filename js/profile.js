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

    function requestProfile() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/profile',
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
                console.error('Error requesting category: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your category:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {

        console.log('Response received from API: ', result);

        var profiles = [];
        profiles = result.profiles;
        profiles.forEach(addCard);
        console.log('Response received from API: ', profiles);

    }

    // Register click handler for #request button
    $(function onDocReady() {
        // $('#request2').click(handleRequestClick);
        // $('#profileTest').click(handleCards);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                $('.authToken').text(token);
                requestProfile();
            }
        });
/*
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }*/
    });


    function handleRequestClick(event) {

        event.preventDefault();
        requestProfile();
        alert("Category js click");

    }

    function handleCards(event) {

        event.preventDefault();
        requestProfile();
        alert("Adding Cards");

    }

    function addCard(item) {

        //event.preventDefault();
        var inputProfileKey = item.ProfileKey;
        var inputName = item.Details.Name;
        var inputContactInfo = item.Details.Email;
        var inputPic = item.Details.ProfilePic;
        var inputDescription = item.Details.Description;

        inputPic = "images/wr-investors-2.png";

        var cardImage = "<img src='" + inputPic + "' class='card-img-top' alt='...'>";
        var cardTitle = "<h5 class='card-title' id='profileName'>" + inputName + "</h5>";
        var cardText = "<p class='card-text' id='profileText'>" + inputDescription + "</br> Contact: " + inputContactInfo + "</p>";
        var cardBody = "<div class='card-body'>" + cardTitle + cardText + "</div>";
        var cardButton = "<button class='btn btn-sm btn-outline-info btn-block' type='submit' value='" + inputProfileKey + "'> View </button>";
        var cardFooter = "<div class='card-footer'>" + cardButton + "</div>";
        var cardWrap = "<div class='card'>" + cardImage + cardBody + cardFooter + "</div>";

        $('#profile-deck').append(cardWrap);

    }


}(jQuery));
