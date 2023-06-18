import _subjects from "../dumps/otldump_211028_subject.json" assert { type: "json" };
import type { Dept, Lecture } from "../../src/core/type";
import type { SubjectCourse, SubjectDepartment, SubjectLecture, Subjects } from "./type";
const subjects = _subjects as Subjects;

const _lectures = subjects.filter((s) => s.model === "subject.lecture") as SubjectLecture[];
const lectures = _lectures
    .filter((s) => s.fields.year >= 2016)
    .sort((a, b) => {
        const ay = a.fields.year;
        const by = b.fields.year;
        const as = a.fields.semester;
        const bs = b.fields.semester;
        if (ay < by || (ay === by && bs > as)) {
            return 1;
        } else {
            return -1;
        }
    });
const courses = subjects.filter((s) => s.model === "subject.course") as SubjectCourse[];
const departments = subjects.filter((s) => s.model === "subject.department") as SubjectDepartment[];

const deptCode = [
    "AE",
    "BIS",
    "BS",
    "CBE",
    "CE",
    "CH",
    "CS",
    "EE",
    "ID",
    "IE",
    "MAS",
    "ME",
    "MS",
    "MSB",
    "NQE",
    "PH",
    "TS",
];

export function toLecture(l: SubjectLecture): Lecture {
    return {
        title: { ko: l.fields.title, en: l.fields.title_en },
        code: l.fields.old_code,
        credit: l.fields.credit,
        credit_au: l.fields.credit_au,
    };
}

// ASSERT - old_code로 만든 equality와 code로 만든 equality의 동일성
// ASSERT - old_code 속 dept title은 실제 lecture의 dept title과 동일한가?
export const dumpDeptList: Dept[] = deptCode
    // find에서 code가 같은 경우 더 최근 것을 이용하기 위해 위에서 sort를 했다
    .map((code) => departments.find((d) => d.fields.code === code)!)
    .map((d): Dept => {
        const allLecsInDept = lectures.filter((l) => l.fields.department === d.pk);
        return {
            ko: d.fields.name,
            code: d.fields.code,
            lecture: {
                all: allLecsInDept.map(toLecture),
                기필: allLecsInDept.filter((l) => l.fields.type === "기초필수").map(toLecture),
                기선: allLecsInDept.filter((l) => l.fields.type === "기초선택").map(toLecture),
                전필: allLecsInDept.filter((l) => l.fields.type === "전공필수").map(toLecture),
                전선: allLecsInDept.filter((l) => l.fields.type === "전공선택").map(toLecture),
                심전필: [],
                연구: [],
            },
        };
    });

export const dumpLecList: Lecture[] = lectures.map(toLecture);
