'use strict';

const api = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
// const {
//   getNodeAutoInstrumentations,
// } = require('@opentelemetry/auto-instrumentations-node');
const hepi = require("./newHapiIns/instrumentations")
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider();

  let exporter;
  
  exporter = new JaegerExporter({ serviceName });
  
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new hepi(),
      new HttpInstrumentation(),
    ],
  });
  console.log("after registerInstrumentations")

  return api.trace.getTracer('forum-app');
};