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
            method: 'GET',
            url: _config.api.invokeUrl + '/article',
            headers: {
                Authorization: authToken
            },
/*            data: JSON.stringify({
                Article: {
                    Id: articleId
                }
            }),*/
            contentType: 'json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting article: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your article:\n' + jqXHR.responseText);
            }
        });
    }


    function getArticle(articleId) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/articles',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Article: {
                    Id: articleId
                }
            }),
            contentType: 'json',
            success: returnArticle,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting article: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your article:\n' + jqXHR.responseText);
            }
        });
    }

    // function createArticle(articleTitle, content){
    //     $.ajax({
    //         method: 'POST',
    //         url: _config.api.invokeUrl + '/article',
    //         headers: {
    //             Authorization: authToken
    //         },
    //         data: JSON.stringify({
    //             Article: {
    //                 Title: articleTitle,
    //                 //Category: categoryID,
    //                 Content: content,
    //                 //TagID: tagID
    //             }
    //         }),
    //         contentType: 'json',
    //         success: function(){
    //             console.log("success");
    //         },
    //         error: function ajaxError(jqXHR) {
    //             console.error('Response: ', jqXHR.responseText);
    //             alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
    //         }
    //     });
    // }

    function completeRequest(result) {

        console.log('Result: ', result);

        var articles = [];
        articles = result.articles;
        
        // console.log('Before Sort: ', articles);

        articles.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.CreatedTime) - new Date(a.CreatedTime);
        });
        articles.forEach(addCard);
        console.log('Result articles: ', articles);

    }

    function returnArticle(result) {

        console.log('Result received from API: ', result);

        var article;
        article = result.article;

        displayArticle(article);
        console.log('Response received after API: ', article);
        //window.location.href = "./article-load.html";


    }

    // Register click handler for #request button
    $(function onDocReady() {
        //$('.cancleButton').click(handleCancleClick);
        //$('button').on('click', handleRequestClick);
        $('#article-deck').on('click', 'button[name="viewBtn"]', handleRequestClick);
        $('#load-row').on('click', 'button[name="backBtn"]', handleCancleClick);
        //$('.cancleButton').on('click', handleRequestClick);


        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                $('.authToken').text(token);
                requestArticle();
            }
        });
/*
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }*/
    });

    function handleSubmitClick(event) {
        var articleTitle = document.getElementById('articleTitle').value;
        //var categoryID = document.getElementById('roleUpdate').value;
        //var tagID = document.getElementById('tagUpdate').value;
        let get_desc = $('#form_desc').val();
        createArticle(articleTitle, get_desc);
     
        event.preventDefault();

    }

    function handleRequestClick(event) {

        event.preventDefault();
        //let articleId = $(this).attr("value");
        let articleId = $(this).attr("value");
        getArticle(articleId);
        //alert("View Article clicked, id: " + articleId);
        console.log('Response sent to API: ', articleId);

    }

    function handleCards(event) {

        event.preventDefault();
        requestArticle();
        alert("Adding Cards");

    }



    

    function addCard(item) {

        //event.preventDefault();
        var inputKey = item.ArticleId;
        var inputTitle = item.Title;
        var inputContent = item.Content;
        var inputContactInfo = toEmail(item.Author);
        //var inputPic = item.UserProfile.ProfilePic;

        var inputPic = "images/wr-investors-2.png";


        var cardImage = "<img src='" + inputPic + "' class='card-img-top' alt='...'>";
        var cardTitle = "<h5 class='card-title'>" + inputTitle + "</h5>";
        var cardText = "<p class='card-text'>" + inputContent + "</p>";
        var cardBody = "<div class='card-body'>" + cardTitle + cardText + "</div>";
        var cardButton = "<button class='btn btn-sm btn-outline-info btn-block viewArticle' type='button' name='viewBtn' value='" + inputKey + "'> View </button>";
        //var backButton = "<button class='btn btn-sm btn-outline-info btn-block backButton' type='button' name='backBtn' value='" + inputKey + "'> Back </button>";
        var cardFooter = "<div class='card-footer'> Author: " + inputContactInfo + cardButton + "</div>";
        var cardWrap = "<div class='card article-card' id='" + inputKey + "'>" + cardBody + cardFooter + "</div>";

        $('#article-deck').append(cardWrap);

    }

    function toEmail(username) {
        return username.replace('-at-', '@');
    }


    function displayArticle(item) {

        //event.preventDefault();
        var inputKey = item.ArticleId;
        var inputTitle = item.Title;
        var inputContent = item.Content;
        var inputContactInfo = toEmail(item.Author);
 

        var cardTitle = "<h1 class='card-header'>" + inputTitle + "</h1>";
        var cardText = "<p class='card-text'>" + inputContent + "</p>";
        var cardBody = "<div class='card-body'>" + cardText + "</div>";
        var cardAuthor = "<h6 class='card-author'> Author: " + inputContactInfo + "</h6>";

        var backButton = "<button class='btn btn-sm btn-outline-info btn-block backButton' type='button' name='backBtn' value='" + inputKey + "'> Back </button>";
        var cardFooter = "<div class='card-footer'>" + backButton + "</div>";
        var cardWrap = "<div class='card loaded-card' id='" + inputKey + "'>" + cardTitle + cardBody + cardAuthor + cardFooter + "</div>";

        //$('#load-article').append(cardTitle);
        $('#load-article').append(cardWrap);


        $('.row').not('#load-row').slideToggle();
        $('.featurette-divider').not('#last-divider').slideToggle();
      


    }

    function handleCancleClick(event) {

        event.preventDefault();

        //alert("Cancle Article");

        let articleId = $(this).attr("value");

        $('#' + articleId).remove();
        //$('h1.card-title').remove();
        $('.row').not('#load-row').slideToggle();
        $('.featurette-divider').not('#last-divider').slideToggle();

    }


}(jQuery));
