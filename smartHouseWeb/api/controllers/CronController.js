/**
 * SettingsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    checkStatus: function (req, res) {
        var a = Device.findOne({
            id: sails.config.webConfig.bedRoomTempId
        }).exec(function (err, finn) {
            if (err) {
                return res.serverError(err);
            }
            if (!finn) {
                return res.notFound('Could not find Finn, sorry.');
            }


            Services.getBoilerState(function (value) {
                console.log(value);
            });
            Services.getTemperature(finn.ip, function (value) {
                res.send(value);
            });



        });


    }
};