// 앱실행
const express = require("express"); //node_modules의 express import
const app = express(); // excute express
const port = 3000;
app.listen(port, () => {
	console.log("http://127.0.0.1:"+port);
});

// node_modules 참조
const bodyParser = require("body-parser"); //node_modules 의 body-parser import, post방식받기
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const session = require("express-session");
const store = require("session-file-store")(session);

// modules 참조 (내가 만든 것들)
const util = require("./modules/util");
const db = require("./modules/mysql_conn");
const pager = require("./modules/pager");
// import {val1, val2} from "./modules/pager";
const mt = require("./modules/multer_conn");

// 전역변수 선언
const sqlPool = db.sqlPool; //mysql_conn 에서 export 한 변수
const sqlExec = db.sqlExec;
const sqlErr = db.sqlErr;
const mysql = db.mysql; //mysql2/promise
const salt = "My Password Key"; // 알려지면 안되는 key값
var loginUser = {};

// app 초기화(설정)
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true})); //body-parser setting
app.use(session({
	secret: salt,
	resave: false, 
	saveUninitialized: true,
	store: new store()
}));  
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
	var vals = {page, title, css, js, loginUser}; //{page: pager, title: title}
	res.render("page", vals);
});

// 방명록을 node.js 개발자가 전부 만드는 방식
/* 
type: in - 작성
type: li/1(id - page) - 목록
type: up/1(id) - 수정
type: rm/1(id) - 삭제
*/
app.get(["/gbook", "/gbook/:type", "/gbook/:type/:id"], (req, res) => { //gbook/in, list 해도 /gbook/:type으로 들어옴
	loginUser = req.session.user; // login : 저장된 userid, 미login : undefined.
	// req.session.user = {id: userid, name: username, grade: grade}
	var type = req.params.type;
	var id = req.params.id;
	if(!util.nullchk(type)) type = "li";
	if(type == "li" && !util.nullchk(id)) id = "1";
	if(!util.nullchk(id) && type !== "in") res.redirect("/404.html");
	var vals = {
		css: "gbook",
		js: "gbook",
		loginUser
	}
	var pug;
	var sql;
	var sqlVal;
	var result;
	switch(type) {
		case "in":
			vals.title = "방명록 작성";
			pug = "gbook_in";
			res.render(pug, vals);
			break;
		case "li":
			(async () => {
				var totCnt = 0;
				var page = id;
				var divCnt = 3;
				var grpCnt = 5;
				// sql total count
				sql = "SELECT count(id) FROM gbook";
				result = await sqlExec(sql);
				totCnt = result[0][0]["count(id)"]; 

				// sql startRecord grpCnt
				const pagerVal = pager.pagerMaker({totCnt, grpCnt, page});
				pagerVal.link = "/gbook/li/";
				sql = "SELECT * FROM gbook ORDER BY id DESC limit ?, ?"
				sqlVal = [pagerVal.stRec, pagerVal.grpCnt];
				result = await sqlExec(sql, sqlVal);
				vals.datas = result[0];
				for(let item of vals.datas) item.useIcon = util.iconChk(item.wtime, item.savefile); //배열datas를 돌면서 item.useIcon을 추가함
				// console.log(vals.datas);
				vals.title = "방명록";
				vals.pager = pagerVal;
				pug = "gbook";
				for(let item of vals.datas) {
					item.wtime = util.dspDate(new Date(item.wtime));
				}
				res.render(pug, vals); //vals에 title, pager{totCnt, grpCnt, page} 를 넣음
			})();
/* 			var sql = 
			sqlExec(sql).then((data) => {
				vals.datas = data[0];
				vals.title = "방명록";
				pug = "gbook";
				for(let item of data[0]) {
					item.wtime = util.dspDate(new Date(item.wtime));
				}
				res.render(pug, vals);
			}).catch(sqlErr); */
			break;
		default:
			res.redirect("/404.html")
			break;
		}
});

//http://127.0.0.1/api/modaldata?id=2
//http://127.0.0.1/api/remove?id=2$pw=11111111
//http://127.0.0.1/api/update
app.get("/api/:type", (req, res) => {
	var type = req.params.type;
	var id = req.query.id;
	var pw = req.query.pw;
	var sql;
	var vals = [];
	var result;
	switch(type) {
		case "modalData":
			if(id === undefined) res.redirect("/500.html");
			else {
				sql = "SELECT * FROM gbook WHERE id=?";
				vals.push(id); //배열 vals의 0번째에 id를 넣음
				(async () => {
					result = await sqlExec(sql, vals);
					res.json(result[0][0]);
				})();
			} 
			break;
		default:
			res.redirect("/404.html");
			break;
	}
});

// 근데 post 방식에서도 params 를 쓸 수있는거야..? 아직 post방식이 어떻게 작동하는지 잘 모르겠어..
app.post("/api/:type", mt.upload.single("upfile"), (req, res) => {
	var type = req.params.type;
	var id = req.body.id;
	var pw = req.body.pw;
	var page = req.body.page;
	var writer = req.body.writer;
	var comment = req.body.comment;
	var sql = "";
	var vals = [];
	var result;
	var obj = {};
	var orifile = ""; //file을 업로드 안했으면 빈문자열로
	var savefile = "";
	var oldfile = "";
	if(req.file) {
		orifile = req.file.originalname; //file을 업로드했으면
		savefile = req.file.filename;
	}
	switch(type) {
		case "remove":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				vals.push(id);
				vals.push(pw);
				(async () => {
					// 첨부파일 가져오기
					sql = "SELECT savefile FROM gbook WHERE id="+id;
					result = await sqlExec(sql);
					savefile = result[0][0].savefile;
					// 실제 데이터베이스 삭제
					sql = "DELETE FROM gbook WHERE id=? AND pw=?";
					result = await sqlExec(sql, vals);
					if(result[0].affectedRows == 1)	{
						obj.msg = "삭제되었습니다.";
						if(util.nullchk(savefile)) fs.unlinkSync(path.join(__dirname, "/public/uploads/"+mt.getDir(savefile)+"/"+savefile));
					}
					else obj.msg = "비밀번호가 올바르지 않습니다.";
					obj.loc = "/gbook/li/"+page;
					res.send(util.alertLocation(obj));
				})();
			}
			break;
		case "update":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				vals.push(writer);
				vals.push(comment);
				if(req.file) vals.push(orifile);
				if(req.file) vals.push(savefile);
				vals.push(id);
				vals.push(pw);
				(async () => {
					// 첨부파일 가져오기
					sql = "SELECT savefile FROM gbook WHERE id="+id;
					result = await sqlExec(sql);
					oldfile = result[0][0].savefile;
					// 실제 데이터 수정
					sql = "UPDATE gbook SET writer=?, comment=? ";
					if(req.file) sql += ", orifile=?, savefile=?";
					sql += "WHERE id=? AND pw=?";
					result = await sqlExec(sql, vals);
					if(result[0].affectedRows == 1)	{
						obj.msg = "수정되었습니다.";
						// 기존파일 삭제하기
						if(req.file && util.nullchk(oldfile)) fs.unlinkSync(path.join(__dirname, "/public/uploads/"+mt.getDir(oldfile)+"/"+oldfile));
					}
					else obj.msg = "비밀번호가 올바르지 않습니다.";
					obj.loc = "/gbook/li/"+page;
					res.send(util.alertLocation(obj));
				})();
			}
			break;
		default:
			res.redirect("/404.html");
			break;
	}
});


// file download Route
app.get("/download/", (req, res) => {
	const fileName = req.query.fileName;
	const downName = req.query.downName; // 업로드 파일명 (예: desert.jpg)
	const filePath = path.join(__dirname, "/public/uploads/"+mt.getDir(fileName)+"/") + fileName; 
// 실제 저장된 파일명 (예: ts-00.jpg)
res.download(filePath, downName); // download 는 express 가 가지고있는 기능
});






// 방명록을 Ajax 통신으로 데이터만 보내주는 방식
// 페이지 디자인만 보여줌
app.get("/gbook_ajax", (req, res) => {
	loginUser = req.session.user;
	var title = "방명록 - Ajax";
	var css = "gbook_ajax";
	var js = "gbook_ajax";
	var vals = {title, css, js, loginUser};
	res.render("gbook_ajax", vals);
});

//http://127.0.0.1:3000/gbook_ajax/1?grpCnt=10
// 실제 ajax 통신을 하는 부분
app.get("/gbook_ajax/:page", (req, res) => { 
	var page = Number(req.params.page);
	var grpCnt = Number(req.query.grpCnt); // 한페이지에 보여질 목록 갯수
	var stRec = (page - 1) * grpCnt; // 목록을 가져오기 위해 목록의 시작 INDEX
	var vals = []; // query에 보내질 ? 값
	var reData = {}; // res.json() 보낼 데이터 값
	var sql;
	var result;
	(async () => {
		// 총 페이지 수 갖오기
		sql = "SELECT count(id) FROM gbook";
		result = await sqlExec(sql);
		reData.totCnt = result[0][0]["count(id)"]; 
		// 레코드 가져오기
		sql = "SELECT * FROM gbook ORDER BY id DESC LIMIT ?, ?";
		vals = [stRec, grpCnt];
		result = await sqlExec(sql, vals);
		reData.rs = result[0];
		res.json(reData);
		// console.log(reData);
	})()
});


// Router 영역 - POST
app.post("/gbook_save", mt.upload.single("upfile"), (req, res) => { // 파일이 안올라가면 req 변수에 false가 붙어있는 상태
	var writer = req.body.writer;
	var comment = req.body.comment;
	var pw = "";
	var userid = "";
	if(req.session.user) userid = req.session.user.id;
	else pw = req.body.pw;
	var orifile = ""; //file을 업로드 안했으면 빈문자열로
	var savefile = "";
	if(req.file) {
		orifile = req.file.originalname; //file을 업로드했으면
		savefile = req.file.filename;
	}
	var result;
	var sql = "INSERT INTO gbook SET comment=?, wtime=?, writer=?, pw=?, orifile=?, savefile=?, userid=?";
	var vals = [comment, util.dspDate(new Date()), writer, pw, orifile, savefile, userid];
	(async () => {
	 result =	await sqlExec(sql, vals);
	 if(result[0].affectedRows > 0) {
		 if(req.fileValidateError === false) {
			 res.send(util.alertLocation({
				 msg: "허용되지 않는 파일형식이므로 파일을 업로드하지 않았습니다. 첨부파일을 제외한 내용은 저장되었습니다",
				 loc: "/gbook"
			 }));
		 }
		else res.redirect("/gbook");
	 }
	 else res.redirect("/500.html");
	})();
});


/* 회원가입 및 로그인 등 */

/* 회원 라우터 */
app.get(["/mem/:type", "/mem/:type/:id"], memEdit); // 회원가입, id/pw찾기, 회원리스트, 회원정보, 로그인/로그아웃
app.post("/api-mem/:type", memApi); // 회원가입시 각종 Ajax
app.post("/mem/join", memJoin); // 회원가입 저장
app.post("/mem/login", memLogin); // 회원 로그인 모듈
app.post("/mem/update", memUpdate); // 회원 로그인 모듈

/* 함수구현 - GET */
function memEdit(req, res) {
	// 여기서 왜 함수표현식과 arrow function을 안썼냐면 함수선언문을 써야 hoisting 되서 밑에 있어도 찾을 수 있으므로.
	loginUser = req.session.user;
	const type = req.params.type;
	const vals = {css: "mem", js: "mem", loginUser};
	var result;
	switch(type) {
		case "join":
			vals.title = "회원가입";
			vals.tel = util.telNum;
			res.render("mem_in", vals);
			break;
		case "login":
			vals.title = "회원로그인";
			res.render("mem_login", vals)
			break;
		case "logout":
			req.session.destroy();
			res.redirect("/");
			break;
		case "edit":
			(async () => {
				sql = "SELECT * FROM member WHERE userid='"+req.session.user.id+"'";
				result = await sqlExec(sql, vals);
				vals.title = "회원정보수정";
				vals.tel = util.telNum;
				vals.myData = result[0][0];
				res.render("mem_up", vals)
			})();
			break;
		case "remove":
			if(util.adminChk(req.session.user)) {
				var id = req.query.id;
				(async () => {
					sql = "DELETE FROM member WHERE id="+id;
					result = await sqlExec(sql);
					if(result[0].affectedRows == 1) res.send(util.alertLocation({
						msg: "삭제되었습니다.",
						loc: "/mem/list"
					}))
					else res.send(util.alertLocation({
						msg: "삭제실패",
						loc: "/mem/list"
					}))
				})();
			}
			else res.send(alertAdmin());
			break;
		case "list":
			var page = req.params.id;
			var totCnt = 0;
			var divCnt = 3;
			var grpCnt = 3;
			if(!util.nullchk(page)) page = "1";
			vals.title = "회원리스트 - 관리자";
			(async () => {
				sql = "SELECT count(id) FROM member"; 
				result = await sqlExec(sql);
				totCnt = result[0][0]["count(id)"]; 
				const pagerVal = pager.pagerMaker({totCnt, grpCnt, page});
				pagerVal.link = "/mem/list/";
				sql = "SELECT * FROM member ORDER BY id DESC limit ?, ?";
				result = await sqlExec(sql, [pagerVal.stRec, pagerVal.grpCnt]);
				vals.lists = result[0];
				vals.pager = pagerVal;
				if(util.adminChk(req.session.user)) res.render("mem_list", vals);
				else res.send(util.alertAdmin());
			})();
			break;
		default:
			break;
	}
}

/* 함수구현 - POST */
function memApi(req, res) {
	const type= req.params.type;
	var sql ="";
	var sqlVals = [];
	var result;
	switch(type) {
		case "userid":
			const userid = req.body.userid;
			(async() => {
				sql = "SELECT count(id) FROM member WHERE userid=?"
				sqlVals.push(userid);
				result = await sqlExec(sql, sqlVals);
				// res.json(result[0][0]["count(id)"]);
				if(result[0][0]["count(id)"] > 0) res.json({chk: false});
				else res.json({chk: true});
			})();
			break;
		default:
			break;
	}
}
/* 회원가입저장 */
function memJoin(req, res) {
	const vals = [];
	var userpw= crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64");
	vals.push(req.body.userid);
	vals.push(userpw);
	vals.push(req.body.username);
	vals.push(req.body.tel1 + "-" + req.body.tel2 + "-" + req.body.tel3);
	vals.push(req.body.post);
	vals.push(req.body.addr1 + " " + req.body.addr2);
	vals.push(req.body.addr3);
	vals.push(new Date());
	vals.push(2);
	var sql = "";
	var result = {};
	(async() => {
		sql = "INSERT INTO member SET userid=?, userpw=?, username=?, tel=?, post=?, add1=?, add2=?, wtime=?, grade=?";
		result = await sqlExec(sql, vals);
		res.send(util.alertLocation({
			msg: "가입되었습니다.",
			loc: "/mem/login"
		}))
	})();
}

/* 회원정보수정 */
function memUpdate(req, res) {
	const vals = [];
	var userpw= crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64");
	// 바뀔 내용들
	vals.push(userpw);
	vals.push(req.body.username);
	vals.push(req.body.tel1 + "-" + req.body.tel2 + "-" + req.body.tel3);
	vals.push(req.body.post);
	vals.push(req.body.addr1 + " " +req.body.addr2);
	vals.push(req.body.addr3);
	vals.push(req.session.user.id);
	var sql = "";
	var result = {};
	(async () => {
		sql = "UPDATE member SET userpw=?, username=?, tel=?, post=?, add1=?, add2=? WHERE userid=?";
		result = await sqlExec(sql, vals);
		if(result[0].affectedRows == 1) res.send(util.alertLocation({
			msg: "정보가 수정되었습니다.",
			loc: "/"
		}))
	})();
}
/* 로그인 처리 모듈 */
function memLogin(req, res) {
	var userid = req.body.loginid;
	var userpw = req.body.loginpw;
	var result;
	var sql = "";
	var vals = [];
	userpw = crypto.createHash("sha512").update(userpw + salt).digest("base64");
	(async () => {
		sql = "SELECT * FROM member WHERE userid=? AND userpw=?" // id의 갯수
		vals.push(userid);
		vals.push(userpw);
		result = await sqlExec(sql, vals);
		// console.log(result[0][0]);
		if(result[0].length == 1) {
			req.session.user = {};
			req.session.user.id = userid;
			req.session.user.name = result[0][0].username;
			req.session.user.grade = result[0][0].grade;
			res.redirect("/");
		}
		else {
			req.session.destroy();
			res.send(util.alertLocation({
				msg: "아이디 또는 패스워드가 틀렸습니다.",
				loc: "/mem/login"
			}))
		}
	})()
} 