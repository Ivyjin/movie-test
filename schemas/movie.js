var mongoose = require("mongoose");//引入数据库建模工具模块

var MovieSchema = new mongoose.Schema({//模式，跟电影有关的字段以及他们的类型
	title:String,
	doctor:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{//数据录入时间和更新时间
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//更新时间函数
MovieSchema.pre("save",function(next){ //pre意思是每次存储数据之前都会调用此方法
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

MovieSchema.statics = {//必须经过模型实例化之后才能有这个方法
	fetch: function(cb){//用于去除目前数据库中所有的数据
		return this
			.find({})
			.sort("meta.updateAt")
			.exec(cb)
	},
	findById: function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}
module.exports = MovieSchema;