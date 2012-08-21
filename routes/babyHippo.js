//babyHippo Code

module.exports = function(app) {
    var ThingsList = require('../Controlers/thingslist');
    var thingsList = new ThingsList('mongodb://babyhippo.cloudapp.net/babyhippo');
    //var thingsList = new ThingsList('mongodb://localhost/babyhippo');
    app.get('/api/things/search/:values',thingsList.searchThings.bind(thingsList));
    // app.post('/addthings', thingsList.addThings.bind(thingsList)); 
}