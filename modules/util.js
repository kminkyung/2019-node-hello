module.exports.zp = (n) => {
	n<10 ? n = "0" + n : n = n; // 1월부터 9월까지 01~09로 만들고 10부터 0이 붙지않도록 함.
	return n;
}

module.exports.dspDate = (d, type) => {
	var type = typeof type !== 'undefined' ? type : 0;
	var monthArr = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
	//for (var i=1; i = monthArr; i++) { i+"월"}
	var year = d.getFullYear() + "년 "; // 2019
	var month = monthArr[d.getMonth()] + " "; // 7 (0~11)배열
	var day = d.getDate() + "일 "; // 1 ~ 31
	var hour = d.getHours() + "시 "; // 0 ~ 23
	var min = d.getMinutes() + "분 " // 0 ~ 59
	var sec = d.getSeconds() + "초 " // 0 ~ 59
	var returnStr;
	/* 
	type 0 : 2019-08-11 09:08:12 (ISO date 표기법)
	type 1 : 2019년 8월 11일 11시 11분 11초 
	type 2 : 2019년 8월 11일 11시 11분
	type 3 : 2019년 8월 11일 11시
	type 4 : 2019년 8월 11일
	type 5 : 8월 11일
	type 6 : 11시 11분 12초
	*/
	switch(type) {
		case 1: 
		returnStr = year + month + day + hour + min + sec;
			break;
		case 2:
			returnStr = year + month + day + hour + min;
			break;
		case 3:
				returnStr = year + month + day + hour;
			break;
		case 4:
				returnStr = year + month + day;
			break;
		case 5:
				returnStr = month + day;
			break;
		case 6:
				returnStr = hour + min + sec;
			break;
		default:
				returnStr = d.getFullYear() + '-' + module.exports.zp(d.getMonth() + 1) + '-' + module.exports.zp(d.getDate()) + " " + module.exports.zp(d.getHours()) + ":" + module.exports.zp(d.getMinutes()) + ":" + module.exports.zp(d.getSeconds());
			break;
	}
	return returnStr;
} 

module.exports.alertLocation = (obj) => {
	var html = '<mate charset="utf-8">';
	html += '<script>';
	html += 'alert("'+obj.msg+'");';
	html += 'location.href = "'+obj.loc+'";';
	html += '</script>';
	return html;
};

module.exports.nullchk = (val) => {
	if(val !== undefined && val !== null && val !== "") return true;
	else return false;
};

module.exports.iconChk = (dt, file) => { //만약에 file이 없으면 null이라는 초기값을 준다 (ES6)
	// file?file: null 삼항방정식
	const obj = {};
	if(module.exports.nullchk(file)) obj[file.split(".").pop()] = true;
	var tsFile = new Date(dt).getTime();
	var tsNow = new Date().getTime() - (24 * 60 * 60 * 1000); // 현재시간-24시 24시간 전 시간 구하기 
	if(tsFile >= tsNow) obj.new = true;
	return obj;
}

module.exports.telNum = ["010", "011", "016", "017", "018", "019", "02", "051", "052", "053", "055", "031", "032", "033", "061", "062", "063", "064", "041","042", "044", "043" ]


module.exports.adminChk = (obj) => { // req.session.user 를 obj로 전달할 것
	if(module.exports.nullchk(obj)) {
		if(obj.grade == 9) return true;
		else return false;
	}
	else return false;
}

module.exports.alertAdmin = () => {
	var html = '<mate charset="utf-8">';
	html += '<script>';
	html += 'alert("정상적인 접근이 아닙니다.");';
	html += 'location.href = "/";';
	html += '</script>';
	return html;
}
