const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

var token = process.env.TOKEN || 'InstagramWebhooksTest';
var received_updates = [];

router.get('/', function(req, res) {
    console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

router.get('/test', async (req, res) => {
    if (req.query.code)
    {
        console.log("Code: " + req.query.code);

        var clientId = '209034488591562';
        var clientSecret = 'd953cdaaf5afcdc9320c29dc3dc48729';

        var query = {
            'client_id': clientId,
            'client_secret': clientSecret,
            'code': req.query.code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://instagram-custom-api-b12eacc92c32.herokuapp.com/test'
        };

        var formBody = [];
        for (var property in query) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(query[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        //SHORT TOKEN
        var shortTokenResponse = await fetch('https://api.instagram.com/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            });
        var jsonAccessToken = await shortTokenResponse.json();
        console.log(jsonAccessToken);

        // USER PROFILE
        var userProfileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${jsonAccessToken.access_token}`, {
            method: 'GET'
        });
        var userProfileJson = await userProfileResponse.json();
        console.log(userProfileJson);

        // RENDER VIEW
        res.render('test', {
            title: 'Test',
            code: req.query.code,
            shortToken: jsonAccessToken,
            userProfile: userProfileJson
        });

        return;
    }

    //RENDER VIEW
    res.status(200).json({ message: 'Yo do not have access' });
});

router.get(['/facebook', '/instagram-webhooks'], function(req, res) {
    if (
      req.query['hub.mode'] == 'subscribe' &&
      req.query['hub.verify_token'] == token
    ) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
});

router.post('/instagram-webhooks', function (req, res) {
    console.log('Instagram request body:');
    console.log(req.body);
    req.body.entry.forEach(entry => {
        entry.changes.forEach(change => {
            console.log(change);
        });
    });
    // Process the Instagram updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});

module.exports = router;