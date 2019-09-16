

function onSend(f) {
 console.log(f);
 if(f.writer.value.trim() == "") {
	 alert("작성자를 입력하세요.");
	 f.writer.focus();
	 return false;
 }
 if(f.pw.value.trim() == "" || f.pw.value.trim().length > 16 || f.pw.value.trim().length < 8) { // ||< or
	 alert("비밀번호는 8~16 자로 입력하세요.");
	 f.pw.focus();
	 return false;
 }
 if(f.comment.value.trim() == "") {
	 alert("내용을 입력하세요.");
	 f.comment.focus();
	 return false;
 }
 return true;
}

$(".page-item").click(function(){
	var n = $(this).data("page");
	if(n !== undefined) location.href = "/gbook/li/"+n;
});


// 상세내용보기 - modal POPUP
$("#gbook-tb td").not(":last-child").click(function(){
	var id = $(this).parent().children("td").eq(0).text(); //this는 클릭당한 td, td의 부모는 tr, 그 자식 중 0번째 td, 의 text를 id에 넣음.
	$.ajax({
		type: "get",
		url: "/api/modalData",
		data: {id: id},
		dataType: "json",
		success: function (res) {
			$("#gbook-modal tr").eq(0).children("td").eq(1).html(res.writer);
			$("#gbook-modal tr").eq(1).children("td").eq(1).html(dspDate(new Date(res.wtime)));
			$("#gbook-modal tr").eq(2).children("td").find("div").html(res.comment);
			$("#gbook-modal").modal("show");
		}
	});
});


// 삭제
$(".btRev").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text();
	// $("form[name='removeForm']").find("input[name='id']")
	$("#remove-modal").find("input[name='id']").val(id);
	$("#remove-modal").find("input[name='pw']").val('');
	$("#remove-modal").find("input[name='pw']").focus();
	$("#remove-modal").modal("show");
});

// $("#bt-close").click(function(){
// 	$("#gbook-modal").modal('hide');
// });
