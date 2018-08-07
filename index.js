const config = require("./config");
const alexa = require("./alexa");
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

alexa.login();
setInterval(function () {
  alexa.login();
}, config.timerRefreshCookie * 60 * 60 * 1000);

app.get('/', function (req, res) {
  res.send('Nodejs server TTS for Echo!');
});

app.get('/tts/:msg', (req, res) => {
  let msg = req.params.msg;

  fs.readFile(path.join(__dirname, config.cookieFile), 'utf8', function (err, fileData) {
    if (err) {
      console.log(err);
      return;
    }
    alexa.sendTtsToEcho(JSON.parse(fileData), msg).then(r => {
      if (!r) return res.send(false);
      return res.send(true);
    });
  });
});

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`));