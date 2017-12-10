var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');

var connection = require(__dirname + '/config/db');


var links = [
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Sydney", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Adelaide", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Brisbane", //48
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Cairns", //47
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Canberra", //48
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Darwin", //47
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Hobart", //46
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Melbourne", //52
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Perth", //51
    "https://www.flightcentre.com.au/holidays/search?fdeparture=Gold+Coast" //8,GoldCoast
]

exports.scape = function(req, res) {
    // var url = 'https://www.flightcentre.com.au/holidays/search?fdeparture=Adelaide';

    // var fileName = "Adelaide";
    // var path = __dirname + '/json/' + fileName + '.json';
    // if (!fs.existsSync(path)) {
    //     fs.writeFile(path, '');
    // } else {
    //     console.log('Already there');
    // }

    // // 51 is Total number of pages in this url
    // for (var x = 0; x < 51; x++) {
    //     setTimeout(function(y) {
    //         Scrap(url, y, path);
    //     }, x * 16000, x); // we're passing x
    //     //16000 means 16 Second, it will tack 16 Second for one page to scrape data
    // }
}

startJob();

function startJob() {
    var url = 'https://www.flightcentre.com.au/holidays/search?fdeparture=Gold+Coast';
    var fileName = "Gold+Coast";
    var path = __dirname + '/json/' + fileName + '.json';
    if (!fs.existsSync(path)) {
        fs.writeFile(path, '');
    } else {
        console.log('Already there');
    }
    // 51 is Total number of pages in this url
    for (var x = 0; x < 51; x++) {
        setTimeout(function(y) {
            Scrap(url, y, path);
        }, x * 20000, x); // we're passing x
        //16000 means 16 Second, it will tack 16 Second for one page to scrape data
    }
}

function Scrap(u, y, path) {
    var url = u + "&page=" + y;
    console.log('url', url);
    var departure = u.split("=")[1];
    //var path = __dirname + '/json/' + departure + '.json';
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            var allData = [];
            $('a.clearfix').each(function(x) {
                var data = $(this);
                var package = data.find("h3.product-package").text();
                var traveldates = [];
                var date = data.find(".product-travel-dates").text().split(":")[1].split(',');
                for (var i = 0; i < date.length; i++) {
                    traveldates.push({ traveldates: getDate(date[i]) })
                }
                var newUrl = "https://www.flightcentre.com.au" + data.attr("href");
                var sendData = {
                        url: newUrl,
                        departure: departure,
                        package: package,
                        dates: traveldates
                    }
                    //After Scrapping main page, it will go for child page scrape 
                setTimeout(function(y) {
                    ScrapInnerData(newUrl, sendData, path, y);
                }, x * 1500, x);
            });
            // fs.readFile(path, function(err, d) {
            //     if (isEmptyObject(d)) {
            //         var json = allData;
            //     } else {
            //         var json = JSON.parse(d)
            //         json = json.concat(allData)
            //     }
            //     fs.writeFile(path, JSON.stringify(json, null, 4))
            // })
        } else {
            console.log('Error');
        }
    });
}

function ScrapInnerData(url, alldata, path, y) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('.product-info-left p .label').each(function(ele) {
                var data = $(this);
                alldata[data.text()] = data.next().text();
            });
            alldata["price"] = $('.price').attr("content");
            var whatNext = $('.product-checkbox-icon').next().next();
            var whatNextData = [];
            whatNext.children().each(function(i) {
                var data = $(this);
                whatNextData.push(data.text());
            })
            alldata[$('.product-checkbox-icon').next().text()] = whatNextData


            var cityData = {
                url: alldata.url,
                departure: alldata.departure,
                package: alldata.package,
                duration: alldata.Duration,
                destination: alldata.Destination,
                airline: alldata.Airline,
                price: alldata.price,
                "what's Included?": alldata["What's Included?"].toString()
            }

            connection.query('select * from allcity where url=?', cityData.url, function(err, cityD) {
                if (!err) {
                    if (cityD.length == 0) {
                        console.log('add city');
                        connection.query('insert into allcity set ?', cityData, function(err, insData) {
                            if (!err) {
                                var dates = alldata.dates;
                                var cityid = insData.insertId
                                for (var i = 0; i < dates.length; i++) {
                                    var dateData = {
                                        allcityid: cityid,
                                        date: dates[i].traveldates
                                    }
                                    connection.query('insert into dates set ?', dateData, function(err, insDate) {
                                        if (!err) {
                                            console.log('Inserted');
                                        } else {
                                            console.log('Error', err);
                                        }
                                    })
                                }
                            } else {
                                console.log('Error for insert data', err);
                            }
                        })
                    } else {
                        console.log('already there');
                    }
                } else {
                    console.log('Error for selecting data from city');
                    return;
                }
            });

            // var finalData = [];
            // finalData.push(alldata);
            // //Here first read file file 
            // fs.readFile(path, function(err, d) {
            //     if (isEmptyObject(d)) {
            //         var json = finalData;
            //     } else {
            //         var json = JSON.parse(d)
            //         json = json.concat(finalData)
            //     }
            //     console.log('alldata', y);
            //     //after read file append new data in old
            //     fs.writeFile(path, JSON.stringify(json, null, 4))
            // })
        } else {
            console.log('Error', error);
        }
    });
}

// First time it will check json file is empty or not
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

//Get date from two date 
/**
 * if date is like 20 February - 6 March 2018 it will return
 *  20/2/2018-6/3/2018
 * here this data is From to To
 */
function getDate(d) {
    var date = d.trim().split('-')
    var year = new Date(date[1]).getFullYear();
    var mm = date[0].trim().split(" ");
    if (!mm[1]) {
        var toDate = new Date(date[1]);
        var from = toDate.setMonth(toDate.getMonth() - mm);
        var from = new Date(from).setMonth(mm - 1)
    } else {
        var from = date[0] + ' ' + year;
    }
    var to = date[1]
    return dateFormate(from) + '-' + dateFormate(to)
}

// Return date in format of dd/mm/yyyy
function dateFormate(d) {
    var date = new Date(d);
    var mm = parseInt(date.getMonth()) + 1;
    return date.getDate() + '/' + mm + '/' + date.getFullYear();
}