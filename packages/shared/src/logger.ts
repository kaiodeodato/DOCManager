export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

export type StructuredLog = {
  level: LogLevel;
  msg: string;
  ts: string;
  service?: string;
  fields?: LogFields;
};

export type Logger = {
  child(fields: LogFields): Logger;
  debug(msg: string, fields?: LogFields): void;
  info(msg: string, fields?: LogFields): void;
  warn(msg: string, fields?: LogFields): void;
  error(msg: string, fields?: LogFields): void;
};

function emit(entry: StructuredLog, sink: (line: string) => void): void {
  sink(JSON.stringify(entry));
}

/**
 * JSON-lines structured logger for workers and BFF (E15.03).
 */
export function createLogger(
  service: string,
  baseFields: LogFields = {},
  sink: (line: string) => void = console.log,
): Logger {
  const write = (level: LogLevel, msg: string, fields?: LogFields): void => {
    emit(
      {
        level,
        msg,
        ts: new Date().toISOString(),
        service,
        fields: { ...baseFields, ...fields },
      },
      sink,
    );
  };

  return {
    child(fields: LogFields): Logger {
      return createLogger(service, { ...baseFields, ...fields }, sink);
    },
    debug: (msg, fields) => write("debug", msg, fields),
    info: (msg, fields) => write("info", msg, fields),
    warn: (msg, fields) => write("warn", msg, fields),
    error: (msg, fields) => write("error", msg, fields),
  };
}
