import assert from "assert";
import type { Lecture } from "../core/type";
import { query } from "./connect";
import { querySync } from "./connect_sync";
import type { DBCourse, DBLecture, RefinedTitle } from "./type";

// safe domain for next utility functions
const lectures_ = (await query<DBLecture>(`SELECT * FROM subject_lecture`))!;
export const lectures = lectures_.filter((lecture) => lecture.year >= 2016);

export function mapDBLectureToDBCourse(lecture: DBLecture): DBCourse {
    // many lecture to one course mapping
    const courses = querySync<DBCourse>(
        `SELECT * FROM subject_course WHERE old_code = '${lecture.old_code}' AND year = ${lecture.year} AND semester = ${lecture.semester}`
    );
    assert(courses !== undefined && courses.length == 1);
    return courses![0]!;
}

export function mapCodeToDBCourse(old_code: string): DBCourse {
    // many lecture to one course mapping
    const courses = querySync<DBCourse>(`SELECT * FROM subject_course WHERE old_code = '${old_code}'`);
    assert(courses !== undefined && courses.length == 1);
    return courses![0]!;
}

export async function getRefinedTitle(lecture: DBLecture): Promise<RefinedTitle> {
    const course = await mapDBLectureToDBCourse(lecture);
    const first = lecture.title_en.indexOf("<");
    const last = lecture.title_en.lastIndexOf(">");
    const existSubtitle = first == -1 && last == -1;
    let fromLecture;
    if (existSubtitle) {
        let title = lecture.title_en.slice(0, first);
        let subtitle = lecture.title_en.slice(first + 1, last);
        fromLecture = {
            title: { ko: lecture.title, en: title },
            subtitle: { ko: "", en: subtitle },
        };
    } else {
        fromLecture = { title: { ko: lecture.title, en: lecture.title_en } };
    }
    return { fromLecture, fromCourse: { ko: course.title, en: course.title_en } };
}

// export function mapDBCourseToDBLecture(course: DBCourse): DBLecture {
//     // one course to many lecture mapping => choose one lecture; 적당히 잘 고르기!
//     const lectures = querySync<DBLecture>(`SELECT * FROM subject_lecture WHERE old_code = '${course.old_code}'`);
//     console.log(`${course.title}`, lectures.length);
//     // lectures[0].year, lectures[0].semester
//     assert(lectures !== undefined && lectures.length == 1);
//     return lectures![0]!;
// }

export function mapDBLectureToLecture(lecture: DBLecture): Lecture {
    return {
        title: { ko: lecture.title, en: lecture.title_en },
        code: lecture.old_code,
        credit: lecture.credit,
        credit_au: lecture.credit_au,
    };
}

export function mapCodeToLecture(old_code: string): Lecture {
    const lectures = querySync<DBLecture>(
        `SELECT * FROM subject_lecture WHERE old_code = '${old_code}' ORDER BY year DESC, semester DESC`
    );
    // console.log(lectures.length);
    assert(lectures !== undefined);
    return mapDBLectureToLecture(lectures![0]!);
}
