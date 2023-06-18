import path from "path";
import { mapToLecture, readExcel } from "./IO/excel";
import type { Track } from "./core/type";
import { User, UserTrack } from "./core/user";
import { AEvalidator } from "./rule/AE";
async function check(relPath: string, track: Track, year: number): Promise<void> {
    const absPath = path.resolve(path.resolve(), relPath);
    const userLectures = await readExcel(absPath);
    const user = new User(userLectures.map(mapToLecture), track, year);
    console.log(new AEvalidator(user).notice());
}

async function main(): Promise<void> {
    const excelRelPath = "./data/dumps/grade_20220768.xlsx";
    // const track = new UserTrack("AE", ["EE"], ["ID"], ["CS"], false);
    const track = new UserTrack("CS", ["ID"], [], [], false);
    const year = 2022;
    await check(excelRelPath, track, year);
}

await main();
