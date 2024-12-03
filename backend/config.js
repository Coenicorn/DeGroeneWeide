import * as dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

const config = {};

config.publicServerPort = process.env.PUBLIC_SERVER_PORT;
config.privateServerPort = process.env.PRIVATE_SERVER_PORT;


export default config;