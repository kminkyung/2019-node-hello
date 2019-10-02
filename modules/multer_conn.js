const multer = require("multer");
// File System(fs) : node.js 가 가지고 있고, 폴더와 파일을 컨트롤 한다.
const fs = require("fs"); 
const path = require("path"); //node.js 가 가지고 있다. 경로를 찾아준다.

// splitName() : 파일명을 "문자열"로 받아서 확장자 처리 및 새로운 파일명으로 변경 후 return.
const splitName = (file) => {
	var arr = file.split("."); // "a.b.jpg" -> split -> ["a","b","jpg"]
	var obj = {};
	obj.time = Date.now();
	obj.ext = arr.pop(); // arr = ["a", "b"]; pop() 마지막 애 빼는거
	obj.name = obj.time + "-" + Math.floor(Math.random() * 90 + 10) //0부터 99만들기;
	obj.saveName = obj.name + "." + obj.ext;
	return obj;
}

// 파일명을 받아서 년월(예: 1909) 폴더명을 return
const getDir = (fileName) => {
	//1569123123-12.jpg
	var d = new Date(Number(fileName.split("-")[0])); // october 2019-10-02 GMT 엇저구
	var year = String(d.getFullYear()).substr(2);
	var month = d.getMonth() + 1; // 어차피 String인 year를 더할 것이므로 (숫자+문자=문자) String()을 하지 않았다.
	if(month < 10) month = "0" + month; // 1~12 만들기, 만약 9가 10보다 작으면 0을 붙이고 month에 1을 더한다. 
	return year + month; 
}



// 업로드 가능한 확장자
const imgExt = ["jpg", "jpeg", "png", "gif"];
const fileExt = ["hwp", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "pdf"];
const chkExt = (req, file, cb) => {
	var ext = splitName(file.originalname).ext.toLowerCase();
	if(imgExt.indexOf(ext) > -1 || fileExt.indexOf(ext) > -1) {
		req.fileValidateError = true; 
		cb(null, true);
	} 
	else {
		req.fileValidateError = false; // 쌤이 만든 변수, 아무말이나 넣어도 됨
		cb(null, false);
	}
}
// indexOf() : 배열(imgExt) 안에 찾는 문자열이 없으면 -1을 반환한다.
// false면 업로드할 수 없다. true 면 업로드


// 저장될 폴더를 생성
// 1. 생성할 폴더가 존재하면 폴더절대경로 문자열을 리턴
// 2. 생성할 폴더가 존재하지 않으면 폴더를 생성한 후 폴더의 절대경로 리턴
const getPath = () => {
	// console.log(dir);
	var newPath = path.join(__dirname, "../public/uploads/" + makePath());
	if(!fs.existsSync(newPath)) { //path안에 폴더가 존재하지 않으면 폴더를 생성한다(file system이 하는 일)).
		fs.mkdir(newPath, (err) => { 
			//mkdir : make directory (폴더생성)
			if(err) new Error("폴더를 생성할 수 없습니다.");
		});
	}
	console.log(newPath);
	return newPath;
}

// 자바스크립트 Data객체에서 현재의 년도와 월을 (예: 1909) 문자열로 리턴한다.
const makePath = () => {
	const d = new Date(); // 2019-09-30 16:29:22 +GMT()
	var year = String(d.getFullYear()).substr(2);
	var month = d.getMonth() + 1; // 어차피 String인 year를 더할 것이므로 (숫자+문자=문자) String()을 하지 않았다.
	if(month < 10) month = "0" + month; // 1~12 만들기, 만약 9가 10보다 작으면 0을 붙이고 month에 1을 더한다. 
	return year + month; 
}
//getMonth() 0~11


// multer를 이용해 파일을 서버에 저장할 때 경로 및 파일명을 처리하는 모듈
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
		// __dirname: modules 의 절대경로(d:/minkyung/17.node-hello/modules)
		// 위의 절대경로에 상대경로를 붙인다.
    cb(null, getPath()); // /public/uploads/1909
  },
  filename: (req, file, cb) => {
		var newFile = splitName(file.originalname);
    cb(null, newFile.saveName);
  }
});

// storage 객체를 이용해 multer를 초기화(생성)
const upload = multer({ storage: storage, fileFilter: chkExt });

module.exports = {
	splitName,
	upload, // storage는 upload가 이미 써먹어서 안보내도 된다고 함.
	multer,
	chkExt,
	imgExt,
	fileExt,
	getDir
}