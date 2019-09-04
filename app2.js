// 앱실행
const express = require("express"); //node_modules의 express import
const app = express(); // excute express
const port = 3000;
app.listen(port, () => {
	console.log("http://127.0.0.1:"+port);
});

// node_modules 참조
const bodyParser = require("body-parser"); //node_modules 의 body-parser import, post방식받기

// modules 참조 (내가 만든 것들)
const util = require("./modules/util")
const db = require("./modules/mysql_conn")

// 전역변수 선언
const sqlPool = db.sqlPool; //mysql_conn 에서 export 한 변수
const sqlExec = db.sqlExec;
const sqlErr = db.sqlErr;
const mysql = db.mysql; //mysql2/promise

// app 초기화(설정)
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true})); //body-parser setting
app.set("view engine", "pug");//view를 랜더링해주는 엔진은 pug를 쓸 것, "view engine"은 app이 가지는 속성값
app.set("views", "./views"); //view들이 담기는 공간은, ./views 
app.locals.pretty = true; //locals(property).pretty(property) ???이게 뭘까??

// Router 영역 - GET
//http://127.0.0.1:3000/page
//http://127.0.0.1:3000/page/1
app.get(["/page", "/page/:page"], (req, res) => {
	var page = req.params.page;
	if(!page) page = "없는" //req.params.page 가 없을때 처리
	var title = "도서목록"
	var css = "page";
	var js = "page";
	var vals = {page, title, css, js}; //{page: pager, title: title}
	res.render("page", vals);
});


// Router 영역 - POST