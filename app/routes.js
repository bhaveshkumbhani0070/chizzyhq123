var flightcentre = require('../scrape/flightcentre.js');
var studentflight = require('../scrape/studentflight.js');
var holidaycenter = require('../scrape/myholidaycentre.js');
var jetstar = require('../scrape/jetstar.js');
var virgin = require('../scrape/virgin.js');

var cron = require('node-cron');


var api = require('../api/apis.js');

cron.schedule('0 0 0 * * *', function() {
    console.log('Auto scrapping from all site');
    flightcentre.scrape();
    studentflight.Studentscrape();
    holidaycenter.holidaycenterScrape();
    jetstar.jetstarScrape();
    virgin.virginScrape();
});

module.exports = function(app) {

    // Scrapping from 
    app.get('/admin/scrape/flightcentre', flightcentre.scrape);
    app.get('/admin/scrape/studentflight/:page', studentflight.Studentscrape);
    app.get('/admin/scrape/holidaycenter', holidaycenter.holidaycenterScrape)
    app.get('/admin/scrape/jetstar', jetstar.jetstarScrape);
    app.get('/admin/scrape/virgin', virgin.virginScrape);
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
    app.get('/api/getwithYear/:date', api.getwithYear);
};