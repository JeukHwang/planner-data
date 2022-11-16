import { User, UserTrack } from "./core/user";
import { AE } from "./rule/AE";

// mkRule("./rule");
// rename("../data/raw", "ts");
// console.log(lecList);

console.log("Index is executed!");
// const user = new User([], new UserTrack("CS", ["EE"], ["ID"], ["CS"], false), 2022);
const user = new User([], new UserTrack("AE", ["EE"], ["ID"], ["CS"], false), 2022);

console.log(AE.validate(user));
console.log(AE.notice(user));
