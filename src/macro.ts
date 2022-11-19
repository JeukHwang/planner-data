import fs from "fs";
import path from "path";
import { deptList } from "./core/constant";

export function absPath(relPath: string): string {
    return path.join(path.resolve(), "./src", relPath);
}

export function rename(relPath: string) {
    fs.readdirSync(absPath(relPath)).forEach((fileName) => {
        const koDept = fileName.split("_")[1];
        const { code } = deptList.find((d) => d.ko === koDept)!;
        const oldPath = path.join(absPath(relPath), fileName);
        const newPath = path.join(absPath(relPath), `${code}.pdf`);
        fs.renameSync(oldPath, newPath);
    });
}

export function mkRule(relPath: string, ext: string) {
    fs.mkdirSync(absPath(relPath));
    deptList.forEach((dept) => fs.writeFileSync(path.join(absPath(relPath), `${dept.code}.${ext}`), ""));
}
