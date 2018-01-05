var flightcentre = require('../scrape/flightcentre.js');
var studentflight = require('../scrape/studentflight.js');
var holidaycenter = require('../scrape/myholidaycentre.js');
var jetstar = require('../scrape/jetstar.js');

var api = require('../api/apis.js');
module.exports = function(app) {

    app.get('/admin/scrape/flightcentre/:l', flightcentre.scrape);
    app.get('/admin/scrape/studentflight/:page', studentflight.Studentscrape);
    app.get('/admin/scrape/holidaycenter', holidaycenter.holidaycenterScrape)
    app.get('/admin/scrape/jetstar', jetstar.jetstarScrape);
    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    // app.get('/holiday', function(req, res) {
    //     res.sendfile('./public/holidaypackage.html'); // load the single view file (angular will handle the page changes on the front-end)
    // });
    app.get('/holiday/:departure', api.getallHolidayDeal);
    app.post('/api/getallDeal', api.getallDeal);
    app.get('/api/getDeparture', api.getDeparture);
    app.get('/api/getDestination/:destination', api.getDestination);
    app.post('/api/getallHolidayDeal', api.getallHolidayDeal);
};