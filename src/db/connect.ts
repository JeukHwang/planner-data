import path from "path";
import sql from "sqlite3";

const absPath = path.resolve(path.resolve(), "./data/db.sqlite3");
const db = new sql.Database(absPath, sql.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.debug("Connected to the database");
    }
});

// db.close((err) => {
//     if (err) {
//         console.error(err.name, err.message);
//     } else {
//         console.log("Close the db connection");
//     }
// });

// type RemotePromise<T> = { promise: Promise<T>; resolver: Resolve<T> };
type Resolve<T> = (value: T | PromiseLike<T>) => void;
export async function query<T>(str: string): Promise<T[] | undefined> {
    let resolver: Resolve<T[] | undefined> = () => undefined;
    const promise: Promise<T[] | undefined> = new Promise<T[] | undefined>(
        (resolve: Resolve<T[] | undefined>): void => {
            resolver = resolve;
        }
    );
    db.all(str, [], (err, rows: T[]) => {
        if (err) {
            console.error(err);
            resolver(undefined);
        } else {
            resolver(rows);
        }
    });
    return promise;
}
