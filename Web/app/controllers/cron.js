"use strict"
var dateFormat = require('dateformat'),
    request = require("request"),
    ntpClient = require('ntp-client');

exports.index = function (req, res) {
    ntpClient.getNetworkTime("pool.ntp.org", 123, function (err, date) {
        if (err) {
            console.error(err);
            return;
        }

        var date1 = new Date(date).getHours() + "::" + new Date(date).getMinutes();
        console.log("Current time : ");
        console.log(date1); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été)) 
        res.send(date);
    });

}


exports.getTemp = function (req, res) {

    var temp = "";

    getTemp(function (err, data) {
        if (!err) {
            var result = JSON.parse(data);
            var temp = result.sensor;
            var data = {
                device_id: 1,
                value: temp
            };

            req.getConnection(function (err, connection) {
                connection.query('INSERT INTO temperatures SET ?', data, function (error) {
                    if (error) {
                        console.log(error);
                        res.send(404, 'error');
                    } else {
                        console.log('success');

                    }
                });
            });
        }
        else {
            res.send(err);
        }
    }).call();

    res.send(temp.toString());
}

exports.checkTriger = function (req, res) {

    var temp = "",
        state = 0;

    getState(req, function (data) {
        state = data;
        
        getTemp(function (err, data) {
            if (!err) {
                var temp = JSON.parse(data).sensor;

                req.getConnection(function (err, connection) {
                    var data = {
                        device_id: 1,
                        value: temp
                    };

                    connection.query('INSERT INTO temperatures SET ?', data, function (error) {
                        if (error) { console.log(error); } else { console.log('success'); }
                    });

                    triger(req, state, temp)
                });
            }
            else {
                request('http://192.168.0.52/on', function (error, response, body) { });
                res.send(err);

            }
        });
    });

   
    

    res.send("ok");
   

}



var getTemp = function (callback) {
    request('http://192.168.0.51/json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return callback(null, body);
        } else {
            return callback(error, null);
        }
    });
},
getState = function (req, callback) {
    req.getConnection(function (err, connection) {

        connection.query('SELECT * FROM logs WHERE device_id = 2 ORDER BY date_time DESC LIMIT 1',
                function (err, rows, fields) {

                    if (err) {
                        return callback(null);
                    }
                    else {
                        return callback(rows[0].status);
                    }
                });
    });
},
triger = function (req, state, temperature) {
    var newState = state,
	minT = 20.7,
	maxT = 21.3,
	hours = new Date().getHours();

	if(hours >= 8 && hours < 16){
		minT = 17.5;
		maxT = 18.5;
	}
	else if(hours >= 22 && hours < 6){
		minT = 20.2;
		maxT = 20.7;
	} 

    if (state === 0) {
        if (temperature <= minT) {
            request('http://192.168.0.52/on', function (error, response, body) { });
            newState = 1;
        }
        
    }
    else {
        if (temperature >= maxT) {
            request('http://192.168.0.52/off', function (error, response, body) { });
            newState = 0;
        }
    }
    
    
    if (newState !== state) {
        req.getConnection(function (err, connection) {
            var data = {
                device_id: 2,
                status: newState
            };

            connection.query('INSERT INTO logs SET ?', data, function (error) {
                if (error) { console.log(error); } else { console.log('success'); }
            });
        });
    }
};
