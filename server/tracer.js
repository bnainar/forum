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
const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg");
const hepi = require("./newHapiIns/instrumentations");
const {
  IORedisInstrumentation,
} = require("@opentelemetry/instrumentation-ioredis");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

module.exports = (serviceName) => {
  const instrumentations = [
    new hepi(),
    new HttpInstrumentation(),
    new IORedisInstrumentation(),
    new PgInstrumentation(),
  ];

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      // optional - default url is http://localhost:4318/v1/traces
      // url,
      // optional - collection of custom headers to be sent with each request, empty by default
      // headers: {},
    }),
    instrumentations,
    metricReader: new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    }),
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "forum-app",
    }),
  });

  sdk.start();
  return api.trace.getTracer("forum-app");
};
