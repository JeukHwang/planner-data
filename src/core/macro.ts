import { BoolExpr } from "./expr";

export function And(...exprs: BoolExpr[]): BoolExpr {
    return new BoolExpr(exprs.map((expr) => expr.boolean).every((v) => v === true));
}

export function Or(...exprs: BoolExpr[]): BoolExpr {
    return new BoolExpr(exprs.map((expr) => expr.boolean).some((v) => v === true));
}

export function Not(expr: BoolExpr): BoolExpr {
    return new BoolExpr(!expr.boolean);
}

export function If<T>(predicate: BoolExpr, trueExpr: T, falseExpr = new BoolExpr(true) as T): T {
    return predicate.boolean ? trueExpr : falseExpr;
}

export function Ifnot<T>(predicate: BoolExpr, falseExpr: T, trueExpr = new BoolExpr(true) as T): T {
    return predicate.boolean ? falseExpr : trueExpr;
}
