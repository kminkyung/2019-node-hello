
const pagerMaker = (obj) => {
	if(obj.grpCnt == undefined) obj.grpCnt = 5;
	if(obj.divCnt == undefined) obj.divCnt = 3;
	if(obj.totCnt == undefined) return false; //필수 value가 없으면 pagerMaker실행이 안되게
	if(obj.page == undefined) return false;
	obj.cnt = Math.ceil(obj.totCnt / obj.grpCnt); //전체 페이지 개수
	obj.stn = 0; //세트 중 시작 페이지
	obj.edn = 0; //세트 중 마지막 페이지
	obj.prev = 0; // < 를 클릭시 나타날 전 세트 페이지
	obj.next = 0; // > 를 클릭시 나타날 페이지
	obj.stRec = (obj.page - 1) * obj.grpCnt;
	obj.prevShow = false; // true 면 << 활성화 false 면 비활성화 
	obj.lastShow = false; // true 면 >> 활성화 false 면 비활성화
	obj.lastIndex = (Math.ceil(obj.cnt / obj.divCnt) - 1); // 마지막 페이지 세트의 index
	obj.nowIndex = (Math.ceil(obj.page / obj.divCnt) - 1); //현재 페이지 세트 index : 0, 1, 2.. (divCnt가 3일 경우)

	obj.stn = obj.nowIndex * obj.divCnt + 1; // 세트 시작페이지 값 1, 4, 7, 10...(divCnt가 3일 경우)
	if (obj.cnt < obj.stn + obj.divCnt - 1) obj.edn = obj.cnt; // 마지막 세트의 마지막 페이지 값. 
	else obj.edn = obj.stn + obj.divCnt - 1; // 세트의 끝페이지 값 

	//화살표 
	if (obj.nowIndex > 0) {
		obj.prevShow = true;
		obj.prev = obj.stn - 1;
	}
	if (obj.lastIndex > obj.nowIndex) {
		obj.lastShow = true;
		obj.next = obj.edn + 1;
	}
	return obj;
}



module.exports = {
	pagerMaker
}


