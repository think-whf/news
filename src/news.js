const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');
//console.log(cheerio);
//创建http服务器
http.createServer((request,response)=>{
	response.writeHead(200,{
		'Control-Type':'text/plain;charset=utf-8',
	})
	var pathname = url.parse(request.url).pathname;
	var paramStr = url.parse(request.url).query;
	var param = querystring.parse(paramStr);
//路由
	switch(pathname) {
		case '/index':
			//response.end('123');
			index(param.num,param['callback'],'news',response);
		break;
		default:
		break;
	}
	
	
}).listen(8765,function(){
	console.log("服务器已打开")
});

function index(num,callback,src,response){
	var link ="http://3g.163.com/touch/reconstruct/article/list/BA8J7DG9wangning/"+num+"-10.html";
	http.get(link,(res)=>{
		var data = "";
		res.on('data',(chunk)=>{
			data+=chunk
		});
		res.on('end',()=>{
			console.log(data)
			data = data.substring(9,data.length-1);
			var readPath = './'+src+'.json';
			var news;
			var writestream = fs.createWriteStream('news.json');
			writestream.write(data);
			fs.readFile(readPath, function(err,data) {
				news=data.toString();
				response.end(callback+"("+news+")");
			})	
			
		})
	}).end();
}