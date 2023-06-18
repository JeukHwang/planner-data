import { createWriteStream, ReadStream } from "fs";
import { stringify } from "JSONStream";
import { Transform } from "stream";

export function saveJSON(relPath: string, data) {
    const transformer = new Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
            callback(data);
        },
    });
    const output = createWriteStream(relPath, "utf-8");

    new ReadStream().pipe(transformer).pipe(stringify()).pipe(output);

    // https://gist.github.com/jozefcipa/79d1383dc265d142e73a7f29119bea6d
    // https://stackoverflow.com/questions/65385002/create-big-json-object-js
}
