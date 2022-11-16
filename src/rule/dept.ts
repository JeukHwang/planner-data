import { BaseExpr, BoolExpr, LecsExpr } from "../core/expr";
import type { Dept, LectureGroupType, Track, TrackType } from "../core/type";
import type { User } from "../core/user";

type LecturesForValidation = Readonly<
    { [key in LectureGroupType]: LecsExpr } & {
        dept: LecsExpr;
        all: LecsExpr;
    }
>;

// ASSERT - 항공우주공학과 전공과목 이수요건(2016학년도 이후 입학생 학사과정용)
export class BaseDeptValidator {
    public readonly lectures: LecturesForValidation;
    public readonly user: User;
    public readonly code: Dept["code"];
    public readonly DeptIs: ReturnType<Track["isDept"]>;

    constructor(user: User, code: Dept["code"]) {
        this.user = user;
        this.code = code;

        BaseExpr.setEnv(user, code);
        this.lectures = Object.fromEntries(
            Object.entries(BaseExpr.lectures).map(([key, value]) => [key, new LecsExpr(value)])
        ) as LecturesForValidation;
        this.DeptIs = BaseExpr.user.track.isDept(code);

        // TODO - Overlapped hardcoding with LectureGroupType, TrackType
        this.lectures.all.setMsg("수강한 전체 과목");
        this.lectures.dept.setMsg(`수강한 전체 ${this.code} 과목`);
        (["기선", "기필", "심전필", "연구", "전선", "전필"] as LectureGroupType[]).forEach((groupType) => {
            this.lectures[groupType].setMsg(`수강한 전체 ${this.code} ${groupType} 과목`);
        });
        (["주전", "복전", "부전", "심전", "융전"] as TrackType[]).forEach((trackType) => {
            this.DeptIs.주전.setMsg(`${this.code}를 ${trackType}으로 선택`);
        });
    }

    public static get requirements(): BoolExpr[] {
        return [];
    }

    public static notice(): string[] {
        const msgs: string[] = BaseDeptValidator.requirements
            .filter((requirement) => requirement.boolean === false)
            .map((requirement) => requirement.message);
        return msgs.length === 0 ? ["Pass all"] : msgs;
    }
}
