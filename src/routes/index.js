const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'Que show' });
});

router.get('/test', async (req, res) => {
    if (req.query.code)
    {
        console.log("Code: " + req.query.code);

        var clientId = '1171495670260486';
        var clientSecret = '118832bac0a74de45c2e4002a4aa66bb';

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

        console.log("Begin short token ws");
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
        
        console.log("Begin long token ws");
        //LONG TOKEN
        var longTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${jsonAccessToken.access_token}`, {
            method: 'GET'
        });

        var longTokenJson = await longTokenResponse.json();
        console.log(longTokenJson);

        console.log("Begin user profile ws");
        // USER PROFILE
        var userProfileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${longTokenJson.access_token}`, {
            method: 'GET'
        });
        var userProfileJson = await userProfileResponse.json();
        console.log(userProfileJson);

        var userMediaResponse = await fetch(`https://graph.instagram.com/${userProfileJson.id}/media?fields=caption,id,media_type,media_url,timestamp&access_token=${longTokenJson.access_token}`,{
            method: 'GET'
        });
        var userMediaJson = await userMediaResponse.json();
        console.log(userMediaJson);

        // RENDER VIEW
        res.render('test', {
            title: 'Test',
            code: req.query.code,
            longToken: longTokenJson,
            userProfile: userProfileJson
        });

        return;
    }

    //RENDER VIEW
    res.status(200).json({ message: 'Yo do not have access' });
});

router.post('/instagram-webhooks/user', async (req, res) => {
    console.log(req);
    console.log('--------------------------');
    console.log(res);
});

module.exports = router;