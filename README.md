# 모여라

학생 정보를 모아 주제·역할·학교 우선순위로 조를 추천하는 정적 웹앱입니다.

## Firebase 연결

1. Firebase 콘솔에서 프로젝트를 만들고 **Firestore Database**를 생성합니다. 테스트 중에는 Test mode를 선택합니다.
2. 웹 앱을 추가한 뒤 표시되는 설정값을 `.env.example`을 복사한 `.env`에 넣습니다.
3. `npm install` 후 `npm run dev`로 실행합니다.

배포 전 Firestore 규칙은 운영자만 학생 데이터를 읽고 쓸 수 있도록 Firebase Authentication과 함께 제한하는 것을 권장합니다. 현재 앱은 별도 로그인 없이 쓰는 운영용 도구이므로, 공개 배포 시에는 반드시 규칙을 설정하세요.

## GitHub Pages 배포

저장소의 **Settings → Secrets and variables → Actions**에 `.env.example`의 6개 값을 같은 이름으로 등록하세요. 이후 `main` 브랜치로 올리면 GitHub Pages에 자동 배포됩니다. 저장소의 **Settings → Pages**에서 Source를 **GitHub Actions**로 선택하세요.
