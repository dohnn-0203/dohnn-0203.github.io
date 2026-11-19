# 김도현 포트폴리오

Unity 산업용 시뮬레이션, 데이터 시각화, React 프론트엔드 프로젝트를 소개하는 정적 포트폴리오 사이트입니다. HTML·CSS·JavaScript로 구성되어 별도 설치나 빌드 없이 실행됩니다.

## 미리 보기

폴더 안의 `index.html`을 더블 클릭하면 브라우저에서 확인할 수 있습니다. 인터넷 연결이 필요한 GitHub·블로그·WebGL 게임 링크는 해당 서비스로 이동합니다.

로컬 서버를 사용하려면 이 폴더에서 다음 명령을 실행한 뒤 `http://localhost:8000`을 열면 됩니다. 이 방법은 Python이 설치되어 있을 때 사용할 수 있습니다.

```sh
python -m http.server 8000
```

## GitHub Pages에 게시하기

이 파일 묶음은 게시할 준비가 된 소스입니다. 파일을 받는 것만으로 GitHub에 업로드되거나 사이트가 배포되지는 않습니다.

1. [GitHub 새 저장소 만들기](https://github.com/new)에서 소유자를 `dohnn-0203`, 저장소 이름을 **`dohnn-0203.github.io`**, 공개 범위를 **Public**으로 지정해 생성합니다.
2. 저장소에 이 폴더 **안의 파일과 `assets` 폴더**를 업로드하고 `main` 브랜치에 커밋합니다. `index.html`이 저장소 최상위에 있어야 합니다. `dohnn-0203.github.io` 폴더 자체를 한 단계 더 넣지 마세요.
3. 저장소의 **Settings → Pages**를 엽니다.
4. **Build and deployment → Source**를 **Deploy from a branch**로 선택합니다.
5. Branch를 **main**, 폴더를 **/(root)**로 지정하고 **Save**를 누릅니다.
6. GitHub Pages 배포가 완료되면 Pages 설정 화면에 표시되는 주소를 엽니다. 이 저장소 이름으로 게시하는 경우 주소는 **`https://dohnn-0203.github.io/`**입니다.

게시 후 소개 문구, 이미지 확대, 프로젝트 필터, 모바일 메뉴, 연락처 링크를 확인하세요. 이후 `main` 브랜치 파일을 수정하고 커밋하면 GitHub Pages가 다시 배포합니다.

### 기존 developer-portfolio 저장소를 사용할 경우

새 저장소를 만들지 않고 [developer-portfolio](https://github.com/dohnn-0203/developer-portfolio)에 게시할 수도 있습니다. 기존 파일을 백업한 뒤 이 소스의 `index.html`, `styles.css`, `app.js`, `assets`, `.nojekyll`, `robots.txt`를 저장소 최상위에 반영합니다. Pages 설정은 동일하게 **main / (root)**를 사용합니다.

이 경우 공개 주소는 **`https://dohnn-0203.github.io/developer-portfolio/`**입니다. 사이트의 CSS·JavaScript·이미지 경로는 상대 경로이므로 두 게시 방식 모두 지원합니다. 기존 `css/`, `js/`의 더미 데이터는 새 사이트에서 사용하지 않습니다.

이 방식을 선택하면 `index.html`의 `og:image` 주소도 `https://dohnn-0203.github.io/developer-portfolio/assets/windfarm-analysis.webp`로 바꾸면 공유 이미지가 올바르게 표시됩니다.

## 내용 수정하기

| 파일 | 수정하는 내용 |
| --- | --- |
| `index.html` | 자기소개, 경력, 프로젝트 설명·기간, 기술 목록, 이메일과 외부 링크, 검색·공유용 메타 정보 |
| `styles.css` | 색상, 글꼴, 간격, 반응형 레이아웃 |
| `app.js` | 프로젝트 필터, 모바일 메뉴, 이미지 확대, 이메일 복사 |
| `assets/` | 프로젝트 화면 이미지, 첫 화면 일러스트, 파비콘 |

이메일을 변경할 때는 화면의 주소, `mailto:` 링크, 이메일 복사 버튼의 `data-email` 값을 함께 수정하세요. 프로젝트를 추가하거나 삭제할 때는 전체 필터의 수량과 프로젝트 분류도 함께 확인하세요.

## 콘텐츠 근거

- 제공된 `김도현_포트폴리오.pdf`의 업무 프로젝트 설명과 실제 화면을 정리했습니다.
- 제공된 `김도현_이력서.pdf`의 경력·학력·기술·업무 연락 이메일을 참고했습니다.
- 개인 프로젝트는 [WebGL_Playground](https://github.com/dohnn-0203/WebGL_Playground), [Chess](https://github.com/dohnn-0203/Chess), [unity_playground](https://github.com/dohnn-0203/unity_playground)의 공개 자료를 확인했습니다.
- 기존 `developer-portfolio` 저장소는 예시용 더미 데이터로 명시되어 있어 그곳의 경력·회사·성과 수치를 사용하지 않았습니다.

두 PDF의 정규직 시작 월이 서로 달라 경력에는 **2023년 입사**만 표기했습니다. 현재 근속기간이나 재직 상태를 임의로 계산하지 않았으며, 풍력 프로젝트의 후속 작업을 완료 성과로 표현하지 않았습니다. 최신 사실을 확인하면 `index.html`에서 갱신할 수 있습니다.

사이트에는 원본 이력서·포트폴리오 PDF 다운로드를 포함하지 않았습니다. 상세 주소·전화번호·생년월일도 공개 내용에서 제외했습니다. 원본 PDF를 그대로 업로드하면 해당 정보까지 공개되므로, 다운로드 자료를 추가하려면 공개용으로 정리한 별도 문서를 사용하세요.

## 글꼴과 검증

Pretendard 가변 글꼴을 자체 포함했으며 SIL Open Font License는 `assets/Pretendard-LICENSE.txt`에 있습니다. 외부 CDN, 분석 스크립트, API 키 없이 동작합니다. 첫 화면 일러스트는 이 사이트용으로 제작한 SVG입니다.

Chrome에서 데스크톱 및 390px 모바일 레이아웃, 프로젝트 필터(전체/Unity/Web), 상세 설명, 이미지 확대와 Escape 닫기, 모바일 메뉴, 이메일 복사를 확인했습니다. `file://`로 직접 열어 클립보드 접근이 제한되는 브라우저에서는 안내 문구가 표시되며, 이메일 링크는 계속 사용할 수 있습니다.
