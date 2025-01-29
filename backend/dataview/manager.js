import WebSocket, { WebSocketServer } from "ws";
import { info_log } from "../util";

class _DataViewManager {

    port = 35529;
    webSocketServer;

    constructor() {

        this.webSocketServer = new WebSocketServer({
            port: this.port,
        }, () => {
            info_log("started websocket on port " + this.port);
        });

    }

    

}


export const DateViewManager = new _DataViewManager();