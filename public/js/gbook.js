

function onSend(f) {
 console.log(f);
 if(f.writer.value.trim() == "") {
	 alert("작성자를 입력하세요.");
	 f.writer.focus();
	 return false;
 }
 if(f.pw.value.trim() == "" || f.pw.value.trim().length > 16 || f.pw.value.trim().length < 6) { // ||< or
	 alert("비밀번호는 6~16 자로 입력하세요.");
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


// 삭제기능
$(".btRev").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text();
	$("form[name='removeForm']").find("input[name='id']")
	$("#remove-modal").find("input[name='id']").val(id);
	$("#remove-modal").find("input[name='pw']").val('');
	$("#remove-modal").find("input[name='pw']").focus();
	$("#remove-modal").modal("show");
	$(".sendRev").click(function(){
	});
});


// 수정기능
$(".btChg").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text(); //button이 해당하는 id 가져오기
	$("#update-modal").find("input[name='id']").val(id);
	$.ajax({
		type: "get",
		url: "/api/modalData",
		data: {id: id},
		dataType: "json",
		success: function (res) {
			$("form[name='upForm']").find("input[name='writer']").val(res.writer);
			$("form[name='upForm']").find("textarea[name='comment']").val(res.comment);
			$("#update-modal").modal("show");
		}
	});
});

function onChg(f) {
	if(f.writer)

	f.pw
	f.commnent
}




function onRev(f) {
	if(f.id.value.trim() === "") {
		alert("삭제할 데이터의 id가 필요합니다.");
		return false;
	}
	if(f.pw.value.trim() == "" || f.pw.value.trim().length > 16 || f.pw.value.trim().length < 8) { // ||< or
		alert("비밀번호는 8~16 자로 입력하세요.");
		f.pw.focus();
		return false;
	}
	return true; //f(form)을 전송
}


// $("#bt-close").click(function(){
// 	$("#gbook-modal").modal('hide');
// });
