// const mysql = require("mysql"); // npm i -S mysql 로 설치한 모듈 불러오기
const mysql = require("mysql2/promise"); // npm i -S mysql2 로 설치한 모듈 불러오기
const sqlPool = mysql.createPool({
	host: "db.minkyung2.gabia.io",
	user: "minkyung2",
	password: "mkm4167!!!",
	port: 3306,
	database: "dbminkyung2",
	waitForConnections: true,
	queueLimit: 0,
	connectionLimit: 10 //동시접속자 수, 높으면 높을 수록 서버 메모리가 많이 필요하다.
});

const sqlErr = err => {
	console.log(err);
}

const sqlExec = async (sql, vals) => {
	const connect = await sqlPool.getConnection(async conn => conn);
	const data = await connect.query(sql, vals); //결과를 주기전에 55라인에서 홀딩
	connect.release()
	return data;
}


module.exports = {
 mysql,
 sqlPool,
 sqlErr,
 sqlExec
};

