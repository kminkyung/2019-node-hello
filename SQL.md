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

## 데이터 삭제

## 데이터 수정

## 데이터 가져오기