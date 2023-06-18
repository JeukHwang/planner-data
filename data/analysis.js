import assert from "node:assert";
import subjects from "./dumps/otldump_211028_subject.json" assert { type: "json" };

const unique = (list) => [...new Set(list)];
const increasingOrder = (array) => array.sort((a, b) => a - b);
const str = (object) => JSON.stringify(object);
const isEqualSet = (s1, s2) => s1.size === s2.size && [...s1].every((value) => s2.has(value));
const isEqualArray = (s1, s2) => s1.length === s2.length && s1.every((value) => s2.includes(value));

function getValue(array, key) {
    return new Set(array.map((element) => element[key]));
}

function getKeyIfCommon(array) {
    const keys = new Set(array.map(Object.keys).flat());
    array.forEach((element) => {
        assert.deepStrictEqual(increasingOrder(Object.keys(element)), increasingOrder(Array.from(keys.values())));
    });
    return keys;
}

function classify(array) {
    const possibleType = ["string", "boolean", "number"];
    assert.ok(
        array.every((element) => element !== undefined),
        "All element in array should have value"
    );
    assert.ok(
        array.every((element) => element === null || typeof possibleType.includes(element)),
        "All element in array should have proper type"
    );
    return unique(array).map((value) => [value, array.filter((v) => v === value)]);
}

function classifyCount(array) {
    const possibleType = ["string", "boolean", "number"];
    assert.ok(
        array.every((element) => element !== undefined),
        "All element in array should have value"
    );
    assert.ok(
        array.every((element) => element === null || typeof possibleType.includes(element)),
        "All element in array should have proper type"
    );
    return unique(array).map((value) => [value, array.filter((v) => v === value).length]);
}

function fields(array, string) {
    assert.ok(array.every((s) => Object.keys(s.fields).includes(string)));
    return array.map((s) => s.fields[string]);
}

function toSearchString(s) {
    return `"model": "${s.model}",\n  "pk": ${s.pk},`;
}

function toYearSem(s) {
    return `${s.fields.year}-${s.fields.semester}`;
}

function toSimple(s) {
    return { code: s.fields.old_code, credit: s.fields.credit, credit_au: s.fields.credit_au, year_sem: toYearSem(s) };
}

function creditChangeOverTimeForSameCode() {
    const simpleLectures = subjects
        .filter((s) => s.model === "subject.lecture")
        .filter((s) => s.fields.year >= 2016)
        .map((s) => {
            return { code: s.fields.old_code, credit: s.fields.credit, year: `${s.fields.year}-${s.fields.semester}` };
        });
    const uniqueCodes = unique(simpleLectures.map((lec) => lec.code));
    const lecsSortedByCode = uniqueCodes.map((code) => [code, simpleLectures.filter((lec) => lec.code === code)]);
    const yearsSortedByCredit_SortedByCode = lecsSortedByCode.map(([code, lecs]) => {
        const uniqueCredits = increasingOrder(unique(lecs.map((lec) => lec.credit)));
        const yearsSortedByCredit = uniqueCredits.map((credit) => [
            credit,
            increasingOrder(unique(lecs.filter((lec) => lec.credit === credit).map((lec) => lec.year))),
        ]);
        return [code, yearsSortedByCredit];
    });

    // console.log(JSON.stringify(yearsSortedByCredit_SortedByCode[0]));
    console.log(
        yearsSortedByCredit_SortedByCode
            .filter(([code, yearsSortedByCredit]) => yearsSortedByCredit.length != 1)
            .map(
                ([code, yearsSortedByCredit]) =>
                    `${code}${yearsSortedByCredit
                        .map(([credit, years]) => `\n\t${credit} - ${years.join(", ")}`)
                        .join("")}`
            )
            .join("\n")
    );
    //
}

function analyze() {
    // subjects = subjects.filter(s => s.fields.latest_written_datetime !== null);

    // Lecture = new Course(); // Lecture는 특정 시간에 특정 사람에 의해 열린 Course

    const subjectsKey = getKeyIfCommon(subjects);
    console.log(subjectsKey);
    assert.ok(subjectsKey.has("model"));

    const subjectsModelKey = getValue(subjects, "model");
    console.log(subjectsModelKey);
    assert.ok(subjectsModelKey.has("subject.course"));
    assert.ok(subjectsModelKey.has("subject.lecture"));

    const courses = subjects.filter((s) => s.model === "subject.course");
    const lectures = subjects.filter((s) => s.model === "subject.lecture");
    const coursesFieldsKey = getKeyIfCommon(courses.map((s) => s.fields));
    // old_code department type type_en title title_en summury grade_sum load_sum speech_sum review_total_weight grade load speech latest_written_datetime professors related_courses_prior related_courses_posterior
    const lecturesFieldsKey = getKeyIfCommon(lectures.map((s) => s.fields));
    // code old_code year semester department class_no title title_en type type_en audience credit num_classes num_labs credit_au limit is_english deleted course num_people common_title common_title_en class_title class_title_en grade_sum load_sum speech_sum review_total_weight grade load speech professors

    // console.log(Array.from(coursesFieldsKey).join(" ")+"\n", Array.from(lecturesFieldsKey).join(" "));

    // console.log(courses.filter(s => typeof s.fields.latest_written_datetime === "object")[0]);
    // console.log(classify(fields(toSimple(lectures), "code")).map(([code, lecs]) => [code, classify(lecs, "credit")]));

    // Doubt
    // console.log(classifyCount(fields(courses, "latest_written_datetime"))); // lastest_written_datetime이 왜 null인 것인가?
    // console.log(classifyCount(fields(courses, "type_en")).sort((a, b) => b[1] - a[1])); // type_en이 지나치게 세분화된 경우가 존재; 필요없는 경우...
    // console.log(lectures.filter(s => (s.fields.credit === 0 && s.fields.credit_au === 0)).length); // credit과 credit_au가 모두 0인 과목은 뭘까?
    // creditChangeOverTimeForSameCode();
}

function make() {
    // const courses = subjects.filter((s) => s.model === "subject.course");
    const lectures = subjects
        .filter((s) => s.model === "subject.lecture")
        .filter((s) => s.fields.year >= 2016)
        // .slice(0, 40);
    // console.log(lectures);
    // console.log(lectures.length);
    console.log(classifyCount(lectures.map(l => l.fields.type_en)))
}

// analyze();
make();


// SU인가?
// const SU = subjects
//     .filter(s => s.model === "subject.lecture")
//     .filter(s => ["S", "U"].includes(s.fields.class_no))

//     .filter(lec => lec.fields.old_code === "ED101")
//     .map(s => { return { "code": s.fields.old_code, "credit": s.fields.credit, "year": `${s.fields.year}-${s.fields.semester}` }; });
// console.log(ED101);

// // [...n.keys()].forEach(k => {
// //     const q = new Map();
// //     n.forEach(([key, value]) => { if (q.has(key)) { q.get(key).push(value); } else { q.set(key, [value]); } });
// //     n.set(k, q);
// // });
// console.log(
//     simpleLectures
//         .map(code => {
//             const lecFieldsWithCode = simpleLectures.filter(([c, a_, b_]) => c === code);
//             const creditYear = new Map();
//             lecFieldsWithCode.forEach(([code_, credit_, year_]) => {
//                 if (creditYear.has(credit_)) { creditYear.get(credit_).add(year_); }
//                 else { creditYear.set(credit_, new Set(year_)); }
//             });
//             return [code, creditYear];
//         })
//         .filter(([key, value]) => value.size != 0)
//     // console.log([...n.entries()].filter(([p, l]) => l.size != 1 && l.size != 0).map(([p, l]) => l.size));
// );
// // console.log([...n.entries()].filter(([k, v]) => v.size != 0));
// // console.log([...n.values()].filter((v) => v.length != 0).length);
// // console.log(courses.filter(c => c.fields.type_en === "Major Elective").length);
// // console.log(courses[42])

// // console.log(new Set(courses.map(s => [s.fields.type, s.fields.type_en])));
// // const reviews = require("./otldump_211028_review.json");
// // const models = new Set(reviews.map(r => r.model));
// // console.log([...models].map(model => [model, reviewse.filter(s => s.model === model).length]))
