export interface DBLecture {
    id: number;
    code: string;
    old_code: string;
    year: number;
    semester: number;
    class_no: string;
    title: string;
    title_en: string;
    type: string;
    type_en: string;
    audience: number;
    credit: number;
    num_classes: number;
    num_labs: number;
    credit_au: number;
    limit: number;
    num_people: number;
    is_english: number;
    deleted: number;
    grade_sum: number;
    load_sum: number;
    grade: number;
    load: number;
    speech: number;
    review_total_weight: number;
    course_id: number;
    department_id: number;
    class_title: string;
    class_title_en: string;
    common_title: string;
    common_title_en: string;
    speech_sum: number;
}

export interface DBCourse {
    id: number;
    old_code: string;
    type: string;
    type_en: string;
    title: string;
    title_en: string;
    summury: string;
    grade_sum: number;
    load_sum: number;
    review_total_weight: number;
    grade: number;
    load: number;
    speech: number;
    department_id: number;
    latest_written_datetime: string;
    speech_sum: number;
}

export interface RefinedTitle {
    fromLecture:
        | { title: { ko: string; en: string } }
        | { title: { ko: string; en: string }; subtitle: { ko: string; en: string } };
    fromCourse: { ko: string; en: string };
}
