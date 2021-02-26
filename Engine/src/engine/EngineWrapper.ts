import {spawn, ChildProcess, Serializable} from 'child_process'

export interface EngineResult {
    move: string;
    score: string;
};

export class EngineWrapper {

    engineProcess: ChildProcess;
    timeLimit: number;
    res: EngineResult = {move: '', score: '0'};

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

    treatMessage(text: string): void {
        let matches = /bestmove ([^ ]*) /.exec(text);
        if (matches && matches.length) {
            this.res.move = matches[1];
        } else {
            matches = /score cp ([\d]*) /.exec(text);
            if (matches && matches.length) {
                this.res.score = matches[1];
            }
        }
    }

    async getNextMove(fen: string): Promise<EngineResult> {
        return new Promise( (resolve, reject) => {
            let timeOut = setTimeout( () => {
                reject('engine has timed out !!!');
            }, this.timeLimit * 1.5);
            this.res = {move:'', score: '0'};
            this.engineProcess.stdout?.on('data', (message: Buffer) => {
                let text = message.toString();
                this.treatMessage(text);
                if (this.res.move.length) {
                    clearTimeout(timeOut);
                    resolve(this.res);
                }
            });
            this.engineProcess.stdin?.write('position fen '+fen+'\n');
            this.engineProcess.stdin?.write('go movetime '+this.timeLimit+'\n');
        });
    }

}