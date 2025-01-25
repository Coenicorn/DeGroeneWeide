import { periodicActivityUpdate, deleteOldTempReservations } from "./util.js";
import { CronJob } from "cron";

new CronJob(
    "*/5 * * * *",
    deleteOldTempReservations,
    null,
    true
);

new CronJob(
    "0 */12 * * *",
    periodicActivityUpdate,
    null,
    true
);