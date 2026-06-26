# 설문조사 기반 비주얼노벨 웹게임

React, TypeScript, Tailwind CSS로 만든 비주얼노벨형 설문 웹게임입니다. 플레이어는 스토리를 읽고 선택지를 고르며, 선택 데이터는 Google Apps Script API를 통해 Google Sheets에 저장됩니다.

## 주요 기능

- JSON 기반 분기형 스토리 관리
- 캐릭터 스탠딩 일러스트와 배경 이미지 표시
- PC/모바일 반응형 UI
- 다크모드, 텍스트 속도 조절, Auto 진행
- 대사 로그와 이전 대사 확인
- 닉네임/성별 입력
- 선택지, 선택 시각, 플레이 시간, 완료 여부 저장
- API 오류가 있어도 플레이가 끊기지 않는 저장 큐 처리

## 실행

```bash
npm install
npm run dev
```

## Google Sheets 연동

1. Google Sheets를 새로 만들고 `확장 프로그램 > Apps Script`를 엽니다.
2. `apps-script/Code.gs` 내용을 붙여 넣습니다.
3. Apps Script에서 `배포 > 새 배포 > 웹 앱`을 선택합니다.
4. 실행 권한은 본인, 액세스 권한은 필요한 범위에 맞게 설정합니다.
5. 배포 URL을 `.env`에 입력합니다.

```bash
VITE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

프론트엔드는 각 선택 이후 현재 스냅샷을 전송합니다. `responses` 시트에는 `timestamp`, `nickname`, `gender`, `choice_1...choice_n`, `play_time`, `completed`가 포함되며, 선택 시각은 각 `choice_n` 셀의 JSON 안에 저장됩니다.

## 스토리 추가

스토리는 `src/data/story.json`에서 관리합니다. 각 장면은 `id`, `background`, `speaker`, `text`, `characters`, `next` 또는 `choices`를 가집니다.

선택지는 다음 장면을 가리키는 `next`와 분석용 `category`를 포함합니다.

```json
{
  "id": "example_choice",
  "label": "선택지 문구",
  "value": "분석에 저장할 의미",
  "next": "next_scene_id",
  "category": "interest"
}
```

## 배포

Vercel에서 이 저장소를 연결한 뒤 환경변수 `VITE_SHEETS_API_URL`을 추가하고 배포하면 됩니다.
