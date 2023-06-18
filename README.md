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