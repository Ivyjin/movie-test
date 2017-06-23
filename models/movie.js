var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie");

var Movie = mongoose.model("Movie",MovieSchema);//对模式进行编译，生成构造函数

module.exports = Movie;