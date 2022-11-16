/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */ // TODO - erase this

import { BoolExpr } from "./expr";
import type { Dept, Lecture, Track, TrackType } from "./type";
import { getDept } from "./util";

export class UserTrack implements Track {
    public 주전: Dept;
    public 복전: Dept[];
    public 부전: Dept[];
    public 심전: Dept[];
    public 융전: boolean;
    constructor(주전: Dept["code"], 복전: Dept["code"][], 부전: Dept["code"][], 심전: Dept["code"][], 융전: boolean) {
        this.주전 = getDept(주전);
        this.복전 = 복전.map((dept) => getDept(dept));
        this.부전 = 부전.map((dept) => getDept(dept));
        this.심전 = 심전.map((dept) => getDept(dept));
        this.융전 = 융전;
        if (!this.isValid()) {
            throw new Error("Invalid track");
        }
    }

    private isValid(): boolean {
        return true;
        // throw new Error("not yet implemented");
    }

    public isDept(code: Dept["code"]): { [key in TrackType]: BoolExpr } {
        return {
            주전: new BoolExpr(this.주전.code === code),
            복전: new BoolExpr(this.복전.map((dept) => dept.code).includes(code)),
            부전: new BoolExpr(this.부전.map((dept) => dept.code).includes(code)),
            심전: new BoolExpr(this.심전.map((dept) => dept.code).includes(code)),
            융전: new BoolExpr(this.융전),
        };
    }
}

export class User {
    public readonly lectures: Lecture[];
    public readonly track: Track;
    public readonly year: number;

    constructor(lectures: Lecture[], track: Track, year: number) {
        this.lectures = lectures;
        this.track = track;
        this.year = year;
    }
}
