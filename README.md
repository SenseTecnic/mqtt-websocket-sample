# MQTT over Web Socket Example #

This repo contains the sample code to connect to the STS MQTT websocket over websocket.

## Install ##

```
npm install
```

## Usage Example ##

```
node mqtt-websocket -h <MQTT_HOST> --ssl -u <FRED_USERNAME> -c <MQTT_CLIENT_ID> -p <MQTT_CLIENT_KEY> -t users/<FRED_USERNAME>/<CUSTOM_TOPIC>
```

Example:

```
node mqtt-websocket -h mqtt.iotpop.net --ssl -u tedh -c tedh-149b148f -p 123123123 -t users/tedh/test
```

You can enter messages to the console after connecting.