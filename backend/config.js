import * as dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

const config = {};

config.environment = process.env.ENVIRONMENT;

config.publicServerPort = process.env.PUBLIC_SERVER_PORT;
config.privateServerPort = process.env.PRIVATE_SERVER_PORT;

export async function verifyCorrectConfiguration() {

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
            console.log(`config value '${name}' is undefined`);
            throw new Error();
        }

    });

    console.log("all environment values are assigned");

}

export default config;