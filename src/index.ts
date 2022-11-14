// mkRule("./rule");
// rename("../data/raw", "ts");
// console.log(lecList);

import { User, UserTrack } from "./core/user";
import { AE } from "./rule/AE";

console.log("Index is executed!");
const user = new User([], new UserTrack("CS", ["EE"], ["ID"], ["CS"], false), 2022);
AE.validate(user);
