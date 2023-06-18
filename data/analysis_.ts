
const subjects = require("../data/dumps/otldump_211028_subject.json");

const lecs = subjects.filter((s) => s.model === "subject.course");
export const lecList: Lecture[] = lecs.map(
    (rawLec): Lecture => ({
        title: { ko: rawLec.fields.title, en: rawLec.fields.title_en },
        code: rawLec.fields.old_code,
        credit: new Map(lecs.map((s) => [s.fields.year, s.fields.credit])),
        credit_au: new Map(lecs.map((s) => [s.fields.year, s.fields.credit_au])),
    })
);
// subjects = subjects.filter(s => s.fields.latest_written_datetime !== null);

// const models = new Set(subjects.map(s => s.model));
// console.log([...models].map(model => [model, subjects.filter(s => s.model === model).length]));

// const courses = subjects.filter(s => s.model === "subject.course");
// const type_ens = new Set(courses.map(s => s.fields.type_en));
// const type_en_count = [...type_ens].map(type_en => [type_en, courses.filter(s => s.fields.type_en === type_en).length]);
// console.log(type_en_count.sort((a, b) => b[1] - a[1]));
// console.log(courses.filter(c => c.fields.type_en === "Basic Elective")[0]);

// console.log(courses.filter(c => c.fields.type_en === "Major Elective").length);
// console.log(courses[42])

// console.log(new Set(courses.map(s => [s.fields.type, s.fields.type_en])));
// const reviews = require("./otldump_211028_review.json");
// const models = new Set(reviews.map(r => r.model));
// console.log([...models].map(model => [model, reviewse.filter(s => s.model === model).length]))
