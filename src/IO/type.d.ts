export interface ExcelLecture {
    readonly time: { year: number; semester: number };
    readonly code: string;
    readonly old_code: string;
    readonly title: { ko: string; en: string };
    readonly credit: number;
    readonly credit_au: number;
}