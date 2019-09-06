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

ajax("/gbook_ajax/1", "get", {grpCnt: 5}, function (data) {
	var totCnt = data[0].totCnt;
	var rs = data[1]
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
});
//POST 방식으로 받으면 params 로 받는다는 게 무슨 뜻이야???????
// query 가 왜 {} 객체야???


