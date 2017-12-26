var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');

var sql = require('mssql');
//var connection = require(__dirname + '/config/db');
var pool = require('../config/db');
const requ = new sql.Request(pool);


exports.scrape = function(req, res) {
    startJob();
}

function startJob() {
    pool.close();
    pool.connect(function(err, connection) {
        if (!err) {
            var url = 'https://www.studentflights.com.au';
            for (var x = 0; x < 18; x++) {
                setTimeout(function(y) {
                    ScrapStudent(url, y);
                }, x * 20000, x); // we're passing x
                //20000 means 16 Second, it will tack 16 Second for one page to scrape data
            }
        } else {
            console.log('Error for connection');
        }
    })
}

function ScrapStudent(u, y) {
    console.log('Page number  ' + y);
    var url = u + "/holidays/search?page=" + y;
    request(url, function(err, res, html) {
        if (!err) {
            var $ = cheerio.load(html);
            var data = $(this);
            $('a.sf-submit-button-flat').each(function(x) {
                var data = $(this);
                var alldata = {};
                if (data.attr("href") != "/stores") {
                    var childUrl = u + data.attr("href");
                    var parantData = data.parent().prev();
                    alldata["duration"] = parantData.children('.duration').children('.value').text();
                    alldata["package_name"] = parantData.children('a.product-title').children().text();
                    alldata["destination"] = parantData.children('.destination').text().split("\n")[2].trim();
                    alldata["operator"] = parantData.children('.operator').text().split("\n")[2].trim();
                    // console.log(alldata);
                    setTimeout(function(z) {
                        requ.query("select * from deal where link='" + childUrl + "'", function(err, cityD) {
                            if (!err) {
                                if (cityD.recordset.length > 0) {
                                    console.log('Already there')
                                } else {
                                    ScrapInnerData(childUrl, alldata, z);
                                }
                            } else {
                                console.log('Error for select data from deal table', err);
                            }
                        });
                    }, x * 2000, x);
                }
            });
        } else {
            console.log('Error for request', err);
        }
    })
}

function ScrapInnerData(url, alldata, y) {
    console.log('url', url);
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $(this);
            alldata['url'] = url;
            $('.everyone').each(function(e) {
                var data = $(this);
                var price = data.text();
                price = price.slice(1, -1);
                alldata["price"] = price;
            })
            var ex = $('.sf-prodinfo-expire').text().trim().split('/');
            var exDD = ex[0].slice(-2);
            var exMM = ex[1];
            var exYY = '20' + ex[2];
            alldata["expire"] = exDD + '/' + exMM + '/' + exYY;
            var date = $('.sf-readmore').text().trim();
            date = date.split(',')[0];
            //console.log('date',date);
            if (date.indexOf("dates") < 0) {
                date = getDate(date);
                alldata["dates"] = date;
            } else {
                date = date.substring(date.indexOf("dates"), date.length);
                date = getDate(date.slice(5));
                alldata["dates"] = date;
            }
            $('.sf-prodinfo-inclusions ul li').each(function(e) {
                var st = $(this);
                var findSt = st.text().split('-star');
                if (findSt.length > 1) {
                    var s = findSt[0].trim();
                    alldata["star"] = parseInt(s[s.length - 1]);
                }
            })

            $('div.sf-prodinfo-description p').each(function(i, e) {
                var newData = $(this);
                if (i == 1) {
                    alldata["description"] = newData.text().toString();
                }
                if (newData.text().includes('$')) {
                    var departing = newData.text();
                    departing = departing.substring(departing.indexOf(":"), departing.length).slice(1);
                    departing = departing.split("\n");
                    var departure = [];
                    for (var i = 0; i < departing.length; i++) {
                        if (departing[i].split("from").length > 1) {
                            departure.push({
                                value: departing[i].split("from")[0].trim(),
                                price: departing[i].split("from")[1].trim().substr(1).slice(0, -1)
                            })
                        }
                    }
                    alldata["departure"] = departure;
                }
            });
            var dealData = {
                purchase_by: alldata.expire || "",
                description: alldata.description || "",
                stars: alldata.star || 0,
                destination: alldata.destination || "",
                nights: parseInt(alldata.Duration) || 0,
                link: alldata.url || "",
                title: alldata.package_name || "",
                agency: "student flight"
            }
            console.log('dealData', dealData);
            requ.query("insert into deal(description,destination,stars,nights,link,title,purchase_by,agency) values('" + dealData.description + "','" + dealData.destination + "','" + dealData.stars + "','" + dealData.nights + "','" + dealData.link + "','" + dealData.title + "','" + dealData.purchase_by + "','student flight')",
                function(err, dealAdded) {
                    if (!err) {
                        requ.query("SELECT @@IDENTITY AS 'Identity'", function(err, lastIns) {
                            if (!err) {
                                for (var k = 0; k < alldata.departure.length; k++) {
                                    var deal_id = lastIns.recordset[0].Identity;
                                    var departure = alldata.departure[k].value || "";
                                    var price = parseFloat(alldata.departure[k].price) || 0.0;
                                    requ.query("insert into deal_departure(deal_id,departure,price) values('" +
                                        deal_id + "','" +
                                        departure + "','" +
                                        price + "')",
                                        function(err, addDepart) {
                                            if (!err) {
                                                requ.query("SELECT @@IDENTITY AS 'Identity'", function(err, lastInsDepart) {
                                                    if (!err) {
                                                        var da = alldata.dates.split('-');
                                                        var deal_departure_id = lastIns.recordset[0].Identity;
                                                        var date_from = da[0];
                                                        var date_to = da[1];
                                                        requ.query("insert into deal_dates(deal_id,deal_departure_id,date_from,date_to) values('" +
                                                            deal_id + "','" +
                                                            deal_departure_id + "','" +
                                                            date_from + "','" +
                                                            date_to + "')",
                                                            function(err, dateIns) {
                                                                if (!err) {
                                                                    console.log('INserted');
                                                                } else {
                                                                    console.log('Error for inserting into deal date', err);
                                                                    return;
                                                                }
                                                            })

                                                    } else {
                                                        console.log('Error for identity', err);
                                                    }
                                                });
                                            } else {
                                                console.log('Error for adding into deal_departure');
                                                return;
                                            }
                                        })
                                }
                            } else {
                                console.log('error for select into deal id', err);
                                return;
                            }
                        });
                    } else {
                        console.log('Error for insert into deal', err);
                        return;
                    }
                });

        } else {
            console.log('Error', error);
            return;
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
    d = d.replace('.', '');
    d = d.replace('  ', ' ');
    var date = d.trim().split('-');
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

// Return date in format of mm/dd/yyyy
function dateFormate(d) {
    var date = new Date(d);
    var mm = parseInt(date.getMonth()) + 1;
    return mm + '/' + date.getDate() + '/' + date.getFullYear();
}

//storeInfile();
function storeInfile() {
    var desData = [];
    desData.push(storeData);

    fs.readFile(path, function(err, d) {
        if (isEmptyObject(d)) {
            var json = desData;
        } else {
            var json = JSON.parse(d)
            json = json.concat(desData)
        }
        console.log('storeData', total);
        //after read file append new data in old
        var fileName = "studentHolliday";
        var path = __dirname + '/json/' + fileName + '.json';

        fs.writeFile(path, JSON.stringify(json, null, 4), function(err) {
            if (!err) {
                console.log('saved');
            }
        })
    });
}
/**
 * 03/01/18
 *  TO
 * 01/03/2018
 */
function purchageDate(date) {
    if (date) {
        var newD = date.split("/");
        var retuData = newD[1] + '/' + newD[0] + '/' + '20' + newD[2];
        return retuData;
    } else {
        return false;
    }
}


//console.log('alldata', alldata);
//console.log('storeData', storeData);
// connection.query('select * from allcity where url=?', url,
//         function(err, allcityData) {
//             if (!err) {
//                 if (allcityData.length == 0) {
//                     connection.query('insert into allcity set ?', storeData,
//                         function(err, dataIns) {
//                             if (!err) {
//                                 var cityId = dataIns.insertId;
//                                 for (var i = 0; i < departing.length; i++) {
//                                     if (departing[i].split("from").length > 1) {
//                                         var value = departing[i].split("from")[0].trim();
//                                         var price = departing[i].split("from")[1].trim().substr(1).slice(0, -1);
//                                         var destination = {
//                                             allcityid: cityId,
//                                             value: value,
//                                             price: price
//                                         }
//                                         connection.query('insert into destination set ?', destination,
//                                             function(err, desIns) {
//                                                 if (!err) {
//                                                     console.log('Data saved successfully');
//                                                     return;
//                                                 } else {
//                                                     console.log('Error for ins into destination', err);
//                                                     return;
//                                                 }
//                                             })
//                                     }
//                                 }
//                             } else {
//                                 console.log('Error', err);
//                                 return;
//                             }
//                         })
//                 } else {
//                     console.log('Already there so i am skipping it');
//                     return;
//                 }
//             } else {
//                 console.log('Error for selecing data from al city table');
//                 return;
//             }
//         })