import subjects from "./dumps/otldump_211028_subject.json" assert { type: "json" };
// subjects = subjects.filter(s => s.fields.latest_written_datetime !== null);

const models = new Set(subjects.map(s => s.model));
// console.log([...models].map(model => [model, subjects.filter(s => s.model === model).length]));

const courses = subjects.filter(s => s.model === "subject.course");
const typeEns = new Set(courses.map(s => s.fields.type_en));
const typeEnCount = [...typeEns].map(type_en => [type_en, courses.filter(s => s.fields.type_en === type_en).length]);
// console.log(type_en_count.sort((a, b) => b[1] - a[1]));
// console.log(courses.filter(c => c.fields.type_en === "Basic Elective")[0]);

const lecFields = subjects
    .filter(s => s.model === "subject.lecture")
    .map(s => [s.fields.old_code, s.fields.credit, s.fields.year]); // s.fields.title_en,
const n = new Map(
    // lecFields
    //     .map(code => {
    //         const lecFieldsWithCode = lecFields.filter(([c, a_, b_]) => c === code);
    //         const creditYear = new Map();
    //         lecFieldsWithCode.forEach(([code_, credit_, year_]) => {
    //             if (creditYear.has(credit_)) { creditYear.get(credit_).add(year_); }
    //             else { creditYear.set(credit_, new Set(year_)); }
    //         });
    //         return [code, creditYear];
    //     })
);
// console.log(n);

// [...n.keys()].forEach(k => {
//     const q = new Map();
//     n.forEach(([key, value]) => { if (q.has(key)) { q.get(key).push(value); } else { q.set(key, [value]); } });
//     n.set(k, q);
// });
console.log(
    lecFields
        .map(code => {
            const lecFieldsWithCode = lecFields.filter(([c, a_, b_]) => c === code);
            const creditYear = new Map();
            lecFieldsWithCode.forEach(([code_, credit_, year_]) => {
                if (creditYear.has(credit_)) { creditYear.get(credit_).add(year_); }
                else { creditYear.set(credit_, new Set(year_)); }
            });
            return [code, creditYear];
        })
        .filter(([key, value]) => value.size != 0)
    // console.log([...n.entries()].filter(([p, l]) => l.size != 1 && l.size != 0).map(([p, l]) => l.size));
);
// console.log([...n.entries()].filter(([k, v]) => v.size != 0));
// console.log([...n.values()].filter((v) => v.length != 0).length);
// console.log(courses.filter(c => c.fields.type_en === "Major Elective").length);
// console.log(courses[42])

// console.log(new Set(courses.map(s => [s.fields.type, s.fields.type_en])));
// const reviews = require("./otldump_211028_review.json");
// const models = new Set(reviews.map(r => r.model));
// console.log([...models].map(model => [model, reviewse.filter(s => s.model === model).length]))