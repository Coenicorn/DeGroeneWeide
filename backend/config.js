import * as dotenvx from "@dotenvx/dotenvx";

async function thinkAboutYourActions() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

dotenvx.config();

const config = {};

config.environment = process.env.ENVIRONMENT;
config.generateDocumentation = process.env.GENDOC | null;

config.serverPort = process.env.SERVERPORT;

config.maxInactiveSeconds = process.env.MAX_INACTIVE_SECONDS

// API keys
config.enableAPIKey = process.env.ENABLEAPIKEY;
config.keyAdminPanel = process.env.KEYADMINPANEL;

config.enableRateLimiting = process.env.ENABLE_RATE_LIMIT;

config.googleEmailAccount = process.env.GOOGLE_EMAIL_ACCOUNT;
config.googleAppPassword = process.env.GOOGLE_APP_PASSWD;


// extra safeguard to make sure that in the production environment rate limiting AND api key checking is enabled
if (config.environment !== "dev") {
    if (config.enableAPIKey != "1") {
        console.log("\n*************************************\nWARNING api key not enabled in production environment\n*************************************");
        await thinkAboutYourActions();
    }
    if (config.enableRateLimiting != "1") {
        console.log("\n*************************************\nWARNING rate limiting not enabled in production environment\n*************************************\n");
        await thinkAboutYourActions();
    }
}


// verify configuration
(() => {

    // still uses console.log because util.js, which defines the helper functions, imports this file
    // don't want circular imports :/
    console.log("************************");
    console.log("CURRENT ENVIRONMENT: " + config.environment);
    console.log("************************");

    console.log("checking if configuration is complete...");

    Object.entries(config).forEach((entry) => {

        let name = entry[0];
        let value = entry[1];

        if (value === undefined) {
            console.log(`\n\nconfig value '${name}' is undefined`);
            console.log(`please view config.js, find the "config.${name} = process.env.SOME_OPTION" and add "SOME_OPTION = SOME_VALUE" to your .env!\n\n`);
            throw new Error();
        }

    });

    console.log("all environment values are assigned");

})()

export default config;