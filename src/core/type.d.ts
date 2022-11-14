import { BoolExpr } from "./expr";

export type LectureGroupType = "기필" | "기선" | "전필" | "전선" | "심전필" | "연구";
export type TrackType = "주전" | "복전" | "부전" | "심전" | "융전";

export interface Lecture {
    readonly title: { ko: string; en: string };
    readonly code: string; // TODO - change into brand?
    readonly credit: number;
    readonly credit_au: number;
}

export interface Dept {
    readonly ko: string;
    readonly code: string;
    readonly lecture: { [key in LectureGroupType]: Lecture[] } & {
        all: Lecture[];
    };
}

export interface Track {
    // TODO - Track이 존재하면 구현 상에서는 readonly가 아니어도 외부에서 접근 시에는 type을 readonly로 만들 수 있다!
    readonly 주전: Dept;
    readonly 복전: Dept[];
    readonly 부전: Dept[];
    readonly 심전: Dept[];
    readonly 융전: boolean;
    isDept(code: Dept["code"]): { [key in TrackType]: BoolExpr };
}
