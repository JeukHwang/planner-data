export interface Lecture {
  title: { ko: string; en: string };
  code: string;
  credit: number;
}

export const lecList: Lecture[] = [];

export interface Dept {
  ko: string;
  code: string;
  기필: Lecture[];
  기선: Lecture[];
  전필: Lecture[];
  전선: Lecture[];
}

export const deptList: Dept[] = [
  {
    ko: "건설및환경공학과",
    code: "CE",
    기필: [],
    기선: [],
    전필: [],
    전선: [],
  },
  { ko: "기계공학과", code: "ME", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "기술경영학부", code: "MSB", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "물리학과", code: "PH", 기필: [], 기선: [], 전필: [], 전선: [] },
  {
    ko: "바이오및뇌공학과",
    code: "BIS",
    기필: [],
    기선: [],
    전필: [],
    전선: [],
  },
  { ko: "산업디자인학과", code: "ID", 기필: [], 기선: [], 전필: [], 전선: [] },
  {
    ko: "산업및시스템공학과",
    code: "IE",
    기필: [],
    기선: [],
    전필: [],
    전선: [],
  },
  { ko: "생명과학과", code: "BS", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "생명화학공학과", code: "CBE", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "수리과학과", code: "MAS", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "신소재공학과", code: "MS", 기필: [], 기선: [], 전필: [], 전선: [] },
  {
    ko: "원자력및양자공학과",
    code: "NQE",
    기필: [],
    기선: [],
    전필: [],
    전선: [],
  },
  { ko: "융합인재학부", code: "TS", 기필: [], 기선: [], 전필: [], 전선: [] },
  {
    ko: "전기및전자공학부",
    code: "EE",
    기필: [],
    기선: [],
    전필: [],
    전선: [],
  },
  { ko: "전산학부", code: "CS", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "항공우주공학과", code: "AE", 기필: [], 기선: [], 전필: [], 전선: [] },
  { ko: "화학과", code: "CH", 기필: [], 기선: [], 전필: [], 전선: [] },
]; // Total 17

export interface Track {
  major: Dept;
  doubleMajors: Dept[];
  minors: Dept[];
  specializedMajors: Dept[];
  selfDesigned: boolean;
  year: number;
}
