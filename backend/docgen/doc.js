/*

    Written by Coenicorn

    It's bad, but so am I >:)

*/

import * as fs from "fs";
import path from "path";
import config from "../config.js";
import { info_log } from "../util.js";
import { isPublicRoute } from "../apiKey.js";

class DocGenerator {
    name;
    description;

    filePath;
    _file;

    constructor(name, description, dirname) {
        // only generate docs when explicitly told to do so
        if (config.environment !== "dev" || config.generateDocumentation !== 1) return;

        info_log("generating documentation for " + name);

        this.name = name;
        this.description = description;
        this.filePath = path.join(dirname, "README.md");

        this._start();

        this.writeString(`# ${name}\n${description}`);

        setTimeout(() => {
            info_log("cleaning up documentation generation for " + name + "...");
            this._end();
        }, 5000);
    }

    /**
     * Writes a string to this doc's file
     * @param {string} str string to write
     * @note appends a newline character
     */
    writeString(str) { if (!this._file) return; this._file.write(str + "\n"); }

    _start() { 
        // delete old file
        fs.writeFileSync(this.filePath, "", {flag:"w"});
        // create handle to new file
        this._file = fs.createWriteStream(this.filePath, {flags:"a"});
    }

    _end() { this._file.end(); }
}

export class APIDocGenerator extends DocGenerator {

    STRING = `string`;
    NUMBER = `number`;
    STRING_OR_NULL = `string | null`;
    NUMBER_OR_NULL = `number | null`;

    POST = "POST";
    GET = "GET";

    baseURL;

    _inResponseBlock;

    /**
     * 
     * @param {string} name 
     * @param {string} description 
     * @param {string} filePath 
     * @param {string} baseURL root of the current API route (i.e. "api/auth")
     */
    constructor(name, description, filePath, baseURL) {
        super(name, description, filePath);

        this.baseURL = baseURL;

        this._inResponseBlock = 0;
    }

    route(routeName, routeMethod, routeDescription, isPublic = false) {
        this.writeString(`## \`${routeMethod} ${this.baseURL}/${routeName}\` ${this._toIsPublicString(isPublic)}`);
        this.writeString(`${routeDescription}`);

        this.endResponseBlock();

        return this;
    }

    /**
     * document api request
     * @param {string} description 
     * @param {object} body json body 
     */
    request(body, description) {
        this.endResponseBlock();

        this.writeString(`## request`);
        if (description !== null && description !== undefined) this.writeString(description);
        if (body === undefined || body === null) return this;
        this.writeString(`\`\`\`javascript`);
        this.writeString(`// request body`)
        this.writeString(this._objToString(body));
        this.writeString(`\`\`\``);
        
        return this;
    }

    /**
     * document api response
     * @param {string|null} description 
     * @param {object|undefined} body json body 
     */
    response(httpCode, description, body) {
        if (!this._inResponseBlock) {
            this.writeString(`## response`);
            this.startResponseBlock();
        }
        this.writeString(`[\`${httpCode}\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) ${(description === null || description === undefined) ? "" : description}<br>`);
        if (body === undefined) return this;
        this.writeString(`\`\`\`javascript`);
        this.writeString(`// ${httpCode} response body`)


        // this.writeString("{");
        // const e = Object.entries(body);
        // for (let obj of e) {
        //     let str = `\t"${obj[0]}": ${obj[1]},`;
        //     this.writeString(str);
        // }
        // this.writeString("}");
        this.writeString(this._objToString(body));
        
        
        
        this.writeString(`\`\`\``);

        return this;
    }

    _toIsPublicString(yes) {
        let str;
        if (yes) str = "![img_public](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/public.png?raw=true)";
        else str = "![img_private](https://github.com/Coenicorn/DeGroeneWeide/blob/main/backend/docgen/private.png?raw=true)";
        return str;
    }

    startResponseBlock() {
        this._inResponseBlock = 1;
    }

    endResponseBlock() {
        this._inResponseBlock = 0;
    }

    _objToString(obj, indent = "") {
        // I wrote this pretty late at night
        // black magic >_>
        let isArray = obj.length !== undefined;

        let str = "";

        if (isArray) str += "[\n";
        else str += "{\n";

        let e = Object.entries(obj);
        for (let o of e) {
            if (obj.length === undefined) {
                str += indent + `\t"${o[0]}": `;
            } else {
                // array
                str += indent + "\t";
            }
            if (typeof (o[1]) === "object") {
                str += this._objToString(o[1], indent + "\t");
            } else {
                str += `${o[1]}`;
            }
            str += ",\n";
        }

        str += indent;

        if (isArray) str += "]";
        else str += "}";

        return str;
    }
}

const doc = new APIDocGenerator("test", "test", import.meta.dirname, "test");

doc.route("test", doc.GET, "test").response(200, "test", [
    {
        test: doc.STRING
    }
])