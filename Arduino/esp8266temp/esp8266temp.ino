#include <ESP8266WiFi.h>
//#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <time.h>                       // time() ctime()
#include <sys/time.h>                   // struct timeval
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

const char *ssid = "siroga 2.4GHz";
const char *password = "02011988";
IPAddress ip(192, 168, 0, 51); //статический IP
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

#define ONE_WIRE_BUS 3
#define TZ              2       // (utc+) TZ in hours
#define TZ_SEC          ((TZ)*3600)
timeval tv;
time_t now;
OneWire oneWire(13);
DallasTemperature DS18B20(&oneWire);


ESP8266WebServer server ( 80 );

const int led = 13;

void setup ( void ) {

  pinMode ( led, OUTPUT );
  digitalWrite ( led, 0 );
  Serial.begin ( 115200 );
  WiFi.mode ( WIFI_STA );
  WiFi.begin ( ssid, password );
  WiFi.config(ip, gateway, subnet);
  Serial.println ( "" );
  configTime(TZ_SEC, 0, "pool.ntp.org");
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
  //  if ( MDNS.begin ( "esp8266" ) ) {
  //    Serial.println ( "MDNS responder started" );
  //  }

  server.on ( "/", handleRoot );
  server.on ( "/json", handleJson );
  server.onNotFound ( handleNotFound );
  server.begin();
  Serial.println ( "HTTP server started" );
}

void loop ( void ) {


  server.handleClient();

}

void handleJson() {
DynamicJsonBuffer jsonBuffer;
float temp = getTemp(0);
  
String input =
      "{\"sensor\":\"0\"}";
  JsonObject& root = jsonBuffer.parseObject(input);
  root["sensor"] = temp;

String output;
  root.printTo(output);
   server.send ( 200, "application/json", output );
}

void handleRoot() {
  
  int sec = millis() / 1000;
  int min = sec / 60;
  int hr = min / 60;
float temp = getTemp(0);
 String output="<html>\
  <head>\
    <meta http-equiv='refresh' content='5'/>\
    <title>ESP8266 Demo</title>\
    <style>\
      body { background-color: #cccccc; font-family: Arial, Helvetica, Sans-Serif; Color: #000088; }\
    </style>\
  </head>\
  <body>\
 <p>"+String(temp)+"</p>\
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

