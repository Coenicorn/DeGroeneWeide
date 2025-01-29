/*
    this is literally so dumb
*/
import WebSocket, { WebSocketServer } from "ws";
import { info_log } from "../util.js";
import { DataViewTypes } from "./dataviewtypes.js";

class _DataViewManager {

    port = 8080;
    webSocketServer;
    clients = [];

    constructor() {
        this.webSocketServer = new WebSocketServer({
            port: this.port,
        }, () => {
            info_log("started websocket on port " + this.port);
        });

        this.webSocketServer.on("connection", (ws) => {
            this._initWebSocketClient(ws);
        });
    }

    _initWebSocketClient(ws) {
        this.clients.push(ws);

        ws.on("close", () => {
            const index = this.clients.indexOf(ws);
            if (index !== -1) this.clients.splice(index, 1);
        })
    }

    _broadcastMessage(message) {
        for (let ws of this.clients) {
            if (ws.readyState === WebSocket.OPEN) ws.send(message);
        }
    }

    _getSQLMethodFromString(_str) {
        const str = _str.toUpperCase().trim();
        if (str.startsWith("INSERT")) return DataViewTypes.F_INSERT;
        else if (str.startsWith("SELECT")) return DataViewTypes.F_SELECT;
        else if (str.startsWith("UPDATE")) return DataViewTypes.F_UPDATE;
        else if (str.startsWith("DELETE")) return DataViewTypes.F_DELETE;
    }

    database_res(type, query, err = false) {
        const out = {};

        out.type = DataViewTypes.T_DB;
        out.sqlType = type;
        out.method = this._getSQLMethodFromString(query);
        out.source = DataViewTypes.ENTITY_DATABASE;
        out.destination = DataViewTypes.ENTITY_SERVER;
        out.content = query;
        out.isResponse = true;
        out.isError = err;

        this._broadcastMessage(JSON.stringify(out));
    }

    database_req(type, query) {
        const out = {};

        out.type = DataViewTypes.T_DB;
        out.sqlType = type;
        out.method = this._getSQLMethodFromString(query);
        out.source = DataViewTypes.ENTITY_SERVER;
        out.destination = DataViewTypes.ENTITY_DATABASE;
        out.content = query;
        out.isResponse = false;
    
        this._broadcastMessage(JSON.stringify(out));
    }

    request(req, url, method, sourceEntity) {
        const out = {};

        out.type = DataViewTypes.T_REQ;
        out.method = method;
        out.source = sourceEntity;
        out.destination = DataViewTypes.ENTITY_SERVER;
        out.content = url;
        out.isResponse = false;

        this._broadcastMessage(JSON.stringify(out));
    }

    response(res, url, method, destinationEntity) {
        const out = {};

        out.type = DataViewTypes.T_RES;
        out.method = method;
        out.source = DataViewTypes.ENTITY_SERVER;
        out.destination = destinationEntity;
        out.content = url;
        out.isResponse = true;
        out.responseCode = res.statusCode;

        this._broadcastMessage(JSON.stringify(out));
    }

}

export const DataViewManager = new _DataViewManager();