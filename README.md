# DID SYSTEM - 로고 링크 수정 및 관리 가이드 (Logo Links Guide)

이 문서는 사용자가 나중에 서비스 로고(왼쪽 상단 및 하단 푸터)에 외부 웹사이트나 특정 페이지로 연결되는 링크를 손쉽게 추가할 수 있도록 수정 코드 위치와 변경 방법을 안내합니다.

---

## 1. 상단 헤더 로고 링크 (Header Logo Link)

*   **파일 위치**: `/src/components/ClientHome.tsx`
*   **코드 라인**: 대략 **314줄 ~ 326줄** 부근 (헤더 `<nav>` 태그 직후)
*   **현재 코드 구조**:
    ```tsx
    {/* 상단 왼쪽 로고 링크 수정 가이드: 나중에 외부 링크로 바꾸려면 href="#" 대신 "https://example.com"을 넣으세요. */}
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center neon-glow">
        <Monitor className="w-4 h-4 text-white" />
      </div>
      <span className="font-bold text-lg text-primary tracking-tight neon-text-glow font-mono">DID SYSTEM</span>
    </a>
    ```

*   **수정 방법**:
    *   `href="#"` 속성을 원하는 URL(예: `href="https://your-custom-link.com"`)로 변경해 주세요.
    *   외부 링크로 페이지가 바로 이동하게 하려면, 상단 코드의 `onClick` 이벤트 핸들러(안의 `e.preventDefault();` 및 `window.scrollTo(...)`) 전체를 삭제하거나 주석 처리하시면 됩니다.

---

## 2. 하단 푸터 로고 링크 (Footer Logo Link)

*   **파일 위치**: `/src/components/ClientHome.tsx`
*   **코드 라인**: 대략 **944줄 ~ 956줄** 부근 (푸터 `<footer>` 태그 영역 내부)
*   **현재 코드 구조**:
    ```tsx
    {/* 하단 로고 링크 수정 가이드: 나중에 외부 링크로 바꾸려면 href="#" 대신 "https://example.com"을 넣으세요. */}
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="flex items-center gap-2.5 opacity-95 w-fit select-none cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_10px_rgba(68,214,255,0.15)]">
        <Monitor className="w-4.5 h-4.5 text-white" />
      </div>
      <span className="font-extrabold text-lg text-white tracking-wider font-sans">DID SYSTEM</span>
    </a>
    ```

*   **수정 방법**:
    *   상단 로고와 동일하게, `href="#"`를 원하는 목적지 주소로 교체하고, `onClick` 영역을 지우거나 주석 처리하시면 외부 링크 이동이 온전하게 작동합니다.
