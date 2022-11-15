/* eslint-disable max-classes-per-file */

import { Dept, Lecture, LectureGroupType } from "./type";
import { User } from "./user";
import { getDept, getLec, getLecs, has, sum, union } from "./util";

export abstract class Expr {
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

    static get user(): User {
        return this.staticUser;
    }

    static get dept(): Dept {
        return this.staticDept;
    }

    static get lectures() {
        return this.staticLecs;
    }

    msg(): string {
        return this.context.join(" ");
    }
    public subExpr: Expr[] = [];
    public setSubExpr(...exprs: Expr[]) {
        this.subExpr = exprs;
    }

    private context: string[];
    public addContext(explanation: string) {
        this.context.unshift(explanation);
        this.subExpr.forEach((expr) => expr.addContext(explanation));
    }

    // validate: (user: User) => boolean;
    // info: (user: User) => { msg: string };
}

export class BoolExpr extends Expr {
    public readonly boolean: boolean;

    constructor(boolean: boolean) {
        super();
        this.boolean = boolean;
    }
}

export class NumExpr extends Expr {
    public readonly number: number;

    constructor(number: number) {
        super();
        this.number = number;
    }
    atLeast(n: number): BoolExpr {
        const expr: Expr =  new BoolExpr(this.number >= n);
        this.setSubExpr(expr);
        expr.
        return;
    }
    atMost(n: number): BoolExpr {
        return new BoolExpr(this.number <= n);
    }
}

export class LecExpr extends Expr {
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

export class LecsExpr extends Expr {
    public readonly lectures: Lecture[];
    private options: Option;

    constructor(lectures: Lecture[], options?: Option) {
        super();
        this.lectures = lectures;
        this.options = options ?? { substitutes: [] };
    }
    get length(): NumExpr {
        return new NumExpr(this.lectures.length);
    }
    get credit(): NumExpr {
        const basicCredit = sum(this.lectures.map((l) => l.credit));
        const additionalCredit = sum(
            this.options.substitutes
                .filter(([standard, _]) => !has(this.lectures, standard.lecture)) // 수강 안 한 과목 중
                .filter(([_, additions]) => union(Expr.lectures.all, additions.lectures).length >= 1) // 대체 가능한 과목을 들었다면
                .map(([standard, _]) => standard.lecture.credit) // 듣지 않은 과목을 들은 것으로 처리하여 학점 부여
        );
        // ASSERT - 한 과목의 credit은 시간에 따라 일정 (그러나 사실 아님)
        // ASSERT - additions의 credit은 서로 모두 동일
        // ASSERT - standard의 credit과 additions의 credit은 모두 동일
        return new NumExpr(basicCredit + additionalCredit);
    }

    among(lecs: Lecture["code"][] | Lecture[] | LecsExpr): LecsExpr {
        return new LecsExpr(union(this.lectures, getLecs(lecs).lectures));
    }

    approve(lecs: Lecture["code"][] | Lecture[] | LecsExpr): LecsExpr {
        return new LecsExpr([...this.lectures, ...getLecs(lecs).lectures], this.options);
    }

    // TODO - lecture 속성이 충분히 갖춰진 다음 만들면 효과적일 것
    filter(query: { code?: string; codeGroup?: string; group?: string }): LecsExpr {
        throw new Error("not yet implemented");
    }
    replaceableWith(
        standard: Lecture["code"] | Lecture | LecExpr,
        additions: Lecture["code"][] | Lecture[] | LecsExpr
    ): LecsExpr {
        const substitutes = [
            ...this.options.substitutes,
            [getLec(standard), getLecs(additions)] as [LecExpr, LecsExpr],
        ];
        const options = { substitutes };
        return new LecsExpr(this.lectures, options);
    }
}
