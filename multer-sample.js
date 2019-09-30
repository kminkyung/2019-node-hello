const express = require("express");
const app = express();
const path = require("path"); // 경로찾아주는 애
const bodyParser = require("body-parser");
const util = require("./modules/util");

const multer = require("multer");
const splitName = (file) => {
	var arr = file.split("."); // "a.b.jpg" -> split -> ["a","b","jpg"]
	// var fileName = fileArr.join("."); // ["a","b","jpg"] -> join -> "a.b.jpg"
	var obj = {};
	obj.time = Date.now();
	obj.ext = arr.pop(); // arr = ["a", "b"]; pop() 마지막 애 빼는거
	obj.name = obj.time + "-" + Math.floor(Math.random() * 90 + 10) //0부터 99만들기;
	obj.saveName = obj.name + "." + obj.ext;
	return obj;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'public/uploads/sample')); // 이거 모르겠어. __dirname 상수는 (path의)file이 존재하는 절대경로+public/uploads/sample를 join() __dirname+경로를 붙여줌
  },
  filename: (req, file, cb) => {
		var newFile = splitName(file.originalname);
    cb(null, newFile.saveName);
  }
});
const upload = multer({ storage: storage });


// 서버실행
app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
});

// 초기설정
app.locals.pretty = true;
app.set("view engine", "ejs");
app.set("views", "./ejs");
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get(["/multer", "/multer/:type"], (req, res) => {
	var type = req.params.type;
	var vals = {};

	if(type === undefined) type = "in";
	switch(type) {
		case "in":
			vals.title = "파일 업로드 폼";
			vals.comment = "파일 업로드 폼입니다.";
			res.render("multer_in", vals);
			break;
		default: 
			res.send("/404.html");
			break;
	}
});

app.post("/multer_write", upload.single("upfile"), (req, res) => {
	var title = req.body.title; //body는 body-parser 덕분	
	// var file = req.body.upfile;
	if(req.file) res.send('<img src="/uploads/sample/'+req.file.filename+'">');
	else res.send("저장되었습니다.")
})