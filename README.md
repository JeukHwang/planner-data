# planner-data

Repository for preprocessing graduation requirement

# Reference

## How to link specific line of PDF only using url

Firefox, pdf.js, https://github.com/mozilla/pdf.js/pull/5579

```
[Refer](C:\Users\jeukh\GitHub\planner-data\22.11.02\[국문]2022_건설및환경공학과_교과목이수요건.pdf#phrase=true&page=2&search=전공필수 과목)
[Refer with live server](http://localhost:5500/22.11.02/[국문]2022_건설및환경공학과_교과목이수요건#phrase=true&page=2&search=전공필수 과목)
```

# Idea

code에서 문서를 재생성 -> 그 문서를 기존 문서와 비교하자! - 어투, format이 달라서 비교하기 힘들 것 같기는 하다

// make Expr
// Expr.validate(lecs, track)
// Expr.info() : show message { type: required|substitute, condition: , }
// Expr는 약간 syntactic sugar이긴 하고 굳이 만들 필요가 없긴 한데 다음과 같은 motivation
// 누구나 이해하기 쉽고 짧으면서도
// js 언어-독립적(차라리 자연어 느낌)
// 모든 경우를 다 표현가능하고 확장가능한 강력한 표현이 가능해야 함

```
// http://127.0.0.1:5500/data/raw/AE.pdf#phrase=true&page=3&search=졸업이수학점:총 136학점 이상 이수
```

와 같은 주석을 넣고 싶지만 띄어쓰기가 들어가면 그 뒤로는 url로 인식되지 않는다는 문제가 존재
따라서 url shortener 등을 사용할 필요가 있어보임

// 알고 있는 규칙이 정확한가?
// 알고 있는 규칙이 전부인가?

Lecture를 Course로 바꾸기

- macro.ts

  - logic
- expr.ts

  - Expr definiton for each type
  - property 혹은 type change를 통한 편의성 제공 <= util.ts 함수를 사용해 편의성 제공
- [json-ts](https://github.com/shakyShane/json-ts)같은 json auto typing tool이 필요한 것 같다
- json2ts
- quick type


- 우선순위 미루기
  - 메시지에 link 추가 원함 => 그냥 알아서 봐; 시간 대비 효율성 떨어지는 작업
  - 일단은 폴더 ->
  - 사용자 자율성 주기
  - 


subject.json 다시 받기
\ubb34\ud559\uacfc \ub119\uc8fd\uc774

- README.md

- 개인
    - json 형태의 dump 파일을 sqlite로 진행하겠습니다
    - sql이 더 편하다? filter
    - type-safe?
- 팀
    - 백엔드랑 앱이랑 서로 코드를 읽어보면 어떨까요? - 
        - 코드 리뷰
        - 신입 개발자를 위한 *팀 문화 정리*, 코드 리뷰, 협업 연습
        - 기회비용???
    - 기존 OTL 코드 읽기
        - 혼자 하면 힘들어요
        - 계속 안 읽으면 아무도 몰라서 갈아엎어야 한다
        - 인수인계가 있으면 좋겠어요?
    - **공동 코딩, 디자인(가능한 사람만이라도)**을 제안합니다아...?
        - 의견을 실시간으로 주고 받는 시간, 피드백 주기 절반
        - 대면 회의, 회식, ...
        - 소속감 - 인간적인 교류
        - 따로 시간을 내지 않아도 된다
        - 서로 무슨 일을 하는지
        - 지금 당장은 힘들지라도 다음 학기 혹은 방학부터는
    - ? 다른 서비스에 속해있는 스팍스 부원들에게 의견 받기
        - 협업 어떻게 하고 있는가
        - 코드 리뷰도 다른 백앤드 개발자
        - 예비 시간표 어떻게 나타내지?, 뭘 확인해야 하지? => 요런 이슈도 다른 사람 의견 받으면 좋을 것 같다
        - 정모 발표의 의의와 겹치지 않나? 
            - 정모 때 시도해보자 좋은 의견!
        - 비실시간, 해도 될까요 질문
    - OTL 위축에 대한 걱정?
        - 차기 PM 선정 => 다들 걱정은 하지만 대안이 마땅치 않은 상태
        - 앞으로의 인수인계에 대한 준비
        - 사람이 부족한가?
    - 제안!
        - 기능 제안
        - 팀 문화 정리
            - 사용하는 기술 정리
                - linter, formatter, poetry?
            - 문서화 추가
                - production 올리는 방법
            - Commit Message Guidelines
            - 이슈 제기, 코드 리뷰어 배정하는 절차도 마련

        - 공동 코딩
            - 소속감, 인간적인 교류
            - 서로 다른 일을 하더라도 서로 무슨 일을 하는지 알 수 있도록!
            - 백엔드랑 앱이랑 서로 코드를 읽어보면 어떨까요?

        - 기존 코드 읽기(개인에게 장려?)
            - 신프에서 django를 배우지 않으니 django를 함께 배우는 시간이 필요하지 않을까요?
            - 온보딩용 task 작성 - 개발 서버 띄우고 간단한 api 하나 추가해서 프론트에서 확인하는 것까지 - taxi
            - 신입 회원에게 문서화를 시키는 방법도 존재! - taxi
            - pair programming


기존 otl 코드 읽기에 시간 들이기
dump file json이 아니라 sqlite 형식으로 받기
현재 하고 있는 부분도 sqlite 이용해서 코드 작성하기
효과적인 PR 날리기
super-developer 방지; 유지보수 가능성
코드 리뷰 -> 같은 직군에 있으면 서로 코드 읽을 수 있어야 한다(나도 앱을 읽자!)
프론트엔드, 백엔드, 앱  (번거로우면 확인 안 된다)
갈라파고스화 - test code 작성(api 작성 원리), 신입이 API docs 작성 => 기존 코드 읽는 시간 늘리기
기존 코드 모르고 새로운 코드를 만드는 것은 옳지 않다 - 일주일에 한 시간만이라도 기존 코드에 익숙해지는 시간이 필요하다 => docs도...
기존 코드 안 읽으면 갈아엎는 원인이 될 수 있다
모르겠는 부분 개인적인 부분(mysql, django 스스로 공부해보기)
#wheel-help slack channel 물어보기
ara도 django 쓰니까 backend channel 들어가기
다른 팀 회의할 때도 만나서 물어보기
같은 팀 아니어도 다른 팀 스팍스 사람 불러서 하기

예준이 형
플젝 쏠림 현상; 비서, 택시, ... 번갈아 가면서
예전 ara처럼 otl이 위축될까 걱정

팀 내에서도 재밌게 개발할 수 있는 방법에 대한 고민이 필요
왜 팀끼리 문화 공유를 안 하지? - 개인적으로 물어보기 / 두드려라 그럼 열릴 것이다; 개인적으로도 충분히 물어볼 수 있다

- [x] excel 파일 읽어오기
- [ ] excel 정보를 통해 sqlite에 있는 course로 대응시키기
- [ ] sqlite에 있는 course를 constant.ts와 대응시키기
- [ ] constant.ts에 있는 정보를 이용해서 학과 CS, AE, ID 검증하기
- [ ] 나머지 학과에 대해 끝내기
- [ ] excel 파일 directory 주면 알아서 처리한 후 분석 결과 내보내는 flow 만들기
- [ ] 위 flow를 처리할 수 있는 local webpage 간단하게 만들기