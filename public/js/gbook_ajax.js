/*
// JS AJAX 
var page = 1
var url = "/gbook_ajax/" + page;
var xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.send(data);

xhr.addEventListener('load', function() {
	console.log(xhr.responseText); //내가 실제로 받은 data
}); */
function getPage(page) {
	var grpCnt = 5;
	var divCnt = 3;
	ajax("/gbook_ajax/"+page, "get", {grpCnt: grpCnt}, function (data) { //ES5 는 grpCnt: grpCnt 생략불가
		console.log(data);
		var totCnt = data.totCnt;
		var rs = data.rs
		var html = '';
		$(".gbook-tb > tbody").empty();
		for(var i in rs) {
			html = '<tr>';
			html += '<td>'+rs[i].id+'</td>';
			html += '<td>'+rs[i].writer+'</td>';
			html += '<td>'+dspDate(new Date(rs[i].wtime))+'</td>';
			html += '<td>'+rs[i].comment+'</td>';
			html += '<td>';
			html += '<button class="btn btn-primary btn-sm mr-1">수정</button>';
			html += '<button class="btn btn-danger btn-sm">삭제</button>';
			html += '</td>';
			html += '</td>';
			$(".gbook-tb > tbody").append(html);
		}
		//pagerMaker($pager, grpCnt, totCnt, nowPage)
		pagerMaker($(".pager"), grpCnt, divCnt, totCnt, page, function () {
			if (!$(this).hasClass("disabled")) getPage($(this).data("page")); //getPage 함수실행
		});
	});
}
getPage(1);


