"use strict";

const api = require("@opentelemetry/api");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require("@opentelemetry/sdk-metrics");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");
const { Resource } = require("@opentelemetry/resources");
const {
  SEMRESATTRS_SERVICE_NAME,
} = require("@opentelemetry/semantic-conventions");
const logsAPI = require("@opentelemetry/api-logs");
const {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} = require("@opentelemetry/sdk-logs");
const {
  WinstonInstrumentation,
} = require("@opentelemetry/instrumentation-winston");
const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg");
const hepi = require("./newHapiIns/instrumentations");
const {
  IORedisInstrumentation,
} = require("@opentelemetry/instrumentation-ioredis");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const process = require("process");

// To start a logger, you first need to initialize the Logger provider.
const loggerProvider = new LoggerProvider();
// Add a processor to export log record
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

const instrumentations = [
  new hepi(),
  new HttpInstrumentation(),
  new IORedisInstrumentation(),
  new PgInstrumentation(),
  new WinstonInstrumentation(),
];

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations,
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "forum-app",
  }),
});

sdk.start();

const shutdown = () => {
  sdk
    .shutdown()
    .then(
      () => console.log("SDK shut down successfully"),
      (err) => console.log("Error shutting down SDK", err)
    )
    .finally(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = (_) => {
  return api.trace.getTracer("forum-app");
};
