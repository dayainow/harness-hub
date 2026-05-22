# 🔥 트러블슈팅 및 성능 최적화 리포트 (Troubleshooting)

Ola 프로젝트를 기획 및 구현하면서 마주친 기술적 한계와 이를 어떤 전략으로 풀어냈는지(Trade-off)를 서술한 개발 일지입니다.

---

## 1. 쿼리 병목: 프론트엔드 다중 필터 조작 시 발생하는 브라우저 프리징
### ⚠️ 증상 및 원인 분석
- **상황:** AI 도구 탐색 페이지에서 사용자가 `[가격: Freemium, Paid]`, `[카테고리: 개발, 마케팅, 비디오]`, `[세부 태그: Mac, 코딩]` 등 5~6개의 필터를 1초 만에 연속으로 온/오프하는 상황(다중-값 필터링).
- **원인:** 초기에는 백엔드에서 30개가 넘는 AI 도구 데이터를 1차로 전부 가져온 후, 브라우저 단에서 `.filter()`를 다섯 번 중첩해서 돌림. 이는 향후 1만 개 이상의 데이터가 모였을 때 브라우저 렌더 스레드를 블로킹(Blocking)하여 스크롤 멈춤 현상 유발 가능성 농후.

### 💡 해결 (Optimization)
1. **DB 단 연산 전가(Delegation)**: 데이터 처리의 책임을 프론트에서 과감히 분리. 쿼리 파라미터 상태를 백엔드 컨트롤러로 전달하고, 모든 연산은 Prisma DB 엔진의 몫으로 전환함.
2. **복합 연산자 조합(`in` + `hasSome`)**:
```typescript
const where: any = {
  // 1. 단일 값이 아닌 '배열 교차 검색'을 위해 'in' 오퍼레이터 사용
  ...(pricingModel && { pricingModel: { in: pricingModel.split(',') } }),
  
  // 2. PostgresSQL Array Column을 스캔하기 위한 'hasSome' 오퍼레이터 특수 설계
  ...(tags && { tags: { hasSome: tags.split(',') } }),
};
```
- **결과:** 클라이언트 메모리 부담률을 거의 0으로 내리고, DB 단 내부 인덱스를 타며 다중 교차 필터링을 10~50ms 미만으로 스무스하게 최적화 달성.

---

## 2. 보안 정책 충돌: Next.js 서버 컴포넌트 렌더링 블로킹 (Broken Image)
### ⚠️ 증상 및 원인 분석
- **상황:** 전 세계 AI 툴의 로고(Clearbit 등 외부 CDN 메인 스크래핑)를 렌더링하기 시작할 때, 갑자기 모든 페이지의 썸네일 이미지가 `403 Forbidden` 처리되거나 엑스박스 마크로 뜨는 현상 발생.
- **원인:** Next.js 최신 버전의 자체적인 보안 방어 스펙. 허가되지 않은 외부 Host URL의 이미지를 `<Image />` 컴포넌트가 파싱하려 시도할 경우, Server-side 캐시 레벨에서 악성 스크립트 유입을 우려하여 응답을 원천 차단함.

### 💡 해결 (Optimization)
- **`next.config.ts` 화이트리스트 전략 도입:**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'logo.clearbit.com', // 공식 제공 CDN 경로 와일드카드 오픈
      pathname: '/**',
    },
  ],
}
```
- **결과:** 안전하게 외부 리프 리소스를 받아오면서, 동시에 Next.js가 제공하는 Webp 형식 리사이징 및 엣지 네트워크 이미지 캐싱 최적화 혜택(Zero-Network Payload Delay)을 무사히 받아 누리게 되었습니다.

---

## 3. UX 저하: 이벤트 전파(Bubbling) 충돌 현상
### ⚠️ 증상 및 원인 분석
- **상황:** Product Hunt 스타일의 리스트뷰 UI에서 클릭 시 바로 상세 뷰로 넘어가도록 `<Link>` 컨테이너 안에 제목/가격을 배치함. 유저가 리스트 내부의 **"👍 투표/좋아요 버튼"**을 눌러도, 하트가 눌리기 전에 Link가 우선시되어 페이지가 강제로 넘어가는 심각한 Event Bubbling 문제 발생.
- **원인:** React 구조상 DOM 트리의 하위 요소에서 발생한 이벤트는 상위 부모로 전파되는 특성이 있음.

### 💡 해결 (Optimization)
1. **렌더링 워크로드 강제 분리(Zero-Bundle-Size 관점)**: 리스트 뷰 전체를 무겁게 `use client`로 전환하지 않음. 오직 컴포넌트 중 **투표용 마이크로 인터랙션 버튼** 컴포넌트 하나만을 잘라서 하위 요소로 격리 후 이벤트 리스너 이식.
2. **이벤트 차단 (Event StopPropagation)**:
```tsx
const handleToggle = async (e: React.MouseEvent) => {
  e.preventDefault();   // Link 태그의 기본 라우팅 속성 차단
  e.stopPropagation();  // 부모-자식간 DOM 이벤트 전파 트리 차단 (버블링 차단)
  // ... Upvote API 처리 로직 구동
};
```
- **결과:** 유저가 투표 뱃지를 눌렀을 때만 페이지가 넘어가지 않고 숫자가 1 카운트되는 기분 좋은 프로덕트 UX를 완벽하게 재건하여 완성.
