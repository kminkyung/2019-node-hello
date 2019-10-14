// '2019년 8월 11일 11시 11분 11초' 형식으로 보내주는 함수

function dspDate(d, type) { //type=0 처럼 기본값을 주는 형태는 ES5에서는 불가능
	var type = typeof type !== 'undefined' ? type : "0";
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
	type 0 : 2019년 8월 11일 11시 11분 11초 
	type 1 : 2019년 8월 11일 11시 11분
	type 2 : 2019년 8월 11일 11시
	type 3 : 2019년 8월 11일
	type 4 : 8월 11일
	type 5 : 11시 11분 12초
	*/
	switch(type) {
		case 1:
			returnStr = year + month + day + hour + min;
			break;
		case 2:
				returnStr = year + month + day + hour;
			break;
		case 3:
				returnStr = year + month + day;
			break;
		case 4:
				returnStr = month + day;
			break;
		case 5:
				returnStr = hour + min + sec;
			break;
		default: 
				returnStr = year + month + day + hour + min + sec;
			break;
	}
	return returnStr;
} 



function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      } 
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

includeHTML();




//function ajax() 로 들어오는 url에 따라서 query든지 params든지 전부 처리할 수 있게함. => 모듈
//사용자 정의 ajax 함수
function ajax(url, type, vals, cb) {
/* 	if(typeof vals == Object) data = vals; // req.query
	else url = url+"/"+vals; // req.params */
	//여기서 vals 는 query
	$.ajax({
		type: type,
		url: url,
		data: vals,
		dataType: "json",
		error: function(xhr, status, error) {
			console.log(xhr, status, error);
		},
		success: cb
	});
}



// 페이저 생성
function pagerMaker($pager, grpCnt, divCnt, total, page, cb) {
	var div = divCnt; //세트 당 나올 페이지 수 
	var cnt = Math.ceil(total / grpCnt); //전체 페이지 개수
	var stn = 0; //세트 중 시작 페이지
	var edn = 0; //세트 중 마지막 페이지
	var prev = 0; // < 를 클릭시 나타날 페이지
	var next = 0; // > 를 클릭시 나타날 페이지
	var prevShow = false; // true 면 << 활성화 false 면 비활성화 
	var lastShow = false; // true 면 >> 활성화 false 면 비활성화
	var first = 1; // << 첫번째 페이지
	var last = cnt; // >> 마지막 페이지
	var lastIndex = (Math.ceil(cnt / div) - 1); // 마지막 페이지 세트의 index
	var nowIndex = (Math.ceil(page / div) - 1); //현재 페이지 세트 index : 0, 1, 2.. (div가 3일 경우)

	stn = nowIndex * div + 1; // 세트 시작페이지 값 1, 4, 7, 10...(div가 3일 경우)
	if (cnt < stn + div - 1) edn = cnt; // 마지막 세트의 마지막 페이지 값. 
	else edn = stn + div - 1; // 세트의 끝페이지 값 

	//화살표 
	if (nowIndex > 0) {
		prevShow = true;
		prev = stn - 1;
	}
	if (lastIndex > nowIndex) {
		lastShow = true;
		next = edn + 1;
	}
/* 
	console.log("stn:" + stn);
	console.log("edn:" + edn);
	console.log("lastIndex:" + lastIndex);
	console.log("nowIndex:" + nowIndex);
	console.log("next:" + next);
 */
	html = '<li class="page-item page-first ' + (prevShow ? "" : "disabled") + '" data-page="' + first + '">';
	html += '<span class="page-link">';
	html += '<i class="fas fa-angle-double-left"></i>';
	html += '</span>';
	html += '</li>';
	html += '<li class="page-item page-prev ' + (prevShow ? "" : "disabled") + '" data-page="' + prev + '">';

	html += '<span class="page-link">';
	html += '<i class="fas fa-angle-left"></i>';
	html += '</span>';
	html += '</li>';
	for (var i = stn; i <= edn; i++) {
		html += '<li class="page-item page-ct ' + (page == i ? "active" : "") + '" data-page="' + i + '">';
		html += '<span class="page-link">' + i + '</span>';
		html += '</li>';
	}
	html += '<li class="page-item page-next ' + (lastShow ? "" : "disabled") + '" data-page="' + next + '">';
	html += '<span class="page-link">';
	html += '<i class="fas fa-angle-right"></i>';
	html += '</span>';
	html += '</li>';
	html += '<li class="page-item page-last ' + (lastShow ? "" : "disabled") + '" data-page="' + last + '">';
	html += '<span class="page-link">';
	html += '<i class="fas fa-angle-double-right"></i>';
	html += '</span>';
	html += '</li>';
	$pager.html(html);
	$(".page-item").css({"cursor":"pointer"});
	$(".page-item").click(cb); // gbook_ajax
}
$(".page-item").click(function(){
	var n = $(this).data("page");
	if(n !== undefined) location.href = $(".pager").data("pager-name")+n;
});


var imgExt = ["jpg", "jpeg", "png", "gif"];
var fileExt = ["hwp", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "pdf"];

function splitName(file) {
	var arr = file.split("."); 
	var obj = {};
	obj.ext = arr[1]; // timestamp+random.ext <- index1 
	obj.name = arr[0]; // timestamp+random <- index0 .ext 
	return obj;
}

function findPath(d) {
	var year = String(d.getFullYear()).substr(2);
	var month = d.getMonth() + 1; // 어차피 String인 year를 더할 것이므로 (숫자+문자=문자) String()을 하지 않았다.
	if(month < 10) month = "0" + month; // 1~12 만들기, 만약 9가 10보다 작으면 0을 붙이고 month에 1을 더한다. 
	return year + month; 
}


function telChk(obj){
	if (String(obj.value).length > 4){
		obj.value = obj.value.slice(0, 4);
	}    
}