import { mapCodeToLecture } from "../db/util";
import { deptList } from "./constant";
import { LecExpr, LecsExpr } from "./expr";
import type { Dept, Lecture } from "./type";

export type Brand<K, T> = K & { __brand: T };

export function getDept(dept: Dept["code"] | Dept): Dept {
    function isDept(d: Dept["code"] | Dept): d is Dept {
        return typeof d !== "string";
    }
    return isDept(dept) ? dept : deptList.find((d) => d.code === dept)!;
}

export function getLec(lec: Lecture["code"] | Lecture | LecExpr): LecExpr {
    function isLecExpr(l: Lecture["code"] | Lecture | LecExpr): l is LecExpr {
        return l instanceof LecExpr;
    }
    function isLecCode(l: Lecture["code"] | Lecture | LecExpr): l is Lecture["code"] {
        return typeof l === "string";
    }
    if (isLecExpr(lec)) {
        return lec;
    }
    // const lecture = isLecCode(lec) ? lecList.find((l) => l.code === lec)! : lec;
    const lecture = isLecCode(lec) ? mapCodeToLecture(lec) : lec;
    return new LecExpr(lecture);
}

export function getLecs(lecs: Lecture["code"][] | Lecture[] | LecsExpr): LecsExpr {
    function isLecsExpr(l: Lecture["code"][] | Lecture[] | LecsExpr): l is LecsExpr {
        return l instanceof LecsExpr;
    }
    function isLecsCode(l: Lecture["code"][] | Lecture[]): l is Lecture["code"][] {
        return l[0] ? typeof l[0] === "string" : true; // 비었으면 type 무관
    }
    if (isLecsExpr(lecs)) {
        return lecs;
    }
    const lectures = isLecsCode(lecs) ? lecs.map((code) => getLec(code).lecture)! : lecs;
    return new LecsExpr(lectures);
}

export function sum(ns: number[]): number {
    return ns.reduce((acc, n) => acc + n, 0);
}

export function unique(ls: Lecture[]): Lecture[] {
    return ls.filter((l, i, ls_) => ls_.findIndex((l_) => l_.code === l.code) === i);
}

export function union(ls1: Lecture[], ls2: Lecture[]): Lecture[] {
    return ls1.filter((a) => ls2.some((b) => b.code === a.code));
}

export function has(ls: Lecture[], l: Lecture): boolean {
    // return ls.map((l_) => l_.code).includes(l.code);
    return union(ls, [l]).length > 0;
}