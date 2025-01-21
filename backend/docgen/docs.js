import * as fs from "fs";

class DocGenerator {
    name;
    description;

    filePath;
    _file;

    constructor(name, description, filePath) {
        this.name = name;
        this.description = description;
        this.filePath = filePath;

        this._start();

        this.writeString(`# Documentation document\n${name}\n\n## Description\n${description}`);
    }

    /**
     * Writes a string to this doc's file
     * @param {string} str string to write
     * @note appends a newline character
     */
    writeString(str) { this._file.write(str + "\n"); }

    _start() { 
        // delete old file
        fs.writeFileSync(this.filePath, "", {flag:"w"});
        // create handle to new file
        this._file = fs.createWriteStream(this.filePath, {flags:"a"});
    }

    end() { this._file.end(); }
}

export class APIDocGenerator extends DocGenerator {

    constructor(name, description, filePath) {
        super(name, description, filePath);
    }

    route(routeMethod, routeName, routeDescription) {
        this.writeString(`# ${routeMethod} /${routeName}`);
        this.writeString(`${routeDescription}`);

        return this;
    }

    /**
     * 
     * @param {string} description 
     * @param {object} body json body 
     */
    request(description, body) {
        this.writeString(`## request`);
        this.writeString(`\`\`\`json`);
        this.writeString(JSON.stringify(body));
        
    }

}