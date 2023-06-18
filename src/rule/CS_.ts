import { BaseExpr, BoolExpr } from "../core/expr";
import { And, If, Or, Take } from "../core/macro";
import type { User } from "../core/user";
import { getLecs } from "../core/util";
import { BaseDeptValidator } from "./dept";

// ASSERT - 항공우주공학과 전공과목 이수요건(2016학년도 이후 입학생 학사과정용)
export class CSvalidator extends BaseDeptValidator {
    constructor(user: User) {
        super(user, "CS");
    }
    protected setRequirements(): BoolExpr[] {
        const { lectures, DeptIs: CSis } = this;
        const TakeLec = (lecs: string[]) => {
            return Take(getLecs(lecs), lectures.all);
        };
        const 전공선택lecList = [
            "CS350",
            "CS360",
            "CS374",
            "CS408",
            "CS409",
            "CS423",
            "CS442",
            "CS453",
            "CS454",
            "CS457",
            "CS459",
            "CS473",
            "CS474",
            "CS482",
        ];
        return [
            // CS가 포함된 track: 졸업이수학점
            lectures.all.credit.atLeast(136),

            // CS가 포함된 track: 기초선택
            TakeLec(["MAS109"]),
            If(CSis.복전, lectures.기선.credit.atLeast(3)), // MAS!09가 3학점인데?

            // CS가 전공, 심화전공, 자유융합전공으로 포함된 track : 전공 // TODO 복수전공도 포함?
            If(
                Or(CSis.주전, CSis.심전, CSis.융전),
                [
                    TakeLec(lectures.전필.replaceableWith("CS204", ["MAS275"]).replaceableWith("CS311", "EE312")),
                    If(
                        BoolExpr(user.track.year >= 2020).setMsg("2020학년도 이후 입학생인 경우"),
                        TakeAll(전공선택lecList.replaceableWith())
                        // 개별연구는 전선으로 4학점까지만 인정함
                        // [모든 재학생] 전공선택으로 인정하는 개별연구의 범위에는 타 학과 개별연구와 URP495를 모두 인정함
                        // [모든 재학생] 정보보호대학원 선택 과목(IS500번대 과목) 중 학사, 대학원 상호인정 교과목을 전공 선택 과목으로 인정함
                    ),
                    // 인공지능 분야 중점이수 (선택사항)
                    // 아래 과목들 중에서 4과목 이상을 수강하면 성적증명서에 ‘인공지능 중점 이수’ 라고 기록함: CS270 지능 로봇 설계 및 프로그래밍, CS372 파이썬을 통한 자연언어처리,
                    // CS376 기계학습, CS423 확률적 프로그래밍, CS454 인공 지능 기반 소프트웨어 공학, CS470 인공지능개론, CS474 텍스트마이닝, CS484 컴퓨터 비전 개론
                ] // MA260?
            ),

            // CS가 심화전공으로 포함된 track : 심화전공
            If(CSis.심전, lectures.all.filter({ codeGroup: "not 200", group: "학부 전공선택" }).credit.atLeast(12)),

            // CS가 자유융합전공으로 포함된 track : 자유융합전공
            If(
                CSis.융전,
                And(
                    // ASSERT - 아랫줄에 한 시도 : 자유융합전공: 12학점 이상 이수
                    // ASSERT - 자유융합전공은 문서에서 "전공"에는 해당이 안 되고 "자유융합전공"에만 해당이 되는건가?
                    lectures.dept.credit.atLeast(12)
                    // TODO 아랫줄에 한 시도 : 소속학과를 제외하고 2개 이상 학사조직의 전공교과목 중 12학점 이상 이수
                    // lectures.all.filter({dept:CS.except(), group:["전선", "전필"], not:false}).credit().atLeast(12)
                )
            ),

            // CS가 부전공으로 포함된 track : 부전공
            If(
                CSis.부전,
                And(
                    Take(lectures.전필).all(), 
                    Take(lectures.전선).atLeast(6)
                )
                // TODO ※타 학사조직 전공과목과의 중복 인정 불가 // 이게 replaceable?이 불가능하다는 건가?
            ),

            // CS가 복수전공으로 포함된 track : 복수전공
            If(
                CSis.복전,
                And(
                    lectures.all.credit.atLeast(42),
                 lectures.전필.credit.atLeast(21))
                // TODO ※타 학사조직 전공과목 최대 6학점까지 중복인정 가능 // 이건 give가 가능하다는거고?
            ),

            // CS가 포함된 track : 연구 // 연구는 원래 주전공만 하는 거임?
            If(
                new BoolExpr(BaseExpr.user.track.복전.length !== 0).setMsg("복전이 하나라도 존재"),
                lectures.연구.credit.atLeast(3),
                lectures.연구.filter({ code: "CS.졸업연구" }).credit.atLeast(3)
                // - 졸업연구 3학점은 반드시 이수(CS408 전산학 프로젝트로 대체할 수 있음)
                // - 세미나는 연구학점으로 인정
                // ※ 복수전공 이수자는 연구과목 이수를 면제함.
            ),

            // 24주 인턴십 프로그램인 SoC Co-op 1(INT482, INT495) 이수 학점 중 최대 9학점
            // 에 한해 CS490 졸업연구(3학점), CS409 산학협업 소프트웨어프로젝트(3학점)로
            // 대체 인정 가능하며, 나머지 3학점은 자유선택으로 인정 가능함.
            // 다만, SoC Co-op 1 참여 이전에 CS490 졸업연구(3학점), CS409 산학협업 소프트
            // 웨어프로젝트(3학점)를 기이수한 경우, 해당 기이수 학점을 자유선택 학점으로 인
            // 정함. 추가로 SoC Co-op 2(INT492, INT495)를 이수한 경우, 졸업 이수학점으로는
            // 최대 자유선택 3학점만 인정함.

            // 본 이수요건 중 24주 인턴십 프로그램 <SoC Co-op 1> (INT482, INT495) 학점인정 방식은 모든 재학생에게 적용함.
        ];
    }
}
