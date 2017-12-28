var flightcentre = require('../scrape/flightcentre.js');
var studentflight = require('../scrape/studentflight.js');
var api = require('../api/apis.js');
module.exports = function(app) {

    app.get('/admin/scrape/flightcentre/:l', flightcentre.scrape);
    app.get('/admin/scrape/studentflight/:page', studentflight.Studentscrape);
    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    app.get('/holiday', function(req, res) {
        res.sendfile('./public/holidaypackage.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    app.post('/api/getallDeal', api.getallDeal);
    app.get('/api/getDeparture', api.getDeparture);
    app.get('/api/getDestination/:destination', api.getDestination);
    app.post('/api/getallHolidayDeal', api.getallHolidayDeal);
};