import { pino } from "pino";

// Always use the full logger configuration regardless of environment
const logger: pino.Logger = pino({
  level: "trace",
  transport: {
    targets: [
      {
        level: "trace",
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true,
          destination:
            process.platform === "win32"
              ? "C:\\Windows\\Temp\\browserstack-mcp-server.log"
              : "/tmp/browserstack-mcp-server.log",
        },
      },
    ],
  },
});

export default logger;
