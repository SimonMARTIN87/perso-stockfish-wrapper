import { readFile, writeFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import {Game} from "../com/Game";

const writeFileAsPromise = promisify(writeFile);
const readFileAsPromise = promisify(readFile);

export default class FileSaver {

    static async save(game: Game, fileName: string = 'save.fen'): Promise<void> {
        const completeFileName = join(__dirname, '/../../', fileName);
        await writeFileAsPromise(completeFileName, game.toFEN() );
    }

    static async load(fileName: string = 'save.fen'): Promise<string> {
        const content = await readFileAsPromise(fileName);
        return content.toString();
    }

}