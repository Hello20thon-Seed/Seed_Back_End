# Seed-backend

## 시작하기

### Command Line 이용하기
#### Build & Run
`npm run start`

#### Development Mode
`npm run dev`

### 구름 IDE 이용하기
#### Build & Run
`프로젝트 -> 공통, 빌드 또는 실행` 메뉴

#### Build
`프로젝트 -> 빌드` 메뉴

#### Run
`프로젝트 -> 실행` 메뉴

## Payload
### User
- 유저 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| email | 유저 이메일 |
| nickname | 유저 별명 |
| profile | 유저 프로필 사진 링크 |
| goal | 유저가 포크한 대주제 목표들 (Array<Fork>) |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

### Goal
- 원본 목표 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| contents | 목표 내용 |
| level | 목표 종류(대주제, 중주제, 소주제) |
| parent | 부모 목표 ID (없다면 null) |
| members | 공유하는 사람들 (Array<User>) |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

### Fork
- 복제 목표 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| originId | 원본 목표 id |
| contents | 목표 내용 |
| level | 목표 종류(대주제, 중주제, 소주제) |
| parent | 부모 목표 ID (없다면 null) |
| isDone | 완료 여부 |
| owner | 만든 사람 정보 (User) |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

## REST API
- JSON으로 응답합니다.

### Auth
#### `GET` /auth/naver
- 네이버 OAuth 로그인
- 심사 안받아서 백엔드 개발자말고 로그인 안됨

#### `GET` /auth/naver/callback
- 네이버 OAuth 콜백.
- 심사 안받아서 백엔드 개발자말고 로그인 안됨

#### `GET` /auth/google
- 구글 OAuth 로그인

#### `GET` /auth/google/callback
- 이하 동일

#### `GET` /auth/logout
- 로그아웃

#### `GET` /auth/profile
- 로그인 한 사람의 정보를 가져옵니다.

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 유저 데이터 |


### Goal (목표)

#### `POST` /goal/create
- 새로운 목표를 만듭니다.

#### Body
| key | value |
|-----|-----|
| contents | 제목, 소제목 같은 목표 이름(String) |
| level | 대주제, 중주제, 소주제를 식별용도입니다. (맨 아래 참고) |
| parent | 부모 노드의 목표 id (대주제는 필요로 하지 않습니다.) |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| id | 만들어진 목표 고유 id(String) |

#### `PUT` /goal/:id
- 기존 목표를 수정합니다.

#### Params
| key | value |
|-----|-----|
| id | 수정할 목표의 id |

#### Body
| key | value |
|-----|-----|
| contents | 제목, 소제목 같은 목표 이름(String) |
| level | 목표 타입(0, 1, 2, 3, 4) |
| parent | 부모 노드 id (수정이 필요없으면 전송하지 않습니다.) |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /goal/all/:id
- id를 가진 원본 목표부터 자식 목표까지 모두 제거합니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /goal/:id
- id 원본 목표를 삭제합니다.
- 자식 목표를 가지고 있다면 오류를 반환합니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `GET` /goal/all
- 저장되어있는 모든 원본 목표를 가져옵니다.

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 목표 데이터(Array) |

#### `GET` /goal/:id
- id를 가진 원본 목표 데이터를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 목표 데이터 |

#### `GET` /goal/children/:id
- 자식 원본 목표를 모두 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 부모 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 자식 원본 목표 데이터(Array) |

#### `GET` /goal/parent/:id
- 부모 원본 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 자식 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 부모 목표 데이터 |

### Fork Goal
- 원본 목표를 복제 하기 위한 API

#### `POST` /fork/create
- 목표를 복제합니다.
- 복제 시 달성 여부는 `false`로 설정됩니다.

#### Body
| key | value |
|-----|-----|
| id | 원본 목표 id |
| owner | 복제할 대상 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| id | 복제 목표의 id |

#### `GET` /fork/all/:owner
- 해당 유저의 모든 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| owner | 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터(Array) |

#### `GET` /fork/:id
- 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 복제 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터 |

#### `GET` /fork/filter/:id/:email
- 조건에 맞는 원본 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 복제 목표 id |
| email | 복제 목표 주인 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터 |

#### `DELETE` /fork/:id
- 복제 목표를 삭제합니다.

#### Params
| key | value |
|-----|-----|
| id | 복제 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `GET` /fork/user/:id
- 원본 목표를 복제한 모든 유저 정보를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 유저 데이터(Array) |

#### `GET` /fork/children/:id
- 자식 복제 목표를 모두 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 부모 복제 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 자식 복제 목표 데이터(Array) |

#### `GET` /fork/parent/:id
- 부모 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 자식 복제 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 부모 복제 데이터 |

#### `GET` /member/:id
- 초대된 유저 목록을 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 유저 데이터(Array) |

#### `PUT` /member/:id
- 유저를 초대 합니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id  |

#### Body
| key | value |
|-----|-----|
| email | 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /member/:id
- 유저를 초대 삭제(?) 취소(?) 합니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 목표 id  |

#### Body
| key | value |
|-----|-----|
| email | 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

### Done
- 복제 목표를 달성하는 API

#### `PUT` /done/:forkId/:originId
- 복제 목표를 달성합니다.
- 자식 노드가 달성되있지 않으면 오류를 반환합니다.

#### Params
| key | value |
|-----|-----|
| forkId | 복제 목표 id |
| originId | 원본 목표 id (자식 목표 달성 검사하기 위해 필요) |

#### Body
| key | value |
|-----|-----|
| email | 유저 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /done/:forkId/:targetId
- 복제 목표를 달성 해제합니다.

#### Params
| key | value |
|-----|-----|
| forkId | 복제 목표 id  |

#### Body
| key | value |
|-----|-----|
| email | 유저 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `GET` /done/user/:email
- 달성 한 모든 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| email | 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터 (Array) |

#### `GET` /done/:forkId/:originId/:email
- originId 원본 목표부터 자식까지 달성한 정보를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| forkId | 복제 목표 id  |
| originId | 원본 목표 id  |
| email | 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 달성 데이터 (백분율 아님) |

## Error Code
#### 0
- 성공

#### 101
- API의 사용 방법이 잘못되었습니다.
- Params, Body의 정보가 충분하지 않을 때 반환됩니다.

#### 102
- 사용 권한이 없습니다.
- 로그인 하지 않고 목표 API를 호출 했을 때 반환됩니다.

#### 202
- 존재하지 않은 목표입니다.

#### 203
- 목표 타입이 잘못되었습니다.
- 목표 타입은 0, 1, 2, 3, 4만 올 수 있습니다.

#### 204
- 자식 노드를 가지고 있습니다.
- 자식 노드를 먼저 삭제해야 삭제할 수 있습니다.

#### 205
- 포크를 시도한 원본 목표가 대주제가 아닙니다.
- 대주제를 포크하면 자식까지 자동으로 포크됩니다.

#### 301
- 사용자가 존재하지 않습니다.

#### 402
- 해당 유저가 이미 초대되어있습니다.

#### 501
- 해당 유저는 이미 목표를 달성했습니다.

#### 502
- 자식 노드가 달성 되어있지 않습니다.
- 자식 노드가 모두 달성되어야합니다.

### 503
- 자식 노드가 달성 해제 되어 있지 않습니다.

## MongoDB
- Host
	- skylightqp.kr
- Port
	- 9906
- Database
	- hello20thon
- User
	- hello20thondb
- Password
 	- Hello20thondb5570!