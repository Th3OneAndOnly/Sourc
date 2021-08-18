import { LoggerPool } from "./logger.js";
import {
  DOM_TOOLS_LOGGER,
  PLUGIN_LOGGER,
  CORE_LOGGER,
} from "./private-loggers.js";

const loggers = Object.freeze({
  DOMTOOLS: DOM_TOOLS_LOGGER,
  PLUGIN: PLUGIN_LOGGER,
  CORE: CORE_LOGGER,
} as const);

export const UTIL_LOGGERS_POOL = new LoggerPool(loggers);
UTIL_LOGGERS_POOL.disableAll();
