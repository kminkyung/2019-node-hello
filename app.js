const express = require('express') // express '.js' 생략가능 js 아닌 것만 확장자를 주면 됨. 경로없이 쓰면 무족권 node_modules 에서 찾아서 가져온다.
const app = express(); // express 함수를 실행시킴

const bodyParser = require('body-parser');

const db = require("./modules/mysql_conn");
const util = require("./modules/util");

// const nameMaker = require('./modules/test');

// listen() : express 의 method 이며, 서버를 구동시킨다.
app.listen(8000, () => {
	console.log("http://localhost:8000");
/* 	console.log(nameMaker.firstName);
	console.log(nameMaker.lastName);
	console.log(nameMaker.fullName()); */
});


// Router (길잡이)
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", express.static("./public"));

app.get("/hello", (req, res) => {
	var id = req.query.userid; //http://127.0.0.1:3000/hello?userid=minkyung
	var style = `style="text-align: center; color: blue; padding: 3rem;"`;
	var html = `<h1 ${style}>${id} 님 반갑습니다~~~~!!!!</h1>`;
	res.send(html);
});


app.post("/gbook_save", (req, res) => {
	var comment = req.body.comment;
	db.conn.getConnection((err, connect)=>{
		if(err) res.send("DB접속 오류가 발생했습니다.")
		else {
			var sql = 'INSERT INTO gbook SET comment=?, wtime=?'; //query문
			var vals = [comment, util.dspDate(new Date())]; //첫번째 물음표 값을 첫번째 인자에, 두번째 물음표 값을 두번째 인자에 vals 배열화
			connect.query(sql, vals, (err, result) => {
				connect.release();
				if(err)	res.send("데이터 저장에 실패했습니다.");
				else {
					res.send("데이터가 처리되었습니다.");
				}
			});
		}
	}); //접근이 성공하면 함수를 실행. params 은 위처럼 두 개 넣는 걸로 매뉴얼로 정해져있음.
});


// Semantic 방식
app.get("/gbook/:page", (req, res) => {
	var page = req.params.page;
	res.send("현재 페이지는 " +page+"입니다.");
});