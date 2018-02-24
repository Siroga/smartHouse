var home = require('../app/controllers/home'),
    cron = require('../app/controllers/cron');

//you can include all your controllers

module.exports = function (app, passport) {


    app.get('/', home.home);//home
    app.get('/home', home.home);//home
    app.get('/cron', cron.index);//home
    app.get('/cron/getTemp', cron.getTemp);
    app.get('/cron/checkTriger', cron.checkTriger);//
    



}
