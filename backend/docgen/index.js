import { APIDocGenerator } from "./docs.js";

const generator = new APIDocGenerator("api", "some api", "./TESTDOC.md");

generator.route("POST", "getAllCards", "gets all cards");