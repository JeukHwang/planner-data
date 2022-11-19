import { User, UserTrack } from "./core/user";
import { AEvalidator } from "./rule/AE";

const user = new User([], new UserTrack("AE", ["EE"], ["ID"], ["CS"], false), 2022);
console.log(new AEvalidator(user).notice());
