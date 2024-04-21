"use strict";

// eslint-disable-next-line import/order
const tracer = require("./tracer")("example-hapi-client");

const api = require("@opentelemetry/api");
const axios = require("axios").default;

function makeRequest() {
  const span = tracer.startSpan("client.loginRequest()", {
    kind: api.SpanKind.CLIENT,
  });
  let session;
  api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: "parrow123",
          password: "parrow123",
        }),
      };

      const res = await axios.request(config);
      session = res.data;
      span.setStatus({ code: api.SpanStatusCode.OK });
      console.log(res.statusText);
    } catch (e) {
      span.setStatus({ code: api.SpanStatusCode.ERROR, message: e.message });
    }
    span.end();
    console.log(
      "Sleeping 5 seconds before shutdown to ensure all records are flushed."
    );
    setTimeout(() => {
      console.log("Completed.");
    }, 5000);
  });
  api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/auth/me",
        headers: {
          Cookie: session,
        },
      };

      const res = await axios.request(config);
      span.setStatus({ code: api.SpanStatusCode.OK });
      console.log(res.statusText);
    } catch (e) {
      span.setStatus({ code: api.SpanStatusCode.ERROR, message: e.message });
    }
    span.end();
    console.log(
      "Sleeping 5 seconds before shutdown to ensure all records are flushed."
    );
    setTimeout(() => {
      console.log("Completed.");
    }, 5000);
  });
}

// makeRequest();
makeRequest();
