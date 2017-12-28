var url = "https://www.myholidaycentre.com.au/";


//  deal(description,destination,stars,nights,link,title,purchase_by,agency)
// *** String ,String,int,int,String,String,String('mm/dd/yyyy')

// deal_departure(deal_id,departure,price)
// ** Int,String,Float

// deal_dates(deal_id,deal_departure_id,date_from,date_to)
// ** Int,Int,date,String('mm/dd/yyyy')

exports.holidaycenterScrape = function(req, res) {

    }
    /**
     * DD/MM/YYYY
     *  TO
     * MM/DD/YYYY
     */
function purchageDate(date) {
    if (date) {
        var newD = date.split("/");
        var retuData = newD[1] + '/' + newD[0] + '/' + newD[2];
        return retuData;
    } else {
        return false;
    }
}