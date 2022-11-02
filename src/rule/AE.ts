import { Lecture, Track } from "../constant";
import {
  creditSum,
  getDept,
  getLec,
  ifTrackFac,
  uniLecFac,
  union,
} from "../ruleUtil";

export function validate(lecs: Lecture[], track: Track): boolean {
  const AE = getDept("AE")[0];
  const ifTrack = ifTrackFac(AE, track);
  const uniLec = uniLecFac(AE, lecs);
  return [
    creditSum(lecs) >= 136, // http://127.0.0.1:5500/data/raw/AE.pdf#phrase=true&page=3&search=졸업이수학점:총 136학점 이상 이수
    // valid track

    // creditSum(uniLec.기선) >= 9, // L14
    ifTrack.DM(uniLec.기선.length >= 6),
    uniLec.f(getLec("MAS109", "MAS201", "MAS202")).length >= 2,
    creditSum(uniLec.f(getLec("MAS109", "MAS201", "MAS202"))) >= 9,
    ifTrack.DM(uniLec.f(getLec("MAS109", "MAS201", "MAS202")).length >= 1),
    ifTrack.DM(creditSum(uniLec.f(getLec("MAS109", "MAS201", "MAS202"))) >= 6),

    // creditSum(uniLec.전필) >= 42
    creditSum(uniLec.전필) >= 21,

    creditSum(uniLec.전선, [
        getLec("AE230", "ME231"), // 만약 학점 credit이 서로 다르면 앞쪽 따라감
        getLec("AE311", "ME311"),
        getLec("AE370", "ME301"),
    ]) >= 21,

    uniLec.f(l => l.)

    // make Expr
    // Expr.validate(lecs, track)
    // Expr.info() : show message { type: required|substitute, condition: , }
    // Expr는 약간 syntactic sugar이긴 하고 굳이 만들 필요가 없긴 한데 다음과 같은 motivation
    // 누구나 이해하기 쉽고 짧으면서도
    // js 언어-독립적(차라리 자연어 느낌)
    // 모든 경우를 다 표현가능하고 확장가능한 강력한 표현이 가능해야 함
    creditSum(uniLec.전선, [
        getLec("AE230", "ME231"), // 만약 학점 credit이 서로 다르면 앞쪽 따라감
        getLec("AE311", "ME311"),
        getLec("AE370", "ME301"),
    ]) >= 21,

  ].every((v) => v === true);
}
