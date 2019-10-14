
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




// 상세내용보기 - modal POPUP
$("#gbook-tb td").not(":last-child").click(function(){
	var id = $(this).parent().children("td").eq(0).text(); //this는 클릭당한 td, td의 부모는 tr, 그 자식 중 0번째 td, 의 text를 id에 넣음.
	$.ajax({
		type: "get",
		url: "/api/modalData",
		data: {id: id},
		dataType: "json",
		success: function(res) {
			writeAjax(res, "#gbook-modal");
		}
	});
});

// 상세보기, 화면
function writeAjax(res, modal) {
		//초기화
		$(modal).find(".img-tr").addClass("d-none"); 
		$(modal).find(".img-tr").find("td").eq(0).attr("rowspan", ""); 
		$(modal).find(".img-tr").find("img").eq(0).attr("src", ""); 
		$(modal).find(".img-tr").attr("rowspan", "");
		$(modal).find(".file-tr").addClass("d-none");
		$(modal).find(".file-tr").find("td").eq(0).attr("rowspan", "");
		$(modal).find(".file-tr").find("a").attr("href", "#");
		$(modal).find(".file-tr").find("a").text("");
		$(modal).find(".up-td").addClass("d-none");

		//첨부파일 경로 설정
		if(res.savefile != null && res.savefile != "") {
			var file = splitName(res.savefile); // splitName()을 바로 쓸 수 있는 이유가 pug로 gbook.js/util.js로 연결해놓았기 때문.
			var ext = file.ext.toLowerCase();
			var ts = Number(file.name.split("-")[0]); // timestamp값만 가지고 오고 random 을 떨구려고. 인덱스를 바로 써서 두 줄로 안쓰고 한 줄로 쓸 수 있구나
			var dir = findPath(new Date(ts));
			var path = "/uploads/"+dir+"/"+res.savefile;
			var downPath = "/download?fileName="+res.savefile+"&downName="+res.orifile;

			if(fileExt.indexOf(ext) > -1) { //왜 img가 아니라 file을 먼저 찾는가 : 보안상의 이유, img를 먼저 찾으면 if문을 통과, a링크가 걸리게됨
				//첨부파일
				$(modal).find(".file-tr").removeClass("d-none");
				$(modal).find(".file-tr").find("td").eq(0).attr("rowspan", "2");
				$(modal).find(".file-tr").find("a").attr("href", downPath);
				$(modal).find(".file-tr").find("a").text(res.orifile);
			}
			else if (imgExt.indexOf(ext) > -1) {
				//첨부이미지
				$(modal).find(".img-tr").removeClass("d-none"); 
				$(modal).find(".img-tr").find("td").eq(0).attr("rowspan", "2");
				$(modal).find(".img-tr").find("img").attr("src", path); 
			}
		}
		else {
			//첨부파일 없음
			$(modal).find(".up-td").removeClass("d-none");
			$(modal).find("input[name='upfile']").val(""); 
		}
		if(modal == "#gbook-modal") {
			$(modal).find("tr").eq(0).children("td").eq(1).html(res.writer);
			$(modal).find("tr").eq(1).children("td").eq(1).html(dspDate(new Date(res.wtime)));
			$(modal).find("tr").eq(2).children("td").find("div").html(res.comment);
			$(modal).modal("show");
		}
		else {
			$(modal).find("input[name='writer']").val(res.writer);
			$(modal).find("textarea[name='comment']").val(res.comment);
			$(modal).modal("show");
		}
}

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
			writeAjax(res, "#update-modal");
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

// POPUP
function popOpen() {
	setTimeout(function() {
		$(".popup-bg").css("display", "flex");
		setTimeout(function(){
			$(".popup-wrap").css({"opacity": 1, "transform": "translateY(0)", "transition": "all 0.5s"});
		}, 100);
	}, 500);
}
// $.removeCookie("popChk");
if($.cookie("popChk") !== "true") popOpen();
// console.log($.cookie("popChk"));

$(".popup-close, .popup-close2").click(function(){
	// attribute - 마음대로 값을 바꿀 수 있는 속성
	// property - 정해져있는 속성
	// <input type="text" checked>
	var chk = $("#popOut").prop("checked");
	// $.cookie("변수명", "변수값, {expires(쿠기가 만료되는 시점): 1(하루))})
	$.cookie("popChk", chk, {expires: 1});
	$(".popup-bg").css("display", "none");
	$(".popup-wrap").css({"opacity": 0, "transform": "translateY(-100%)"});
});



// $(f).find("input[name='writer']").val().trim() //jQuery 접근
// f.writer.value.trim() //jQuery 접근

// $("#bt-close").click(function(){
// 	$("#gbook-modal").modal('hide');
// });
