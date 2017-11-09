var mqtt = require('mqtt');
var program = require('commander');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .usage('[options] (--connect <url>)')
  .option('-h, --host <host>', 'connect to a mqtt websocket server')
  .option('--ssl', 'Use SSL port')
  .option('-c, --clientId <clientId>', 'STS MQTT Client ID')
  .option('-u, --username <username>', 'Your username on FRED')
  .option('-p, --password <password>', 'STS MQTT Client password')
  .option('-t, --topic <topic>', 'Topic to connect to. Syntax must follow: "users/<fred_username>/<topic>"')
  .option('-m, --message <message>', "Message to send on connect")
  .parse(process.argv);

var protocol = program.ssl ? "wss": "ws";
var host = program.host; // i.e. "mqtt.iotpop.net"
var port =   program.ssl ? "3443": "3000"; // 3443 is ssl port for websocket on STS MQTT

var options = {
  clientId: program.clientId,// i.e: "tedh-149b148f",
  username: program.username,//     "tedh",
  password: program.password,//     "123123123",
  reconnectPeriod: 5000 // 5s
};

var clientConnected = false;
var topic =  program.topic || 'users/'+program.username+'/test';
var connectMessage = program.message || "MQTT websocket example alive and reporting for duty!";

var mqttClient = mqtt.connect(protocol+"://"+host+":"+port, options);

mqttClient.subscribe(topic, function (err, granted) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Subscribed to topic: ' + topic);
});

mqttClient.publish(topic, connectMessage, function (err) {
  if (err) {
    console.log(err);
    return;
  }
});

mqttClient.on('connect', function () {
  console.log("Client connected. You can send messages to topic by typing into this console");
  clientConnected = true;
});

mqttClient.on('reconnect', function () {
  mqttClient.removeAllListeners('message');
});

mqttClient.on('error', function (err) {
  console.error(err);
});

mqttClient.on("message", function (topic, payload) {
  console.log("Message received on topic: "+topic+" :: " + payload);
});

rl.on('line', function (input) {
  if (clientConnected === false) {
    console.log("Waiting for client to connect.. please try again")
  }
  if (input === "") {
    return;
  }
  mqttClient.publish(topic, input, function (err) {
    if (err) {
      console.log(err);
    }
  });
});