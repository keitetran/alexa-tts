# Install nodejs on raspi (Skip if nodejs exist)

- https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/
- `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
- `sudo apt-get install -y nodejs`

# Clone code

- `git clone https://github.com/keitetran/alexa-tts.git`
- `cd alexa-tts`

# CHMOD 777 file

- ./tts-alexa/cookies.json

# Install app

- `cd /home/homeassistant/tts-alexa`
- `sudo npm install --unsafe-perm=true --allow-root`

  - if have error
    - `sudo npm install -g electron --unsafe-perm=true --allow-root`
    - `sudo npm install`

# Test app

- `node ./index.js`
- App will run here: http://localhost:8125

# Manager nodejs app on raspi [(Auto start when reboot)](http://pm2.io/)

- `sudo npm install pm2 -g`
- `pm2 startup`
- `sudo pm2 start ./index.js`

# Config custom component on HA

- Copy folder custom_components to config dir
- See `automation.yaml` for example