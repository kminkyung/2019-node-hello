# SQL 을 배워보자.

## 데이터 추가 
### 구문1
```sql
INSERT INTO 테이블명 SET column명='값', column명='값';
# 예제
INSERT INTO gbook SET comment='안녕하세요.', wtime='2019-09-02 13:26:00'
```
### 구문2
```sql
INSERT INTO 테이블명 (column명, column명) VALUES (값, 값);
# 예제
INSERT INTO gbook (comment, wtime) VALUES ('안녕하세요.', '2019-09-02 13:26:00');
```

## 데이터 가져오기
### 구문1
```sql
-- 가져오기
SELECT colum명, column명 ... FROM gbook
SELECT * FROM gbook

-- 데이터를 정렬해서 가져오기
-- 오름차순
SELECT * FROM gbook ORDER BY id ASC
-- 내림차순
SELECT * FROM gbook ORDER BY id DESC

-- 원하는 데이터만 가져오기
SELECT * FROM gbook WHERE id=5
SELECT * FROM gbook WHERE wtime > '2019-09-01 00:00:00' ORDER BY wtime DESC
SELECT * FROM gbook WHERE comment = '하이' ORDER BY id DESC
SELECT * FROM gbook WHERE comment LIKE '%하이%' -- '하이'가 포함된 문장, 하이 앞뒤로 무언가를 붙여도 가져옴

-- 원하는 갯수만 가져오기
SELECT * FROM gbook WHERE comment LIKE '%?%' ORDER BY id DESC LIMIT 0, 5
SELECT * FROM gbook WHERE comment LIKE '%?%' ORDER BY id DESC LIMIT 10, 5


-- 레코드의 갯수를 가져오기
SELECT count(id) FROM gbook
```


## 데이터 삭제

## 데이터 수정
