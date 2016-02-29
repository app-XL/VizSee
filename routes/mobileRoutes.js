var auth = require('./auth.js');

module.exports = function(app, passport) {

    // show welcome screen
    app.get('/m/welcome', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Welcome to CSC";
        res.render('mobile/welcome.ejs', {
            layout: 'layouts/mobile'
        });
    });

    app.get('/m/session', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Visit schedules";
        res.render('mobile/session.ejs', {
            layout: 'layouts/schedule'
        });
    });

    app.get('/m/sessiondetail', auth.isLoggedIn, function(req, res) {
        res.locals.pageTitle = "Session Details";
        res.render('mobile/sessiondetail.ejs', {
            layout: 'layouts/scheduleDetail'
        });
    });
}