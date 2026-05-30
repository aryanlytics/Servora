import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Structured logger using Winston.
 * - Development: colorized, human-readable output
 * - Production: JSON format for log aggregation
 */
const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, service, stack, ...meta }) => {
    const svc = service ? `[${service}]` : "";
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    const stackStr = stack ? `\n${stack}` : "";
    return `${timestamp} ${level} ${svc} ${message}${metaStr}${stackStr}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

export function createLogger(serviceName: string): winston.Logger {
  const isProduction = process.env.NODE_ENV === "production";

  return winston.createLogger({
    level: isProduction ? "info" : "debug",
    defaultMeta: { service: serviceName },
    format: isProduction ? prodFormat : devFormat,
    transports: [new winston.transports.Console()],
  });
}
