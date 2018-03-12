#include <ESP8266WiFi.h>
//#include <WiFiClient.h>
#include <ESP8266WebServer.h>
// struct timeva
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

const char *ssid = "siroga 2.4GHz";
const char *password = "02011988";
const int relayPin = D1;
OneWire oneWire(13);
DallasTemperature DS18B20(&oneWire);

IPAddress ip(192, 168, 2, 10); //статический IP
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 0, 0);
int state = 1;

ESP8266WebServer server ( 80 );

const int led = 13;

void setup ( void ) {

  pinMode ( led, OUTPUT );
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
  digitalWrite ( led, 0 );
  Serial.begin ( 115200 );
  WiFi.mode ( WIFI_STA );
  WiFi.begin ( ssid, password );
  WiFi.config(ip, gateway, subnet);
  Serial.println ( "" );

  // Wait for connection
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }

  Serial.println ( "" );
  Serial.print ( "Connected to " );
  Serial.println ( ssid );
  Serial.print ( "IP address: " );
  Serial.println ( WiFi.localIP() );
  DS18B20.begin();

  server.on ( "/", handleRoot );
  server.on ( "/on", handleOn );
  server.on ( "/off", handleOff );
  server.on ( "/state", handleState );
  server.on ( "/temp", handleTemp );
  server.onNotFound ( handleNotFound );
  server.begin();
  Serial.println ( "HTTP server started" );
}

void loop ( void ) {
  server.handleClient();
}

void handleTemp() {
  DynamicJsonBuffer jsonBuffer;
  float temp = getTemp(0);

  String input =
    "{\"value\":\"0\"}";
  JsonObject& root = jsonBuffer.parseObject(input);
  root["value"] = temp;

  String output;
  root.printTo(output);
  server.send ( 200, "application/json", output );
}

void handleOn() {
  digitalWrite(relayPin, HIGH);
  state = 1;
  server.send ( 200, "text/html", "on" );
}


void handleOff() {
  digitalWrite(relayPin, LOW);
  state = 0;
  server.send ( 200, "text/html", "off" );
}

void handleState() {
  DynamicJsonBuffer jsonBuffer;
float temp = getTemp(0);
  String input =
    "{\"value\":\"0\"}";
  JsonObject& root = jsonBuffer.parseObject(input);
  root["state"] = state;
  root["value"] = temp;

  String output;
  root.printTo(output);
  server.send ( 200, "application/json", output );
}



void handleRoot() {

  int sec = millis() / 1000;
  int min = sec / 60;
  int hr = min / 60;

  float temp = getTemp(0);
  String output = "<html>\
  <head>\
    <meta http-equiv='refresh' content='5'/>\
    <title>ESP8266 Demo</title>\
    <style>\
      body { background-color: #cccccc; font-family: Arial, Helvetica, Sans-Serif; Color: #000088; }\
    </style>\
  </head>\
  <body>\
 <p>" + String(state) + "</p>\
  <p>" + String(temp) + "</p>\
 </body>\
</html>";
  server.send ( 200, "text/html", output );

}

void handleNotFound() {

  digitalWrite ( led, 1 );
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += ( server.method() == HTTP_GET ) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for ( uint8_t i = 0; i < server.args(); i++ ) {
    message += " " + server.argName ( i ) + ": " + server.arg ( i ) + "\n";
  }

  server.send ( 404, "text/plain", message );
  digitalWrite ( led, 0 );
}

float getTemp(int index) {
  if ( DS18B20.isParasitePowerMode() ) {
    Serial.println("ON");
  } else {
    Serial.println("OFF");
  }
  int numberOfDevices = DS18B20.getDeviceCount();

  if (index > numberOfDevices) {
    return -127;
  }
  DS18B20.requestTemperatures();
  
  return DS18B20.getTempCByIndex(index);
}
