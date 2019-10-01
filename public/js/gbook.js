
function onSend(f) {
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
	// if(f.upfile) {
	// 	var file = $(f.upfile).val();
	// 	var arr = file.split(".");
	// 	var ext = arr.pop();
	// 	var img = ["jpg", "jpeg", "png", "gif"];
	// 	var file = ["hwp", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "pdf"];
	// 	if(img.indexOf(ext) > -1 || file.indexOf(ext) > -1) return true;
	// 	else {
	// 		alert("허용되지 않는 파일입니다.");
	// 		return false;
	// 	}
	// }
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
			// 초기화
			$("#gbook-modal").find(".img-tr").addClass("d-none"); 
			$("#gbook-modal").find(".img-tr").find("img").attr("src", ""); 
			$("#gbook-modal").find(".file-tr").addClass("d-none");
			$("#gbook-modal").find(".file-tr").find("a").attr("href", "#");
			$("#gbook-modal").find(".file-tr").find("a").text("");

			if(res.savefile != null && res.savefile != "") {
				var file = splitName(res.savefile); // splitName()을 바로 쓸 수 있는 이유가 pug로 gbook.js/util.js로 연결해놓았기 때문.
				var ext = file.ext.toLowerCase();
				var ts = Number(file.name.split("-")[0]); // timestamp값만 가지고 오고 random 을 떨구려고. 인덱스를 바로 써서 두 줄로 안쓰고 한 줄로 쓸 수 있구나
				var dir = findPath(new Date(ts)); //
				var path = "/uploads/"+dir+"/"+res.savefile;

				if(fileExt.indexOf(ext) > -1) { //왜 img가 아니라 file을 먼저 찾는가 : 보안상의 이유, img를 먼저 찾으면 if문을 통과, a링크가 걸리게됨
					//첨부파일
					$("#gbook-modal").find(".file-tr").removeClass("d-none");
					$("#gbook-modal").find(".file-tr").find("a").attr("href", path);
					$("#gbook-modal").find(".file-tr").find("a").text(res.orifile);
				}
				else {
					//첨부이미지
					$("#gbook-modal").find(".img-tr").removeClass("d-none"); 
					$("#gbook-modal").find(".img-tr").find("img").attr("src", path); 
				}
			}
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
	$("#remove-modal").modal("show");
});
	$("#remove-modal").on("shown.bs.modal", function(){
		$("#remove-modal").find("input[name='pw']").focus();
	});// 이 이벤트는 밖에 나와있어야 함. (안그러면 이벤트가 중첩?되나?)


// 수정기능
$(".btChg").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text(); //button이 해당하는 id 가져오기
	$("#update-modal").find("input[name='id']").val(id);
	upAjax(id);
});

//다시작성 (근데 여기 비밀번호도 다시 reset해주어야 하는거 같음..)
function onReset() {
	var id = $("form[name='upForm']").find("input[name='id']").val(); //button이 해당하는 id 가져오기
	var pw = $("form[name='upForm']").find("input[name='pw']").val(''); //button이 해당하는 id 가져오기
	// $("#update-modal").find("input[name='id']").val(id);
	upAjax(id, pw);
}

// 공통사항 AJAX 함수화
function upAjax(id) {
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
}

// 삭제 컨펌
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



// $(f).find("input[name='writer']").val().trim() //jQuery 접근
// f.writer.value.trim() //jQuery 접근

// $("#bt-close").click(function(){
// 	$("#gbook-modal").modal('hide');
// });
