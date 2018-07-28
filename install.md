# install nodejs on raspi

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# manager nodejs app on raspi (auto start when reboot)

# http://pm2.io/ (read more)

https://github.com/cncjs/cncjs/wiki/Setup-Guide:-Raspberry-Pi-%7C-Install-Node.js-via-Node-Version-Manager-(NVM)

sudo npm install pm2 -g

# test nodejs

node -v
-> v8.11.3

# create folder (copy code)

/home/homeassistant/tts-alexa

# Install app

cd /home/homeassistant/tts-alexa
sudo npm install -g electron --unsafe-perm=true --allow-root
sudo npm install
sudo pm2 start index.js
