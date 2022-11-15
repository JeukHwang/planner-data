import { BoolExpr, Expr, LecsExpr } from "../core/expr";
import { And, If, Or } from "../core/macro";
import { User } from "../core/user";

export const AE = {
    validate(user: User): boolean {
        return true;
    },
};

// ASSERT - 항공우주공학과 전공과목 이수요건(2016학년도 이후 입학생 학사과정용)
AE.validate = function validate(user: User): boolean {
    Expr.setEnv(user, "AE");
    const AEis = Expr.user.track.isDept("AE");
    const lectures = Object.fromEntries(
        Object.entries(Expr.lectures).map(([key, value]) => [key, new LecsExpr(value)])
    );
    const specialLecListFor심전 = ["MAS109", "MAS201", "MAS202"];
    const graduationRequirements: BoolExpr[] = [
        // AE가 포함된 track: 졸업이수학점
        lectures.all.credit.atLeast(136),
        // AE가 포함된 track: 기초선택
        If(AEis.복전, lectures.기선.credit.atLeast(6), lectures.기선.credit.atLeast(9)),

        // AE가 전공, 심화전공, 자유융합전공으로 포함된 track : 전공 // TODO 복수전공도 포함?
        If(
            Or(AEis.주전, AEis.심전, AEis.융전),
            If(
                AEis.심전,
                And(
                    lectures.all.among(specialLecListFor심전).length.atLeast(2),
                    lectures.all.among(specialLecListFor심전).credit.atLeast(9)
                ),
                And(
                    lectures.all.among(specialLecListFor심전).length.atLeast(1),
                    lectures.all.among(specialLecListFor심전).credit.atLeast(6)
                )
            )
        ),

        // AE가 심화전공으로 포함된 track : 심화전공
        If(
            AEis.심전,
            And(
                lectures.심전필.credit.atLeast(18),
                lectures.심전필
                    .approve(lectures.all.filter({ codeGroup: "500단위" }).filter({ group: "학사대학원상호인정" }))
                    .credit.atLeast(18)
            )
        ),

        // AE가 자유융합전공으로 포함된 track : 자유융합전공
        If(
            AEis.융전,
            And(
                // ASSERT - 아랫줄에 한 시도 : 자유융합전공: 12학점 이상 이수
                // ASSERT - 자유융합전공은 문서에서 "전공"에는 해당이 안 되고 "자유융합전공"에만 해당이 되는건가?
                lectures.dept.credit.atLeast(12)
                // TODO 아랫줄에 한 시도 : 소속학과를 제외하고 2개 이상 학사조직의 전공교과목 중 12학점 이상 이수
                // lectures.all.filter({dept:AE.except(), group:["전선", "전필"], not:false}).credit().atLeast(12)
            )
        ),

        // AE가 부전공으로 포함된 track : 부전공
        If(
            AEis.부전,
            lectures.전필.credit.atLeast(9),
            lectures.all.credit.atLeast(18)
            // TODO ※타 학사조직 전공과목과의 중복 인정 불가 // 이게 catch가 불가능하다는 건가?
        ),

        // AE가 복수전공으로 포함된 track : 복수전공
        If(
            AEis.복전,
            lectures.all.credit.atLeast(42),
            lectures.전필.credit.atLeast(21)
            // TODO ※타 학사조직 전공과목 최대 6학점까지 중복인정 가능 // 이건 give가 가능하다는거고?
        ),

        // AE가 포함된 track : 연구 // 연구는 원래 주전공만 하는 거임?
        If(
            new BoolExpr(user.track.복전.length !== 0),
            lectures.연구.credit.atLeast(3),
            lectures.연구
                .filter({ code: "AE.졸업연구" })
                .replaceableWith("AE.졸업연구", ["TODO 항공우주시스템셜계II의 code"])
                .credit.atLeast(3)
        ),
        // TODO - 이건 어떤 의미지?
        // ▣ 24주 인턴십프로그램 AE Co-op 1(INT482, INT495) 이수학점 중 최대 9학
        // 점에 한해 졸업연구(3), 전공선택(3), 자유선택(3)으로 대체 인정 가능함
        // 추가로 AE Co-op 2(INT492, INT495)를 이수한 경우, 이수학점 중 최대 자유선택
        // 3학점만 졸업이수학점으로 인정함

        // AE Co-op 인턴십 프로그램 이수요건은 모든 재학생에게 적용한다.
        // 본 이수요건 중 공과대학에서 개설한 전공선택 교과목(CoE491코드)을 전공선택으로 인정하는 사항은 모든 재학생에게 적용한다.
    ];
    return graduationRequirements.every((requirement) => requirement.boolean === true);
    // TODO - give message
};
