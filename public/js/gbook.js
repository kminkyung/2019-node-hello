

function onSend(f) {
 console.log(f);
 if(f.comment.value.trim() == "") {
	 alert("제대로 써봐");
	 f.comment.focus();
	 return false;
 }
 return true;
}