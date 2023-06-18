export interface SubjectLecture {
    model: "subject.lecture"; // "subject.lecture";
    pk: number; // 1838007;
    fields: {
        code: string; // "B7.980";
        old_code: string; // "ME980";
        year: number; // 2020;
        semester: number; // 3;
        department: number; // 4418;
        class_no: string; // "CN";
        title: string; // "\ub17c\ubb38\uc5f0\uad6c(\ubc15\uc0ac)";
        title_en: string; // "Ph.D. Thesis";
        type: string; // "\ub17c\ubb38\uc5f0\uad6c";
        type_en: string; // "Thesis Research(MA/phD)";
        audience: number; // 8;
        credit: number; // 0;
        num_classes: number; // 0;
        num_labs: number; // 0;
        credit_au: number; // 0;
        limit: number; // 0;
        is_english: boolean; // false;
        deleted: boolean; // false;
        course: number; // 23265;
        num_people: number; // 0;
        common_title: string; // "\ub17c\ubb38\uc5f0\uad6c(\ubc15\uc0ac)";
        common_title_en: string; // "Ph.D. Thesis";
        class_title: string; // "CN";
        class_title_en: string; // "CN";
        grade_sum: number; // 0;
        load_sum: number; // 0;
        speech_sum: number; // 0;
        review_total_weight: number; // 0;
        grade: number; // 0.0;
        load: number; // 0.0;
        speech: number; // 0.0;
        professors: number[]; // [3307];
    };
}

export interface SubjectCourse {
    model: "subject.course"; // : "subject.course";
    pk: number; // : 5;
    fields: {
        old_code: string; // : "PH212";
        department: number; // : 110;
        type: string; // : "\uc804\uacf5\uc120\ud0dd";
        type_en: string; // : "Major Elective";
        title: string; // : "\uc218\ub9ac\ubb3c\ub9ac\ud559 II";
        title_en: string; // : "Mathematical Methods in Physics II";
        summury: string; // : "\ubb3c\ub9ac\ud559\uc5d0 \ud544\uc694\ud55c \uc218\ud559\uc758 \uc5ec\ub7ec \ubd84\uc57c\uc5d0 \uc775\uc219\ud574\uc9c0\ub3c4\ub85d \ud558\ub294\ub370 \ubaa9\uc801\uc774 \uc788\ub2e4. \ubb34\ud55c\uae09\uc218, \ubcf5\uc18c\uc218 \ud568\uc218\ub860, \uac10\ub9c8\ud568\uc218, \ud2b9\uc218\ud568\uc218, Fourier \uae09\uc218\uc640 \ubcc0\ud658, \uc801\ubd84\ubc29\uc815\uc2dd, \ubcc0\ubd84\ubc95 \ub4f1\uc744 \ub2e4\ub8ec\ub2e4. 3\uc2dc\uac04 \uac15\uc758\uc640 2\uc2dc\uac04\uc758 \uc5f0\uc2b5\uc744 \ud55c\ub2e4.(\uc120\uc218\uacfc\ubaa9 : PH211)";
        grade_sum: number; // : 423;
        load_sum: number; // : 402;
        speech_sum: number; // : 435;
        review_total_weight: number; // : 29;
        grade: number; // : 14.5862068965517;
        load: number; // : 13.8620689655172;
        speech: number; // : 15.0;
        latest_written_datetime: string; // : "2021-06-25T04:36:56Z";
        professors: number[]; // [5, 52, 59, 73, 1116, 1122, 3601];
        related_courses_prior: number[]; // [];
        related_courses_posterior: number[]; // [];
    };
}

export interface SubjectDepartment {
    model: "subject.department";
    pk: number; // 150;
    fields: {
        num_id: number; // "23",
        code: string; // "CH",
        name: string; // "\ud654\ud559\uacfc",
        name_en: string; // "Chemistry",
        visible: boolean; // true
    };
}

export type Subjects = (SubjectLecture | SubjectCourse | SubjectDepartment)[];
