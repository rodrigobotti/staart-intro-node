const { EventEmitter } = require('events')

const { delay } = require('../helpers')

// client ->  [metrics bus] -> logar as metrics | salvar para analise

const MetricsBus = () => {
  const e = new EventEmitter({
    captureRejections: true,
  })
  .on('error', error => {
    console.error('MetricsBus capturou o erro', error)
  })

  const publish = (metric) => {
    e.emit('metric', metric)
  }

  const subscribe = (subscriber) => {
    e.on('metric', subscriber)
  }

  return {
    publish,
    subscribe,
  }
}

const bus = MetricsBus()

// { name, value, unit, timestamp }

const Metric = ({ name, value, unit }) => ({
  name,
  value,
  unit,
  timestamp: new Date(),
})

const loggerMetricsSubscriber = async (metric) => {
  await delay(10)
  console.log(JSON.stringify(metric, null, 2))
}

module.exports = {
  bus,
  MetricsBus,
  loggerMetricsSubscriber,
  Metric,
}

