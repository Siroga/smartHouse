/**
 * SettingsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    get: function (req, res) {
        var a = Device.findOne({
            id: sails.config.webConfig.bedRoomServoId
        }).exec(function (err, finn) {
            if (err) {
                return res.serverError(err);
            }
            if (!finn) {
                return res.notFound('Could not find Finn, sorry.');
            }



            Services.servo(finn.ip, null, function (body) {
                res.send(body);
            });

        });


    }
};