const request = require('request');
const fs = require('fs');
const path = require('path');
const nightmare = require('nightmare')({
  show: false
});
const express = require('express');
const app = express();
const port = 8125;
const userName = "xxxx@gmail.com";
const password = "xxx";
const timerRefreshCookie = 4;

// loginAlexa();
setInterval(function () {
  loginAlexa();
}, timerRefreshCookie * 60 * 60 * 1000);

app.get('/', function (req, res) {
  res.send('Nodejs server TTS for Echo!');
});

app.get('/tts/:password/:msg', (req, res) => {

  if (password != req.params.msg) {
    return res.send("Login false");
  }

  fs.readFile(path.join(__dirname, 'myjsonfile.json'), 'utf8', function (err, fileData) {
    if (err) {
      console.log(err);
      return;
    }
    sendTtsToEcho(JSON.parse(fileData), req.params.msg).then(r => {
      if (!r) return res.send(false);
      return res.send(true);
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function loginAlexa() {
  return new Promise((reslove, reject) => {
    return nightmare.goto('https://www.amazon.com/ap/signin?showRmrMe=1&openid.return_to=https%3A%2F%2Falexa.amazon.com&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_dp_project_dee&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&')
      .type('#ap_email', userName)
      .type('#ap_password', password)
      .wait(1000)
      .click('#signInSubmit') // Login
      .wait(1000)
      .goto('https://alexa.amazon.com/api/devices-v2/device')
      .wait(1000)
      .evaluate(function () {
        return JSON.parse(document.body.innerText)
      })
      .then(result => {
        return {
          accountName: result.devices[0].accountName,
          deviceSerialNumber: result.devices[0].serialNumber,
          deviceType: result.devices[0].deviceType,
          deviceOwnerCustomerId: result.devices[0].deviceOwnerCustomerId
        };
      })
      .then(data => {
        return nightmare.cookies.get({
          url: null
        }).end().then(cookies => {
          let strCookies = '';
          cookies.forEach((cookie) => {
            strCookies += cookie.name + '=' + cookie.value + '; ';
            if (cookie.name === 'csrf') data.cookieCsrf = cookie.value;
          });
          data.cookiesStr = strCookies.trimRight();
          return data;
        });
      }).then(r => {
        fs.writeFileSync(path.join(__dirname, 'myjsonfile.json'), JSON.stringify(r), 'utf8');
        reslove(r);
      })
      .catch(err => {
        reject(err);
      });
  });
};

function sendTtsToEcho(data, message) {
  return new Promise(reslove => {
    request({
      method: 'POST',
      url: 'https://alexa.amazon.com/api/behaviors/preview',
      headers: {
        'Cookie': data.cookiesStr,
        'csrf': data.cookieCsrf
      },
      json: {
        behaviorId: "PREVIEW",
        status: "ENABLED",
        sequenceJson: `{
          "@type": "com.amazon.alexa.behaviors.model.Sequence", 
          "startNode": {
            "@type": "com.amazon.alexa.behaviors.model.OpaquePayloadOperationNode",
            "type":"Alexa.Speak",
            "operationPayload": {
              "deviceType": "${data.deviceType}",
              "deviceSerialNumber": "${data.deviceSerialNumber}",
              "locale": "ja-JP", 
              "customerId": "${data.deviceOwnerCustomerId}",
              "textToSpeak": "${message}"
            }
          }
        }`
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        reslove(true);
      } else {
        reslove(false);
      }
    });
  });
};