var mongoose = require('mongoose')
  , things = require('../models/things.js');

module.exports = ThingsList;

function ThingsList(connection) {
  mongoose.connect(connection);
}


function diffArrays (A, B) {

  var strA = ":" + A.join("::") + ":";
  var strB = ":" +  B.join(":|:") + ":";

  var reg = new RegExp("(" + strB + ")","gi");

  var strDiff = strA.replace(reg,"").replace(/^:/,"").replace(/:$/,"");

  var arrDiff = strDiff.split("::");

  return arrDiff;
}




ThingsList.prototype = {
    searchThings: function(req, res) {
        var values=req.params.values.split(" ");
        inValues = values.map(function(el) { 
            return new RegExp(el, 'i'); 
        });
        things.where('Features.fValue').in(inValues).limit(50).exec( function(err, items) {
        // things.find({'Features.fValue': {$all : [{$regex: re}]}}, function foundThings(err, items) {
        //things.find({ 'Features.fValue': { $regex: re} }, function foundThings(err, items) {
            if(err) { return res.send(err) };
            var yAxis = [],
            xAxis = ["Feature"],
            Columns = [{"field":"Feature","title":"Feature","width":100}],
            matrix = [];
            var xi;
            items.forEach(function(th) {
                th.Features.forEach(function(f) {
                    var xName = f['tName'].replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');
                    xi = xAxis.indexOf(xName);
                    if( xi == -1) {
                        xAxis.push(xName);
                        var xObj = {};
                        xObj.field = xName
                        xObj.title = f['tName'];
                        xObj.width = f['tName'].length;
                        Columns.push(xObj)
                    } else
                    {
                        if (f['tName'].length < 180){
                           if (Columns[xi-1].width < f['tName'].length * 7.5) {
                                Columns[xi-1].width = f['tName'].length * 7.5;
                           }
                        }

                    }
                    var yi = 1;
                    var yObj = [];
                    yObj = f['fName'];
                    yi = yAxis.indexOf(yObj);
                    if(yi == -1) {
                        yAxis.push(yObj);
                        var yObj = {};
                        yObj.Feature = f['fName'];
                        yi = matrix.push(yObj);
                        matrix[yi - 1][xName] = f['fValue'];
                    } else {
                        matrix[yi][xName] = f['fValue'];
                    };
                });
            });
            var y = 0 ;
            matrix.forEach(function(row,y) {
                var keys = Object.keys(row);
                y=y;
                var dif = diffArrays(xAxis,keys)
                dif.forEach(function(x) {
                        matrix[y][x] = ""
                })
            });
            if(!err) {
                return res.send([Columns, matrix]);
            } else {
                return console.log(err);
            }
        });
    } //,


    /* addThings: function(req,res) {
    var item = req.body.item;
    newThing = new things();
    newThing.ThingName = item.ThingName;
    newThing.ThingCategory = item.ThingCategory;
    newThing.ThingsName  = item.ThingsName;
    newThing.ThingsValue  = item.ThingsValue;
    newThing.save(function savedThings(err){
    if(err) {
    throw err;
    }
    });
    res.redirect('\\');
    }*/
}