/* eslint-disable max-classes-per-file */

import { Among, Approve, AtLeast, AtMost, Credit, Filter, Length, ReplaceableWith, Same } from "./macro";
import type { Dept, Expr, Lecture, LectureGroupType } from "./type";
import type { User } from "./user";
import { getDept, getLec, getLecs, union } from "./util";

export abstract class BaseExpr {
    private static staticUser: User;
    private static staticDept: Dept;
    private static staticLecs: Readonly<
        { [key in LectureGroupType]: Lecture[] } & {
            dept: Lecture[];
            all: Lecture[];
        }
    >;
    public static setEnv(user: User, code: Dept["code"]): void {
        // TODO - 애초에 전역변수로 쓰여서 이미 좋은 코드는 아니다
        // TODO - private, getter로 바꿔서 수정은 못하도록 막아둠
        // TODO - static method랑 static variable이 상속되지 않으면 더 좋을 것 같다.
        // TODO - get를 통해서 Expr만 접근 가능하게는 못하나?
        this.staticUser = user;
        this.staticDept = getDept(code);
        this.staticLecs = {
            all: this.staticUser.lectures,
            dept: union(this.staticUser.lectures, this.staticDept.lecture.all),
            기필: union(this.staticUser.lectures, this.staticDept.lecture.기필),
            기선: union(this.staticUser.lectures, this.staticDept.lecture.기선),
            전필: union(this.staticUser.lectures, this.staticDept.lecture.전필),
            전선: union(this.staticUser.lectures, this.staticDept.lecture.전선),
            심전필: union(this.staticUser.lectures, this.staticDept.lecture.심전필),
            연구: union(this.staticUser.lectures, this.staticDept.lecture.연구),
        };
    }

    // static get user(): User {
    //     return this.staticUser;
    // }

    static get dept(): Dept {
        return this.staticDept;
    }

    static get lectures() {
        return this.staticLecs;
    }

    public message = "";

    public setMsg(msg: string) {
        this.message = msg;
        return this;
    }
    public baseMsgOn<T extends Expr>(this: T, expr: Expr): T {
        this.message = expr.message;
        return this;
    }
    public extendMsg<T extends Expr>(this: T, func: (msg: string) => string): T {
        this.message = func(this.message);
        return this;
    }

    // validate: (user: User) => boolean;
    // info: (user: User) => { msg: string };
}

export class BoolExpr extends BaseExpr {
    public readonly boolean: boolean;

    constructor(boolean: boolean) {
        super();
        this.boolean = boolean;
    }
}

export class NumExpr extends BaseExpr {
    public readonly number: number;

    constructor(number: number) {
        super();
        this.number = number;
    }
    atLeast(n: number): BoolExpr {
        return AtLeast(this, n);
    }
    atMost(n: number): BoolExpr {
        return AtMost(this, n);
    }
    same(n: number): BoolExpr {
        return Same(this, n);
    }
}

export class LecExpr extends BaseExpr {
    public readonly lecture: Lecture;
    constructor(lecture: Lecture) {
        super();
        this.lecture = lecture;
    }
}

type Option = {
    /* eslint-disable-next-line no-use-before-define */
    substitutes: [LecExpr, LecsExpr][];
};

export class LecsExpr extends BaseExpr {
    public readonly lectures: Lecture[];
    public readonly options: Option;

    constructor(lectures: Lecture[], options?: Option) {
        super();
        this.lectures = lectures;
        this.options = options ?? { substitutes: [] };
    }

    get length(): NumExpr {
        return Length(this);
    }
    get credit(): NumExpr {
        return Credit(this);
    }

    among(lecs: Lecture["code"][] | Lecture[] | LecsExpr): LecsExpr {
        return Among(this, getLecs(lecs).lectures);
    }

    approve(lecs: Lecture["code"][] | Lecture[] | LecsExpr): LecsExpr {
        return Approve(this, getLecs(lecs).lectures);
    }

    // TODO - lecture 속성이 충분히 갖춰진 다음 만들면 효과적일 것
    filter(query: { code?: string; codeGroup?: string; group?: string }): LecsExpr {
        return Filter(this, query);
    }
    replaceableWith(
        standard: Lecture["code"] | Lecture | LecExpr,
        additions: Lecture["code"][] | Lecture[] | LecsExpr
    ): LecsExpr {
        return ReplaceableWith(this, getLec(standard), getLecs(additions));
    }
}
