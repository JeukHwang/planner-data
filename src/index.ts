// mkRule("./rule");
// rename("../data/raw", "ts");
// console.log(lecList);

import { User, UserTrack } from "./core/user";
import { AE } from "./rule/AE";

console.log("Index is executed!");
// const user = new User([], new UserTrack("CS", ["EE"], ["ID"], ["CS"], false), 2022);
const user = new User([], new UserTrack("AE", ["EE"], ["ID"], ["CS"], false), 2022);

console.log(AE.validate(user));
// console.log(AE.requirements.map(r => r.sentence).join("\n"));
console.log(AE.notice(user));
