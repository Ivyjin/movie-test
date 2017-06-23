var express = require("express");//调用express模板
var port = process.env.port || 3000;//设置端口号，从命令行中或者3000
var path = require("path");//处理文件路径模块
var app = express();//express 模块导出的入口（top-level）函数
var _ = require("underscore");//js工具库，中文apihttp://www.bootcss.com/p/underscore/#
var bodyParser = require("body-parser");//消息体解析中间件，但是这个中间件不会解析multipart body
var mongoose = require("mongoose");//引入数据库建模工具模块
var dbUrl = "mongodb://localhost/movieTest";//数据库的连接

var Movie = require("./models/movie")//引入movie模型

mongoose.connect(dbUrl);//连接数据库

app.set("views","./views/pages");//设置视图路径
app.set("view engine","jade");//设置模板引擎
app.locals.moment = require('moment');//时间格式化组件
app.listen(port);//监听端口

console.log("movie is listening from " + port);

app.use(express.static(path.join(__dirname,"public")));//设置静态资源路径
app.use(bodyParser.urlencoded({extended:true}));//这是URL-encoded解析器，extended=false表示用queryString来解析数据
app.use(bodyParser.json());
//route
//index page
app.get("/",function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render("index",{
			title:"movie 首页",
			movies:movies
		})
	})
	
})
//detail page
app.get("/movie/:id",function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}
		// console.log(movie)
		res.render("detail",{
			title:"movie" + movie.title,
			movie:movie
		})
	})
})
//list page
app.get("/admin/list",function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render("list",{
			title:"movie 列表页",
			movies:movies
		})
	})
})
//delete list
app.delete("/admin/movie/list",function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		})
	}
})
//admin update movie 在录入页点更新 将电影数据初始化到表单中
app.get("/admin/update/:id",function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render("admin",{
				title:"movie 后台更新页",
				movie:movie
			})
		})
		
	}

})
//admin post page
app.post("/admin/movie/new",function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id != "undefined"){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie,movieObj);//underscore函数，将后面参数的所有属性复制到前面参数上，并且返回前面参数，复制是按顺序的，所以后面的对象属性会把前面的对象属性覆盖掉
			// _movie.save(function(err,movie){
			// 	if(err){
			// 		console.log(err)
			// 	}
			// 	res.redirect("/movie/" + movie._id)
			// })
		})
	}else{
		_movie = new Movie({
			title:movieObj.title,
			doctor:movieObj.doctor,
			country:movieObj.country,
			year:movieObj.year,
			poster:movieObj.poster,
			flash:movieObj.flash,
			summary:movieObj.summary,
			language:movieObj.language
		})
	}
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect("/movie/" + movie._id);//页面重定向
		})
})
//admin page
app.get("/admin/movie",function(req,res){
	res.render("admin",{
		title:"movie 后台录入页",
		movie:{
			title:"",
			doctor:"",
			country:"",
			year:"",
			poster:"",
			flash:"",
			summary:"",
			language:""
		}
	})
})
