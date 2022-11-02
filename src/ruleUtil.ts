import { Dept, deptList, lecList, Lecture, Track } from "./constant";

function sum(ns: number[]): number {
  return ns.reduce((acc, n) => acc + n, 0);
}

export function has(ls: Lecture[], l: Lecture): boolean {
  return ls.map((l_) => l_.code).includes(l.code);
}

export function unique(ls: Lecture[]): Lecture[] {
  return ls.filter(
    (l, i, ls_) => ls_.findIndex((l_) => l_.code === l.code) === i
  );
}

export function union(ls1: Lecture[], ls2: Lecture[]): Lecture[] {
  return ls1.filter((a) => ls2.some((b) => b.code === a.code));
}

/**
 * @param ls - 과목 리스트; 기본적으로 ls의 credit을 더한 값을 반환
 * @param options - option은 첫 번째와 나머지로 나뉘어진다, 나머지가 타 과 과목으로 이를 수강하면 첫 번째에 있는 과 과목으로 인정되는 것이다!
 */

export function creditSum(ls: Lecture[], options: Lecture[][] = []): number {
  return (
    sum(ls.map((l) => l.credit)) +
    sum(
      options
        .filter(
          (option) =>
            !has(ls, option[0]) && union(ls, option.slice(1)).length >= 1
        )
        .map((option) => option[0].credit)
    )
  );
}

export function among(
  target: Lecture[],
  option: Lecture[],
  n: number
): boolean {
  return union(target, option).length >= n;
}

export function lowerbound(a: number, b: number): number {
  return Math.min(a, b);
}

export function getDept(...codes: string[]): Dept[] {
  return codes.map((c) => deptList.find((d) => d.code === c)!);
}

export function getLec(...codes: string[]): Lecture[] {
  return codes.map((c) => lecList.find((l) => l.code === c)!);
}

export function ifTrackFac(
  dept: Dept,
  track: Track
): {
  M: (c: boolean) => boolean;
  DM: (c: boolean) => boolean;
  MN: (c: boolean) => boolean;
  SM: (c: boolean) => boolean;
  SD: (c: boolean) => boolean;
} {
  return {
    M: (c: boolean): boolean => (track.major === dept ? c : true),
    DM: (c: boolean): boolean =>
      track.doubleMajors.some((d) => d.code === dept.code) ? c : true,
    MN: (c: boolean): boolean =>
      track.minors.some((d) => d.code === dept.code) ? c : true,
    SM: (c: boolean): boolean =>
      track.specializedMajors.some((d) => d.code === dept.code) ? c : true,
    SD: (c: boolean): boolean =>
      track.specializedMajors.some((d) => d.code === dept.code) ? c : true,
  };
}

export function uniLecFac(
  dept: Dept,
  lecs: Lecture[]
): {
  기필: Lecture[];
  기선: Lecture[];
  전필: Lecture[];
  전선: Lecture[];
  f: (l: Lecture[]) => Lecture[];
} {
  const uniLec = {
    기필: [],
    기선: [],
    전필: [],
    전선: [],
    f: (l: Lecture[]) => union(lecs, l),
  };
  ["기필", "기선", "전필", "전선"].forEach((key) => {
    uniLec[key] = union(dept[key], lecs);
  });
  return uniLec;
}
