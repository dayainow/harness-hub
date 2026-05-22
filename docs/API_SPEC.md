# 🗄️ 백엔드 연동 및 API 명세 요약(API Spec Architecture)

Ola 플랫폼의 데이터 송수신과 트래픽 병목을 컨트롤하는 NestJS 백엔드(`back/src`)의 핵심 REST API 명세 및 구조적 설계 특징을 정리한 문서입니다. 프론트엔드의 다이내믹 탐색 기능을 지원하기 위해, 백엔드 라우터는 매우 플렉시블(Flexible)하게 설계되어 있습니다.

---

## 1. 백엔드 주요 아키텍처 디자인 룰

- **Throttle/Rate Limit 제어**: 모든 공개 엔드포인트(`@Get`) 영역에 악의적인 스크래핑(Scraping)이나 API 남용을 막기 위한 Rate Limit 가드(`@nestjs/throttler`)를 부착하여 인프라 비용을 통제했습니다.
- **DTO Validation 매핑**: 프론트에서 들어오는 페이로드 객체를 Type-safe하게 받기 위해 `class-validator`를 이용한 Data Transfer Object 통로 설계를 채택했습니다.
- **Select Projection을 통한 페이로드 최소화**: 리스트 화면 등에서 `findMany`를 조회할 때는 모델의 전체 데이터 중 아주 일부(`id`, `name`, `rating`, `tags` 등)만을 필요로 합니다. 이때 `select: {}` 옵션으로 쿼리에 개입하여 필요없는 통짜 데이터(예: `description`)가 내려가는 것을 차단시켰습니다. (Zero-waste Data Payload)

---

## 2. 코어 API 엔드포인트 (AI 도구 부문)

### `GET /products` - [도구 리스트 전역 메인 탐색기]
- **기능**: 조건에 맞는 AI 도구 레퍼런스 목록을 다중 배열 속성으로 스캔하여 반환합니다.
- **Request Parameters (Query)**
  - `category` (string, optional) - 콤마(,)로 연결된 분류 배열 (예: `"개발,생산성,디자인"`)
  - `pricing` (string, optional) - 콤마(,)로 연결된 요금제 분류 배열 (예: `"Freemium,Paid"`)
  - `tags` (string, optional) - 특정 혜택 태그 배열 매핑 (예: `"Mac,오픈소스"`)
  - `sort` (enum, optional) - `rating` (별점순), `popular` (Featured 탑재순), 미기재 시 '최신순' 적용.
- **개발 포인트 (Optimization)**: Prisma 쿼리 매퍼(`where`)에 진입하기 앞서, `split(',').map(s=>s.trim())` 유틸을 먹여 복합 다중 String 쿼리를 `{ in: [] }` 배열 연산형 DB 속성으로 안전하게 변환시켜 전송합니다.

### `GET /products/featured` - [홈 화면 핫트랙 도구용]
- **기능**: 어드민이 수동으로 세팅한 이주의 강력 추천 픽(Pick) `isFeatured: true` 데이터 상위 n개를 빠르게 캐싱해서 전달합니다. (프론트/백 사이의 메인 캐싱 트래픽 분산용)

### `GET /products/:id` - [도구 상세 페이지]
- **기능**: 개별 툴의 상세 정보와 엮여 있는 연관 데이터(예: 이 툴을 가지고 실험해본 `Market` 레시피 모음)를 Join하여 한 번의 Request로 통합 반환합니다.

### `POST /products` - [(관리자 전용) 신규 도구 DB 인서트]
- **기능**: Discord Webhook 연동을 통해 새로운 도구가 추가되었다는 비즈니스 알림이 사내 슬랙/디스코드 망에 함께 뿌려지도록 백그라운드 이벤트 로직이 삽입되어 있습니다.

---

## 3. 상호작용 체계 (커뮤니티/실험실 부문)

### `POST /likes` & `DELETE /likes` - [(마이크로 인터랙션) 업보트 로직]
- **기능**: `targetType(PRODUCT, PROMPT, POST, LAB)`과 `targetId`를 결합한 폴리모픽(Polymorphic) 토글형 API입니다.
- **안전장치**: Supabase Auth를 통한 유저 세션 가드를 필수로 장착했으며, 버튼 연타(따닥) 공격 방지를 위해 복합 유니크 키(`Unique[userId, targetType, targetId]`) 충돌 익셉션을 리턴하게 하여 DB 동시성 제어 락(Lock) 효율을 올렸습니다.
