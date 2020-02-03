# Seed-backend

## Get Started

### Build & Run
`npm run start`

### Development Mode
`npm run dev`


### with Goorm IDE
`프로젝트 -> 공통 또는 빌드 또는 실행` 메뉴

## Payload
### User
- 유저 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| email | 유저 이메일 |
| nickname | 유저 별명 |
| profile | 유저 프로필 이미지 CDN 링크 |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

### Goal
- 목표 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| contents | 목표 내용 |
| level | 목표 종류(대주제, 중주제, 소주제) |
| parent | 부모 목표 ID (없다면 null) |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

### ForkGoal (테이블 이름: havegoal)
- 복제 목표 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| target | 복제 대상 목표 ID |
| owner | 복제 목표 만든 사람 |
| goal | 원본 목표 (위 Goal 데이터로 들어갑니다.) |
| people | 목표에 초대된 사람 (위 User 데이터가 배열로 들어갑니다.) |
| \_\_v | MongoDB 버전관리용 (무시해도됨) |

### DoneGoal
- 목표 완료 데이터

| key | value |
|-----|-----|
| \_id | 식별용 ID |
| email | 완료한 사람 이메일 |
| forkId | 완료한 복제 목표 ID |
| targetId | 완료한 세부 원본 목표 ID |
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
- **프론트엔드에 로그인 구현되면 로그인 한 사람만 작동하도록 바꿈**

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

#### `GET` /goal/all
- 모든 목표를 가져옵니다.

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 목표 데이터들(Array) |

#### `GET` /goal/:id
- 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 가져올 목표의 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 목표 데이터 |

#### `GET` /goal/children/:id
- id 목표의 자식 목표를 모두 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 가져올 자식 목표의 부모 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 자식 목표들(Array) |

#### `GET` /goal/parent/:id
- id 목표의 부모 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 가져올 부모 목표의 자식 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 부모 목표 |

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
| level | 목표 타입(0, 1, 2) |
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

### HaveGoal (fork)
- 만든 목표를 복제(Clone, 인스턴스화, Fork) 하기 위한 API

#### `POST` /fork/create
- 목표를 복제합니다.
- 복제는 대주제 목표만 가능합니다.

#### Body
| key | value |
|-----|-----|
| id | 복제할 대주제 목표의 고유 id |
| owner | 복제할 대상의 주인 email |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| id | 복제 목표의 id |

#### `GET` /fork/all/:owner
- 해당 email 유저가 가지고 있는 모든 복제 목표를 가지고 옵니다.

#### Params
| key | value |
|-----|-----|
| owner | 복제 목표를 가져올 대상의 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표들(Array) |

#### `GET` /fork/:id
- 해당 id의 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 복제할 대주제 목표의 고유 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터 |

#### `GET` /fork/with/:id/:email
- 해당 id의 복제 목표를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 원본 id |
| email | 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 복제 목표 데이터 |

#### `DELETE` /fork/:id
- 해당 id의 복제 목표를 삭제합니다.

#### Params
| key | value |
|-----|-----|
| id | 복제할 대주제 목표의 고유 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `GET` /fork/user/:id
- 해당 원본 목표를 복제한 모든 유저를 가지고 옵니다.

#### Params
| key | value |
|-----|-----|
| id | 가져올 원본 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 유저 이메일들(Array) |

#### `GET` /fork/people/:id
- 해당 id를 가진 복제 목표에 초대된 사람을 가져옵니다.

#### Params
| key | value |
|-----|-----|
| id | 가져올 복제 목표 id |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 유저 데이터들(Array) |

#### `PUT` /fork/people/:id
- 해당 id를 가진 복제 목표에 사람을 추가합니다.

#### Params
| key | value |
|-----|-----|
| id | 초대할 복제 목표 ID  |

#### Body
| key | value |
|-----|-----|
| email | 초대할 사람의 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /fork/people/:id
- 해당 id를 가진 복제 목표에 사람을 제거합니다.

#### Params
| key | value |
|-----|-----|
| id | 제거할 복제 목표 ID  |

#### Body
| key | value |
|-----|-----|
| email | 제거할 사람의 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

### Done
- 복제 목표 완료에 관한 API
- targetId는 복제된 목표 ID가 아닌 틀 목표 ID입니다.

#### `PUT` /done/:forkId/:targetId
- 해당 유저를 완료(달성) 설정합니다.

#### Params
| key | value |
|-----|-----|
| forkId | 완료 설정 할 복제 목표 id  |
| targetId | 완료 설정 할 세부 목표 ID (대주제, 중주제, 소주제 목표 등)  |

#### Body
| key | value |
|-----|-----|
| email | 완료 설정 할 유저 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `DELETE` /done/:forkId/:targetId
- 해당 유저를 완료(달성) 설정 해제합니다.

#### Params
| key | value |
|-----|-----|
| forkId | 완료 설정 해제 할 복제 목표 id  |
| targetId | 완료 설정 해제 할 세부 목표 ID (대주제, 중주제, 소주제 목표 등)  |

#### Body
| key | value |
|-----|-----|
| email | 완료 설정 해제 할 유저 이메일  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |

#### `GET` /done/user/:email
- 해당 유저가 완료 한 모든 복제 목표 id와 세부 목표 id를 가져옵니다.

#### Params
| key | value |
|-----|-----|
| email | 유저 email  |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| data | 데이터 (Array) |

#### `GET` /done/:forkId/:targetId/:email
- targetId 기준으로 자식까지 달성한 유저 수를 가져옵니다.
- count, node를 이용하여 달성률을 구할 수 있습니다.

#### Params
| key | value |
|-----|-----|
| forkId | 가져올 복제 목표 id  |
| targetId | 가져올 세부 목표 id  |
| email | 가져올 유저 이메일 |

#### Response
| key | value |
|-----|-----|
| success | 성공 여부(Boolean) |
| code | 오류 코드(아래참고, 오류가 없으면 0을 반환합니다.) |
| count | 해당 유저가 달성한 목표 수 |
| node | targetId부터 자식 노드까지의 개수 |

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

#### 301
- 사용자가 존재하지 않습니다.

#### 401
- 해당 사용자가 이미 같은 목표를 복제한 상태입니다.
- 기존 목표를 삭제하고 다시 생성 할 수 있습니다.

#### 402
- 해당 유저가 이미 초대되어있습니다.

#### 501
- 해당 유저는 이미 목표를 달성했습니다.

#### 502
- 자식 노드가 달성 되어있지 않습니다.
- 자식 노드가 모두 달성되어야합니다.

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