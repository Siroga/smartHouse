module.exports = {

    getTemperature: function (ip, callback) {
        var request = require("request");
        request('http://' + ip + '/json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body);
                console.log(obj.sensor);
                return callback(body);
            } else {
                return callback(500);
            }
        });

    },

    getBoilerState: function (callback) {
        Log.findOne({
            where: { deviceId: sails.config.webConfig.boilerId },
            sort: 'createdAt DESC'
        }).exec(function (err, res) {
            if (err || !res) {
                return callback(null);
            }
            else {
                return callback(res.status);
            }
        });
    },

    servo: function (ip, state, callback) {
        var request = require("request");

        if (state) {
            var st = state === 1 ? "on" : "off";
            
            request('http://' + ip + '/' + st, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    return callback(body);
                } else {
                    return callback(500);
                }
            });
        }
        else {
            request('http://' + ip , function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    return callback(body);
                } else {
                    return callback(500);
                }
            });
        }

        

    },
};
