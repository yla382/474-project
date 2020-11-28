// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0


// Code modified from AWS WildRydes example for 474 Project. Modified by SM

const randomBytes = require('crypto').randomBytes;

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: 'Category',
    Key: {
        'CategoryId': 1
    },
    ProjectionExpression: "CategoryId, Title",
    ReturnConsumedCapacity: "TOTAL"
};

const paramsCategory = {
    TableName: 'Category',
    ProjectionExpression: "CategoryId, Title",
    ReturnConsumedCapacity: "TOTAL"
};


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
  }


  const requestId = toUrlString(randomBytes(16));
  console.log('Received event (', requestId, '): ', event);

    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const username = event.requestContext.authorizer.claims['cognito:username'];

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    var requestBody = JSON.parse(event.body);

    //var category = requestBody.Category;
/*    var categories = {
        Items:
        {
            "Id": {
                "S": "Amazon DynamoDB#How do I update multiple items?"
            },
            "Title": {
                "S": "Have you looked at BatchWriteItem?"
            }
        }        

    };*/

    //const unicorn = findUnicorn(article);

    getCategory(requestBody).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.
        
        //requestBody = getCategory();
        //requestBody = categories;
        
        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                requestBody

            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },

        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

// This is where you would implement logic to find the optimal unicorn for
// this ride (possibly invoking another Lambda function as a microservice.)
// For simplicity, we'll just pick a unicorn at random.
/*function findUnicorn(article) {
    console.log('Finding unicorn for ', article.Heading, ', ', article.Topic);
    return fleet[Math.floor(Math.random() * fleet.length)];
}*/

function getCategory(requestBody) {
    return ddb.get(params, function(err, data){
        if (err){
            console.log("Error", err);
        }
        else{
            console.log("Success", data.Item);
            //requestBody.Id = data.Item.CategoryId;
            requestBody = data.Item;
        }
    }).promise();
}

/*function getAllCategories(category) {
    return ddb.scan(paramsCategory, function(err, data){
        if (err){
            console.log("Error", err);
        }
        else{
            console.log("Success", data.Items);
            category.Id = data.Items.CategoryId;
            category.Title = data.Items.Title;
            categories = data.Items;
        }
    }).promise();
}*/

/*function recordArticle(categoryId, username, unicorn, article) {
    return ddb.put({
        TableName: 'Articles',
        Item: {
            ArticleId: categoryId,
            User: username,
            Unicorn: unicorn,
            UnicornName: unicorn.Name,
            Heading: article.Heading,
            Topic: article.Topic,
            Content: article.Content,
            RequestTime: new Date().toISOString(),
        },
    }).promise();
}*/

function toUrlString(buffer) {
    return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
  }),
    headers: {
      'Access-Control-Allow-Origin': '*',
  },
});
}