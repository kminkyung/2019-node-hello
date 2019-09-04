const express = require('express') // express '.js' 생략가능 js 아닌 것만 확장자를 주면 됨. 경로없이 쓰면 무족권 node_modules 에서 찾아서 가져온다.
const app = express(); // express 함수를 실행시킴

const bodyParser = require('body-parser');

const db = require("./modules/mysql_conn");
const mysql = db.mysql;
const sqlPool = db.sqlPool;
const sqlErr = db.sqlErr;
const sqlExec = db.sqlExec;
const util = require("./modules/util");

// listen() : express 의 method 이며, 서버를 구동시킨다.
app.listen(8000, () => {
	console.log("http://localhost:8000");
});

// Router (길잡이)
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", express.static("./public"));
app.set("view engine", "pug") //view를 랜더링해주는 엔진은 pug를 쓸 것, "view engine"은 app이 가지는 속성값
app.set("views", "./view") //view들이 담기는 곳은 ./views 라는 폴더라는 뜻

app.get("/hello", (req, res) => {
	var id = req.query.userid; //http://127.0.0.1:3000/hello?userid=minkyung
	var style = `style="text-align: center; color: blue; padding: 3rem;"`;
	var html = `<h1 ${style}>${id} 님 반갑습니다~~~~!!!!</h1>`;
	res.send(html);
});

// async / await 패턴
app.post("/gbook_save", (req, res) => {
	var comment = req.body.comment;
	var sql = "INSERT INTO gbook SET comment=?, wtime=?"; //sql에 insert문을 만들어놓음
	var vals = [comment, util.dspDate(new Date())];
	sqlExec(sql, vals).then((data) => {
		console.log(data);
		res.send(data);
	}).catch(sqlErr);
});

// Semantic 방식
app.get("/gbook/:page", (req, res) => {
	var page = req.params.page;
	res.send("현재 페이지는 " +page+"입니다.");
});