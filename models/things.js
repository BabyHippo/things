var mongoose = require('mongoose')
 , Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var FeatureSchema = new Schema({
    _id     : ObjectId
  , tID     : String
  , tName   : String
  , fName   : String
  , fValue  : String
});

var ThingSchema = new Schema({
    _id     : ObjectId
  , tID     : String
  , tName   : String
  , tType   : String
  , Features  : [FeatureSchema]
});

module.exports = mongoose.model('things', ThingSchema)