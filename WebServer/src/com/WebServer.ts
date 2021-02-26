import {Server} from 'ws';
import {EngineWrapper} from 'perso-chess-engine';

export class WebServer {
    server: Server;
    engine: EngineWrapper; 

    constructor(port: number) {
        this.server = new Server({
            port
        });

        this.server.on('connection', this.handleConnection.bind(this));

        this.engine = new EngineWrapper(1000);
    }

    handleConnection (socket: WebSocket) {
        socket.onmessage = async (event: MessageEvent) => {
            try {
                const fen = event.data;
                console.log(fen);
                const move = await this.engine.getNextMove(fen);
                socket.send(JSON.stringify(move));
            } catch (error) {
                console.log(error);
                socket.send(error);
            }
        };
    }

}