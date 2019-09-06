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

// 방명록을 node.js 개발자가 전부 만드는 방식
app.get(["/page", "/page/:page"], (req, res) => {
	var page = req.params.page;
	if(!page) page = "없는" //req.params.page 가 없을때 처리
	var title = "도서목록"
	var css = "page";
	var js = "page";
	var vals = {page, title, css, js}; //{page: pager, title: title}
	res.render("page", vals);
});

app.get(["/gbook", "/gbook/:type"], (req, res) => { //gbook/in, list 해도 /gbook/:type으로 들어옴
	var type = req.params.type;
	var vals = {
		css: "gbook",
		js: "gbook"
	}
	var pug;
	switch(type) {
		case "in":
			vals.title = "방명록 작성";
			pug = "gbook_in";
			res.render(pug, vals);
			break;
		default:
			var sql = "SELECT * FROM gbook ORDER BY id DESC"
			sqlExec(sql).then((data) => {
				vals.datas = data[0];
				vals.title = "방명록";
				pug = "gbook";
				for(let item of data[0]) {
					item.wtime = util.dspDate(new Date(item.wtime));
				}
				res.render(pug, vals);
			}).catch(sqlErr);
			break;
		}
});

// 방명록을 Ajax 통신으로 데이터만 보내주는 방식

// 페이지 디자인만 보여줌
app.get("/gbook_ajax", (req, res) => {
	var title = "방명록 - Ajax";
	var css = "gbook_ajax";
	var js = "gbook_ajax";
	var vals = {title, css, js};
	res.render("gbook_ajax", vals);
});

//http://127.0.0.1:3000/gbook_ajax/1?grpCnt=10
// 실제 ajax 통신을 하는 부분
app.get("/gbook_ajax/:page", (req, res) => { 
	var page = Number(req.params.page);
	var grpCnt = Number(req.query.grpCnt); // 한페이지에 보여질 목록 갯수
	var stRec = (page - 1) * grpCnt; // 목록을 가져오기 위해 목록의 시작 INDEX
	var vals = []; // query에 보내질 ? 값
	var reData = []; // res.json() 보낼 데이터 값
	// 총 페이지수 가져오기
	var sql = "SELECT count(id) FROM gbook";
	sqlExec(sql).then((data) => {
		reData.push({totCnt: data[0][0]["count(id)"]}); 
		sql = "SELECT * FROM gbook ORDER BY id DESC LIMIT ?, ?";
		vals = [stRec, grpCnt];
		sqlExec(sql, vals).then((data) => {
			reData.push(data[0]);
			res.json(reData);
		}).catch(sqlErr);
	}).catch(sqlErr);
});


// Router 영역 - POST
app.post("/gbook_save", (req, res) => {
	var writer = req.body.writer;
	var pw = req.body.pw;
	var comment = req.body.comment;
	var sql = "INSERT INTO gbook SET comment=?, wtime=?, writer=?, pw=?";
	var vals = [comment, util.dspDate(new Date()), writer, pw];
	sqlExec(sql, vals).then((data) => {
		res.redirect("/gbook");
	}).catch(sqlErr);
});