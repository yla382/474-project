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

    function requestAllProfiles() {
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

    function requestProfile(profileId) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/profile',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Profile: {
                    Id: profileId
                }
            }),
            contentType: 'json',
            success: returnProfile,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting category: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your category:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {

        //console.log('Response received from API: ', result);

        var profiles = [];
        profiles = result.profiles;
        profiles.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.Details.Name.localeCompare(b.Details.Name);
        });
        profiles.forEach(addCard);
        //console.log('Response received from API: ', profiles);

    }

    function returnProfile(result) {

        console.log('Result received from API: ', result);

        var profile = result.profile;
        //profile = result;
        //profiles = result.profiles;
        //profiles.forEach(addCard);
        displayProfile(profile);
        console.log('Response received from API: ', profile);

    }

    // Register click handler for #request button
    $(function onDocReady() {
        // $('#request2').click(handleRequestClick);
        // $('#profileTest').click(handleCards);
        $('#profile-deck').on('click', 'button[name="profileView"]', handleRequestClick);
        $('#load-row').on('click', 'button[name="backBtn"]', handleCancleClick);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                $('.authToken').text(token);
                requestAllProfiles();
            }
        });
/*
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }*/
    });


    function handleRequestClick(event) {

        event.preventDefault();
        let profileId = $(this).attr("value");
        requestProfile(profileId);
        //alert("Profile View Clicked :" + profileId);

    }

    function handleCards(event) {

        event.preventDefault();
        requestAllProfiles();
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
        var cardTitle = "<h5 class='card-title'>" + inputName + "</h5>";
        var cardText = "<p class='card-text'>" + inputDescription + "</p>";
        var cardBody = "<div class='card-body'>" + cardTitle + cardText + "</div>";
        var cardButton = "<button class='btn btn-sm btn-outline-info btn-block' name='profileView' type='submit' value='" + inputProfileKey + "'> View </button>";
        var cardFooter = "<div class='card-footer'>" + cardButton + "</div>";
        var cardWrap = "<div class='card'>" + cardImage + cardBody + cardFooter + "</div>";

        $('#profile-deck').append(cardWrap);

    }

    function displayProfile(item) {

        //event.preventDefault();
        var inputProfileKey = item.ProfileKey;
        var inputName = item.Details.Name;
        var inputContactInfo = item.Details.Email;
        var inputPic = item.Details.ProfilePic;
        var inputDescription = item.Details.Description;

        inputPic = "images/wr-investors-2.png";

        //var cardImage = "<img src='" + inputPic + "' class='card-img-top' alt='...'>";
        var cardHeader = "<h1 class='card-header'>" + inputName + "</h1>";
        //var cardTitle = "<h5 class='card-title'>" + inputName + "</h5>";
        var cardText = "<p class='card-text'>" + inputDescription + "</p>";
        var cardBody = "<div class='card-body'>" + cardText + "</div>";
        var cardAuthor = "<h6 class='card-author'> Author: " + inputContactInfo + "</h6>";

        var cardButton = "<button class='btn btn-sm btn-outline-info btn-block' name='backBtn' type='submit' value='" + inputProfileKey + "'> Back </button>";
        var cardFooter = "<div class='card-footer'>" + cardButton + "</div>";
        var cardWrap = "<div class='card loaded-card' id='" + inputProfileKey + "'>" + cardHeader + cardBody + cardAuthor + cardFooter + "</div>";

        $('#load-profile').append(cardWrap);

        $('.row').not('#load-row').slideToggle();
        $('.featurette-divider').not('#last-divider').slideToggle();

    }

    function handleCancleClick(event) {

        event.preventDefault();

        //alert("Cancle Article");

        let profileId = $(this).attr("value");

        $('.loaded-card').remove();
        //$('#' + profileId).remove();
        //$('h1.card-title').remove();
        $('.row').not('#load-row').slideToggle();
        $('.featurette-divider').not('#last-divider').slideToggle();

    }


}(jQuery));
