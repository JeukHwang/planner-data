import Excel from "exceljs";
import type { Lecture } from "../core/type";
import type { ExcelLecture } from "./type";

const semesters: string[] = ["봄학기", "여름학기", "가을학기", "겨울학기"];

export async function readExcel(absPath: string): Promise<ExcelLecture[]> {
    // Need to convert downloaded .xls file to .xlsx by user
    // Reference : https://stackoverflow.com/questions/58392035/how-to-read-from-xls-file-using-exceljs
    const workbook = new Excel.Workbook();
    const worksheet = (await workbook.xlsx.readFile(absPath)).getWorksheet(1);
    const dataRows = worksheet.getRows(4, worksheet.actualRowCount - 3)!;

    return Promise.all(
        dataRows.map(async (row): Promise<ExcelLecture> => {
            const year = parseInt(row.getCell(2).value as string, 10);
            const semester = semesters.indexOf(row.getCell(3).value as string);
            const isAP = year == 0; // ASSERT year >= 0 and year == 0 if and only if for AP subject; is it enough?
            const common = {
                code: row.getCell(5).value as string,
                old_code: row.getCell(6).value as string,
                title: { ko: row.getCell(9).value as string, en: row.getCell(16).value as string },
                credit: parseFloat(row.getCell(12).value as string), // ASSERT credit is always integer not float
                credit_au: parseFloat(row.getCell(13).value as string), // ASSERT credit is always integer not float
            };
            if (isAP) {
                return { time: { year: 0, semester: -1 }, ...common };
            } else {
                return {
                    time: { year, semester },
                    // type: { ko: '', en: '' },
                    ...common,
                    // type: {ko: type, en:type_en}
                };
            }
        })
    );
}

export function mapToLecture(lec: ExcelLecture): Lecture {
    return { ...lec, code: lec.old_code };
}
