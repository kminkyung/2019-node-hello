const mysql = require("mysql"); // npm i -S mysql 로 설치한 모듈 불러오기
const conn = mysql.createPool({
	host: "127.0.0.1",
	user: "minkyung",
	password: "000000",
	port: 3306,
	database: "minkyung",
	connectionLimit: 10 //동시접속자 수, 높으면 높을 수록 서버 메모리가 많이 필요하다.
});

module.exports = {
 mysql,
 conn
};