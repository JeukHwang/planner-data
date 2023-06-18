let rows = document.getElementById("gradeContent").querySelectorAll("tr");
let crows = Array.from(rows).filter((r) => { return r.id.length == 4 || r.id === "0"; });
let ccrows = Array.from(crows).filter((cr) => {
    return (
        cr.querySelector("td:nth-of-type(11)").innerText != "R" &&
        cr.querySelector("td:nth-of-type(11)").innerText != "W"
    );
});
let courses = ccrows.map((cr) => {
    return {
        year: parseInt(cr.id),
        semester: cr.getAttribute("name"),
        course_id: cr.querySelector("td:nth-of-type(3)").innerText,
        code: cr.querySelector("td:nth-of-type(4)").innerText,
        name: cr.querySelector("td:nth-of-type(7)").innerText,
    };
});
console.log(JSON.stringify(courses));
