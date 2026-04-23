import {
  configureSync,
  getConsoleSink,
  getAnsiColorFormatter,
  getJsonLinesFormatter,
  getLogger,
} from "@logtape/logtape";
import { honoLogger } from "@logtape/hono";
import { env } from "@Poneglyph/env/server";

const isDev = env.NODE_ENV === "development";

configureSync({
  sinks: {
    console: getConsoleSink({
      formatter: isDev ? getAnsiColorFormatter() : getJsonLinesFormatter(),
    }),
  },
  loggers: [
    {
      category: ["poneglyph"],
      sinks: ["console"],
      lowestLevel: isDev ? "debug" : "info",
    },
    // Silence LogTape's own startup messages
    { category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning" },
  ],
});

// Single root logger — use getChild() for different areas, like Winston/Pino
export const logger = getLogger(["poneglyph"]);

// Re-export honoLogger with skip config
export { honoLogger };

// Convenience: expose the isDev check for other modules if needed
export const isDevelopment = isDev;
