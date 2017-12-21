var flightcentre = require('../scrape/flightcentre.js');
var api = require('../api/apis.js');
module.exports = function(app) {


    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    app.get('/holiday', function(req, res) {
        res.sendfile('./public/holidaypackage.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    app.get('/admin/scrape/flightcentre', flightcentre.scrape);
    app.post('/api/getallDeal', api.getallDeal);
    app.get('/api/getDeparture', api.getDeparture);
    app.get('/api/getDestination', api.getDestination);
    app.post('/api/getallHolidayDeal', api.getallHolidayDeal);
};