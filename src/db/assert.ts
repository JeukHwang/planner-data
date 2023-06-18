import { assert } from "console";
import { sum } from "../core/util";
import { query } from "./connect";
import type { DBCourse, DBLecture } from "./type";
import { mapDBLectureToDBCourse } from "./util";

const lectures_ = (await query<DBLecture>(`SELECT * FROM subject_lecture`))!;
const lectures = lectures_.filter((lecture) => lecture.year >= 2016);
export async function getNameOfLectureForCourse() {
    // Critical point : Lecture with subtitle
    // Example :
    // - Freshman Seminar 1<School of Electrical Engineering>
    // - HSS062 Humanity/Leadership III<Introduction to Fingerstyle Guitar>

    const error = await Promise.all(
        lectures.map(async (lecture): Promise<number> => {
            const first = lecture.title_en.indexOf("<");
            const last = lecture.title_en.lastIndexOf(">");
            const withoutSubtitle = first == -1 && last == -1;
            // const regExpMatchArray = lecture.title_en.match("(.+)<(.+)>");
            // const withoutSubtitle = regExpMatchArray == null;
            if (withoutSubtitle) {
                // const title = lecture.title_en;
            } else {
                // ~~<~~><~~> 혹은 ~~<<~~>>식으로 쓰인 경우가 있어서 처음 <, 마지막 >을 이용한다
                // subject_lecture - id 672826 | old_code EMB691 | title_en Special Topic in EMBA II<<Organization design and strategy implementation>>
                assert(first != -1 && last != -1, "ERROR ---------------------------------");
                assert(last == lecture.title_en.length - 1, "ERROR ---------------------------------");

                let title = lecture.title_en.slice(0, first);
                // 이름 바뀜 - 현재 course의 title_en은 바뀌었으나 예전 lecture이 남아있다
                if (lecture.old_code == "ITM800" && title == "Special Topics(3) in Management of Technology") {
                    title = "Special Topics(3) in Innovation and strategy";
                }
                if (
                    lecture.old_code === "GT833" &&
                    title == "Special Topics on Next Generation Surface Vehicle Technology"
                ) {
                    title = "Special Topics on Electric Power Systems";
                }
                if (
                    lecture.old_code === "GT869" &&
                    title == "Special Topics on Next Generation Surface Vehicle Technology"
                ) {
                    title = "Special Topics on Electric Power Systems";
                }
                // Special Topics on Intelligent Transportation Systems
                // GT814 Special Topics in Operation & Management for Green Transportation
                // GT869 Special Topics on next generation aviation transportation system

                // const title = regExpMatchArray[1];
                // const subtitle = regExpMatchArray[2];
                // console.log(`Total: ${lecture.title_en}\nTitle: ${title}\nSubtt:${subtitle}`);

                // Verification
                const courses_ = (await query<DBCourse>(
                    `SELECT * FROM subject_course WHERE old_code = '${lecture.old_code}'`
                ))!;
                const courses = courses_.filter((course) => course.title_en.trim() === title.trim());
                if (courses.length > 2) {
                    console.log(courses, lecture);
                    return 1000;
                }
                if (courses.length == 0) {
                    console.log(lecture.old_code, title);
                    return 1;
                }
            }
            return 0;
        })
    );
    console.log(`Counter: ${sum(error)}`);
}

export async function testMapLectureToCourse(): Promise<boolean> {
    // 1 to 1
    const error = await Promise.all(
        lectures.map(async (lecture: DBLecture): Promise<boolean> => {
            const courses = await query<DBCourse>(
                `SELECT * FROM subject_course WHERE old_code = '${lecture.old_code}'`
            );
            const exist = courses !== undefined && courses.length == 1;
            if (!exist) {
                return false;
            } else {
                // const course = courses[0]!;
                return [].every((e) => e == true);
            }
        })
    );
    return error.every((e) => e === true);
}

export async function testMapCodeToCourse(): Promise<boolean> {
    const codes = await query<DBCourse["old_code"]>(`SELECT old_code FROM subject_course`);
    return codes !== undefined && codes.length === [...new Set(codes)].length;
}

export async function testGetRefinedTitle(): Promise<boolean> {
    let counter = 0;
    const error = await Promise.all(
        lectures.map(async (lecture: DBLecture): Promise<boolean> => {
            const course = await mapDBLectureToDBCourse(lecture);
            if (course.title_en != lecture.title_en) {
                // const existSubtitle
                const first = lecture.title_en.indexOf("<");
                // const last = lecture.title_en.lastIndexOf(">");
                if (first != -1) {
                    // subtitle exist
                    // console.log(`-----\nC: ${course.title_en}\nL: ${lecture.title_en}`);
                } else {
                    // title change
                    counter += 1;
                    // console.log(`-----\nC: ${course.title_en}\nL: ${lecture.title_en}`);
                }
                return false;
            }
            return true;
        })
    );
    // console.log(`Error: ${error.filter((e) => e === false).length}`);
    console.log(counter);
    return error.every((e) => e === true);
}

export async function test() {
    // await getNameOfLectureForCourse();
    const results = await Promise.all([testMapLectureToCourse(), testMapCodeToCourse()]);
    if (!results.every((e) => e === true)) {
        console.error("TEST FAILURE");
    } else {
        console.debug("TEST SUCCESS");
    }
}
