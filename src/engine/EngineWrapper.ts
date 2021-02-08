import {spawn, ChildProcess, Serializable} from 'child_process'

export class EngineWrapper {

    engineProcess: ChildProcess;
    timeLimit: number;

    constructor(time: number) {
        this.engineProcess = spawn('stockfish');
        this.engineProcess.on('error', this.onError.bind(this));
        //this.engineProcess.stdout?.on('data', this.onMessage.bind(this));
        this.timeLimit = time;
        this.treatMessage = this.treatMessage.bind(this);
        
    }

    onError(error: Error) {
        console.error(error);
    }

    onMessage(message: Buffer) {
        console.log('message', message.toString() );
    }

    treatMessage(text: string): string|undefined {
        const matches = /bestmove ([^ ]*) /.exec(text);
        if (matches && matches.length) {
            return matches[1];
        }
        return undefined;
    }

    async getNextMove(fen: string): Promise<string> {
        return new Promise( (resolve, reject) => {
            let timeOut = setTimeout( () => {
                reject('engine has timed out !!!');
            }, this.timeLimit * 1.5);
            this.engineProcess.stdout?.on('data', (message: Buffer) => {
                let text = message.toString();
                let move = this.treatMessage(text);
                if (move) {
                    clearTimeout(timeOut);
                    resolve(move);
                }
            });
            this.engineProcess.stdin?.write('position fen '+fen+'\n');
            this.engineProcess.stdin?.write('go movetime '+this.timeLimit+'\n');
        });
    }

}