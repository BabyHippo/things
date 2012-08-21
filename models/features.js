var mongoose = require('mongoose')
 , Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;


var FeatureFilteredSchema = new Schema({
    _id     : ObjectId
  , tID     : String
  , tName   : String
  , fName   : String
  , fValue  : String
});

module.exports = mongoose.model('features', FeatureFilteredSchema)