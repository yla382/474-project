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

    function editProfile(profilePic, name, email, experience, description, phonenumber, discord) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/editprofile',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Details: {
                    ProfilePic : profilePic, 
                    Name       : name,
                    Email      : email,
                    Experience : experience,
                    Description: description,
                    PhoneNumber: phonenumber,
                    Discord    : discord
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
    alert("Profile successfully updated");
        window.location.href = "./profile.html";
    }


    $(function onDocReady() {
        $('#edit_button').click(handleRequestClick);

        $('#form_pic').change(function(e){
            console.log(e.target.files[0]);
        });

        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });
    });

    function handleRequestClick(event) {
    event.preventDefault();
         //let get_pic      = $('#form_pic').target.files[0];
         let get_pic      = "PlaceHolder"
         let get_name     = $('#form_name').val();
    let get_email    = $('#form_email').val();
    let get_exp      = $('#form_exp').val();
    let get_desc     = $('#form_desc').val();
         let get_phonenum = $('#form_phonenum').val();
         let get_discord  = $('#form_discord').val();
    editProfile(get_pic, get_name, get_email, get_exp, get_desc, get_phonenum, get_discord);
    }
}(jQuery));