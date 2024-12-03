import * as dotenvx from "@dotenvx/dotenvx";
import { info_log, err_log } from "./util.js";

dotenvx.config();

const config = {};

config.environment = process.env.ENVIRONMENT;

config.publicServerPort = process.env.PUBLIC_SERVER_PORT;
config.privateServerPort = process.env.PRIVATE_SERVER_PORT;

export async function verifyCorrectConfiguration() {

    info_log("checking if configuration is complete...");

    Object.entries(config).forEach((entry, index) => {

        let name = entry[0];
        let value = entry[1];

        if (value === undefined) {
            err_log(`config value '${name}' is undefined`);
            throw new Error();
        }

    });

    info_log("all configuration values are assigned");

}

export default config;