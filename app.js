const express = require('express') // express '.js' 생략가능 js 아닌 것만 확장자를 주면 됨. 경로없이 쓰면 무족권 node_modules 에서 찾아서 가져온다.
const app = express(); // express 함수를 실행시킴

const bodyParser = require('body-parser');

// listen() : express 의 method 이며, 서버를 구동시킨다.
app.listen(8000, () => {
	console.log("http://localhost:8000");
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
	res.send(comment);
});