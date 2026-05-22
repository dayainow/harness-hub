# Lexical Editor

Lexical 기반의 리치 텍스트 에디터 컴포넌트입니다.

## 기능

- **텍스트 포매팅**: Bold, Italic, Underline, Strikethrough
- **헤딩**: H1, H2, H3
- **정렬**: 왼쪽, 가운데, 오른쪽
- **링크**: 텍스트 및 이미지에 링크 추가
- **이미지**: 이미지 업로드 및 크기 조절
- **드래그 앤 드롭**: 블록 단위 드래그 앤 드롭 지원

## 설치 방법

### 1. 필요한 패키지 설치

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/code @lexical/link @lexical/utils
# 또는
yarn add lexical @lexical/react @lexical/rich-text @lexical/code @lexical/link @lexical/utils
# 또는
pnpm add lexical @lexical/react @lexical/rich-text @lexical/code @lexical/link @lexical/utils
```

### 2. 에디터 폴더 복사

다음 폴더 구조를 프로젝트의 `src/components/` 디렉토리에 복사하세요:

```
editor/
├── LexicalEditor.tsx          # 메인 에디터 컴포넌트
├── nodes/
│   └── ImageNode.tsx          # 이미지 노드 정의
├── plugins/
│   ├── DraggableBlockPlugin.tsx       # 드래그 앤 드롭
│   ├── FloatingLinkEditorPlugin.tsx   # 링크 편집기
│   ├── ImagesPlugin.tsx               # 이미지 플러그인
│   └── ToolbarPlugin.tsx              # 툴바
└── styles/
    └── editor.css             # 에디터 스타일
```

### 3. 사용 방법

```tsx
import LexicalEditor from '@/components/editor/LexicalEditor';

function MyPage() {
  const handleChange = (content: string) => {
    console.log('에디터 내용:', content);
  };

  return (
    <LexicalEditor
      onChange={handleChange}
      initialContent=""
    />
  );
}
```

## Props

| Prop | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `onChange` | `(content: string) => void` | 에디터 내용이 변경될 때 호출되는 콜백 (선택사항) | - |
| `initialContent` | `string` | 에디터의 초기 내용 (선택사항) | - |

## 이미지 업로드 커스터마이징

`ToolbarPlugin.tsx` 파일의 이미지 업로드 로직을 수정하여 자신의 서버나 클라우드 스토리지에 맞게 조정할 수 있습니다:

```tsx
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 여기서 실제 서버 업로드 로직을 구현하세요
  const imageUrl = await uploadToYourServer(file);

  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
    src: imageUrl,
    altText: file.name,
  });
};
```

## 스타일 커스터마이징

`styles/editor.css` 파일을 수정하여 에디터의 외관을 프로젝트에 맞게 조정할 수 있습니다.

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 라이선스

프로젝트 라이선스에 따릅니다.
