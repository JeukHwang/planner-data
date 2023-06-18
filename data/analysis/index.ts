import { saveJSON } from "./save";

const relPath = "./department.json";
saveJSON(relPath, { d: 1, q: 2 });
