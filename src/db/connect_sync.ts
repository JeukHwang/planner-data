import path from "path";
import sql from "better-sqlite3";

const absPath = path.resolve(path.resolve(), "./data/db.sqlite3");
const db = new sql(absPath);

export function querySync<T>(str: string): T[] {
    return db.prepare(str).all()
}
