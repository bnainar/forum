'use strict';

// eslint-disable-next-line import/order
const tracer = require('./tracer')('example-hapi-client');

const api = require('@opentelemetry/api');
const axios = require('axios').default;

function makeRequest() {
  const span = tracer.startSpan('client.makeRequest()', {
    kind: api.SpanKind.CLIENT,
  });

  api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/auth/me',
        headers: { 
          'Cookie': 'session=4bcb3fb9-7ec7-43fb-ade3-f8e77c089555'
        }
      };
      
      const res = await axios.request(config)
      span.setStatus({ code: api.SpanStatusCode.OK });
      console.log(res.statusText);
    } catch (e) {
      span.setStatus({ code: api.SpanStatusCode.ERROR, message: e.message });
    }
    span.end();
    console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
    setTimeout(() => { console.log('Completed.'); }, 5000);
  });
}

makeRequest();