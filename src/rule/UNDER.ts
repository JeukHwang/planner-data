import { BaseExpr, BoolExpr } from "../core/expr";
import { And, If, Or, Take } from "../core/macro";
import type { User } from "../core/user";
import { getLecs } from "../core/util";
import { BaseDeptValidator } from "./dept";

// ASSERT - 학사과정 교과목 이수요건(2016학년도 이후 입학생 학사과정용)
export class UNDERvalidator extends BaseDeptValidator {
    constructor(user: User) {
        super(user, "UNDER");
    }
    protected setRequirements(): BoolExpr[] {
        const { lectures, user } = this;

        function 교양필수(): BoolExpr[] {
            // TODO : 영어 - 레벨테스트, 논술 - 레벨테스트, 체육 4AU, 인성/리더십 2AU, 윤리 및 안전 이수 - 2016의 경우 HSS070, 나머지는 eethics.kaist.ac.kr
            const common = getLecs(["HSS022", "HSS023", "HSS025", "HSS024", "HSS090", "HSS091"]);
            let bools = [Take(common, lectures.all)]; // 교양 필수
            // if (user.year >= 2018) {
            //     bools.push(
            //         lectures.all.filter({ group: "교양" }).credit.atLeast(28)
            //         // TODO: 교양 과목 8AU
            //     );
            // } else if (user.year >= 2014) {
            //     bools.push(
            //         lectures.all.filter({ group: "교양" }).credit.atLeast(28)
            //         // TODO: 교양 과목 8AU
            //     );
            // } else {
            //     throw new Error("");
            // }
            return bools;
        }

        function 기초필수(): BoolExpr[] {
            const common = [
                ["PH141", "PH161"],
                ["PH142", "PH162"],
                ["PH151", "PH152"],
                ["BS120", "MAS101", "MAS102", "CH101", "CH102", "CS101"],
            ];

            const lec2018 = [
                lectures.all.among(["PH141", "PH161"]).length.atLeast(1),
                lectures.all.among(["PH142", "PH162"]).length.atLeast(1),
                lectures.all.among(["PH151"]).length.atLeast(1),
                lectures.all.among(["BS120", "MAS101", "MAS102", "CH101", "CH102", "CS101"]).length.atLeast(6),
            ];
            const lec2020 = [
                lectures.all.replaceableWith("PH141", ["PH161", "PH171"]).length.atLeast(1),
                lectures.all.replaceableWith("PH142", ["PH162", "PH172"]).length.atLeast(1),
                lectures.all.among(["PH151", "PH152"]).length.atLeast(1),
                lectures.all.among(["BS120", "MAS101", "MAS102", "CH101", "CH102", "CS101"]).length.atLeast(6),
            ];
            const lec2020 = [
                lectures.all.among(["PH141", "PH161"]).length.atLeast(1),
                lectures.all.among(["PH142", "PH162"]).length.atLeast(1),
                lectures.all.among(["PH151", "PH152"]).length.atLeast(1),
                lectures.all.among(["BS120", "MAS101", "MAS102", "CH101", "CH102", "CS101"]).length.atLeast(6),
            ];
            return bools;
        }

        return [
            // 졸업이수학점
            lectures.all.credit.atLeast(136),
            // Not implemented: 교과목의 성적 평점평균이 2.0/4.3 이상

            // 교양과목 이수
            ...교양필수(),

            If(
                new BoolExpr(BaseExpr.user.track.복전.length > 0).setMsg("복수 전공이 존재"),
                // 복수 전공이 존재하면
                And(
                    lectures.all.filter({ group: "교양 핵심" }).credit.atLeast(3), // 1과목(3학점) 이상 포함
                    lectures.all.filter({ group: "교양" }).credit.atLeast(12)
                ),
                // 복수 전공이 존재하지 않으면
                And(
                    Or(
                        And(
                            lectures.all.filter({ group: "교양 인문" }).credit.atLeast(3), // 1과목(3학점) 이상 포함
                            lectures.all.filter({ group: "교양 사회" }).credit.atLeast(3) // 1과목(3학점) 이상 포함
                        ),
                        And(
                            lectures.all.filter({ group: "교양 인문" }).credit.atLeast(3), // 1과목(3학점) 이상 포함
                            lectures.all.filter({ group: "교양 문학과 예술" }).credit.atLeast(3) // 1과목(3학점) 이상 포함
                        ),
                        And(
                            lectures.all.filter({ group: "교양 문학과 예술" }).credit.atLeast(3), // 1과목(3학점) 이상 포함
                            lectures.all.filter({ group: "교양 사회" }).credit.atLeast(3) // 1과목(3학점) 이상 포함
                        )
                    ),
                    lectures.all.filter({ group: "교양 핵심" }).credit.atLeast(3), // 1과목(3학점) 이상 포함
                    lectures.all.filter({ group: "교양" }).credit.atLeast(21)
                )
            ),
            // TODO: 제2외국어 교과목은 인문사회선택에서 자유선택으로 교과목 구분을 변경함;
            // ※ 2021학년도 가을학기 이전 입학생은 입학당시 이수요건을 적용하여 제2외국어 교과목을 인문사회 선택으로 인정받을 수 있음. 재수강의 경우도 원래 과목 구분인 인문사회선택을 적용함.

            // TODO: MINOR 학사과정 외국인학생 교양과목 이수요건
        ];
    }
}
