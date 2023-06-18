import { BaseExpr, BoolExpr, LecExpr, LecsExpr, NumExpr } from "./expr";
import type { Lecture } from "./type";
import { has, sum, union } from "./util";

export function And(...exprs: BoolExpr[]): BoolExpr {
    return new BoolExpr(exprs.map((e) => e.boolean).every((v) => v === true)).setMsg(
        exprs.map((e) => e.message).join(" 그리고 ")
    );
}

export function Or(...exprs: BoolExpr[]): BoolExpr {
    return new BoolExpr(exprs.map((e) => e.boolean).some((v) => v === true)).setMsg(
        exprs.map((e: BoolExpr) => e.message).join(" 또는 ")
    );
}

export function Not(expr: BoolExpr): BoolExpr {
    return new BoolExpr(!expr.boolean).setMsg(`Not(${expr.message})`);
}

export function If<T extends BaseExpr>(
    predicate: BoolExpr,
    trueExpr: T,
    falseExpr = new BoolExpr(true) as BaseExpr as T
): T {
    return (predicate.boolean ? trueExpr : falseExpr).extendMsg((msg) => `${predicate.message}하였으므로, ${msg}`);
}

export function Ifnot<T extends BaseExpr>(
    predicate: BoolExpr,
    falseExpr: T,
    trueExpr = new BoolExpr(true) as BaseExpr as T
): T {
    return If(Not(predicate), trueExpr, falseExpr);
}

export function AtLeast(expr: NumExpr, n: number): BoolExpr {
    return new BoolExpr(expr.number >= n).baseMsgOn(expr).extendMsg((msg) => `${msg} 최소 ${n}`);
}

export function AtMost(expr: NumExpr, n: number): BoolExpr {
    return new BoolExpr(expr.number <= n).baseMsgOn(expr).extendMsg((msg) => `${msg} 최대 ${n}`);
}

export function Same(expr: NumExpr, n: number): BoolExpr {
    return new BoolExpr(expr.number === n).baseMsgOn(expr).extendMsg((msg) => `${msg} 와 ${n} 같음`);
}

export function Length(expr: LecsExpr): NumExpr {
    return new NumExpr(expr.lectures.length).baseMsgOn(expr).extendMsg((msg) => `${msg}의 길이`);
}

export function Credit(expr: LecsExpr): NumExpr {
    const basicCredit = sum(expr.lectures.map((l) => l.credit));
    const additionalCredit = sum(
        expr.options.substitutes
            .filter(([standard, _]) => !has(expr.lectures, standard.lecture)) // 수강 안 한 과목 중
            .filter(([_, additions]) => union(BaseExpr.lectures.all, additions.lectures).length >= 1) // 대체 가능한 과목을 들었다면
            .map(([standard, _]) => standard.lecture.credit) // 듣지 않은 과목을 들은 것으로 처리하여 학점 부여
    );
    // ASSERT - 한 과목의 credit은 시간에 따라 일정 (그러나 사실 아님)
    // ASSERT - additions의 credit은 서로 모두 동일
    // ASSERT - standard의 credit과 additions의 credit은 모두 동일
    return new NumExpr(basicCredit + additionalCredit).setMsg(`${expr.message}의 학점 합`);
}

export function Among(expr: LecsExpr, lecs: Lecture[]): LecsExpr {
    return new LecsExpr(union(expr.lectures, lecs)).setMsg(
        `${expr.message} 중에서 ${expr.lectures.map((l) => l.code)}`
    );
}

export function Approve(expr: LecsExpr, lecs: Lecture[]): LecsExpr {
    return new LecsExpr([...expr.lectures, ...lecs], expr.options).setMsg(
        `${expr.message} 중에서 ${expr.lectures.map((l) => l.code)}을 수강 완료로 인정될 때`
    );
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ // TODO - remove this line
export function Filter(_expr: LecsExpr, _query: object): LecsExpr {
    return new LecsExpr([]);
    // throw new Error("not yet implemented");
}

export function ReplaceableWith(expr: LecsExpr, standard: LecExpr, additions: LecsExpr): LecsExpr {
    const substitutes = [...expr.options.substitutes, [standard, additions] as [LecExpr, LecsExpr]];
    const subMsg = substitutes
        .map(([std, adds]): [string, string[]] => [std.lecture.code, adds.lectures.map((l) => l.code)])
        .map(([std, adds]) => `${std}는 ${adds.join(", ")} 중 하나로`);
    const options = { ...expr.options, substitutes };
    return new LecsExpr(expr.lectures, options).setMsg(
        `${expr.message} 중에서 ${subMsg.join(", ")} 대체 수강이 인정될 때`
    );
}

export function Take(expr: LecsExpr, allLecs: LecsExpr): BoolExpr {
    const contain = expr.lectures.every((lec) => has(allLecs.lectures, lec));
    return new BoolExpr(contain).setMsg(`${expr.lectures.map((l) => l.code)}을 모두 수강 `);
}
