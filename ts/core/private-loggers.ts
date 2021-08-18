import { Logger, ConsoleLogStrategy } from "./logger.js";

export const DOM_TOOLS_LOGGER = new Logger()
  .withName("dom-tools.ts")
  .withStrategy(ConsoleLogStrategy);

export const PLUGIN_LOGGER = new Logger()
  .withName("plugin.ts")
  .withStrategy(ConsoleLogStrategy);

export const CORE_LOGGER = new Logger()
  .withName("SOURC_CORE")
  .withStrategy(ConsoleLogStrategy);
