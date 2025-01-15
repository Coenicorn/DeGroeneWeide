// import config from "../config.js";
// import { createTestMockDataBase } from "../db.js";

before(async () => {

    // THIS DISABLES LOGGING
    // comment when logging is required...?
    // pretty whack implementation, actually ass
    global.test_nolog = 1;

    await import("../api.js");

    // await createTestMockDataBase();

    // console.log(config.environment);
    

});