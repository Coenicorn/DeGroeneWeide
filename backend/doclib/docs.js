export class DocGenerator {
    name;
    description;

    filePath;

    constructor(name, description, filePath) {
        this.name = name;
        this.description = description;
        this.filePath = filePath;
    }
}