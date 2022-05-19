// createReadStream -> parse -> filtrar por região -> transformar o lucro em float -> marcar como fraude "vermelho" -> stdout
// Readable -> Transform (lib) -> Transform -> Transform -> Transform -> Writable stdout

const { createReadStream } = require('fs')
const { join } = require('path')
const { Transform } = require('stream')
const { pipeline } = require('stream/promises')

const { parse } = require('csv-parse')
const { bgRed, white } = require('chalk')

const salesCsvPath = join(__dirname, 'files', 'sales.csv')

const ColumnNames = [
  'region',         // Region
  'country',        // Country
  'itemType',       // Item Type
  'salesChannel',   // Sales Channel
  'orderPriority',  // Order Priority
  'orderDate',      // Order Date
  'orderId',        // Order ID
  'shipDate',       // Ship Date
  'unitsSold',      // Units Sold
  'unitPrice',      // Unit Price
  'unitCost',       // Unit Cost
  'totalRevenue',   // Total Revenue
  'totalCost',      // Total Cost
  'totalProfit',    // Total Profit
]

const csvParser = () => 
  parse({
    columns: ColumnNames,
    skipEmptyLines: true,
    delimiter: ',',
    trim: true,
  })

const regionFilter = region =>
  new Transform({
    objectMode: true,
    transform(sale, _encoding, callback){
      if (sale.region === region) {
        callback(undefined, sale)
      } else {
        callback()
      }
    }
  })

const profitParser = () =>
  new Transform({
    objectMode: true,
    transform(sale, _encoding, callback) {
      callback(undefined, {
        ...sale,
        totalProfit: parseFloat(sale.totalProfit),
      })
    }
  })

const profitHighlighter = (threshold) => 
  new Transform({
    objectMode: true,
    transform({ orderId, totalProfit }, _encoding, callback) {
      const line = `${orderId}: ${totalProfit}\n`
      if (totalProfit >= threshold) {
        callback(undefined, bgRed(white(line)))
      } else {
        callback(undefined, line)
      }
    }
  })

const region = 'Europe'
const profitThreshold = 50_000.00

pipeline(
  createReadStream(salesCsvPath),
  csvParser(),
  regionFilter(region),
  profitParser(),
  profitHighlighter(profitThreshold),
  process.stdout
)
  .then(() => console.log('Pipeline deu certo!'))
  .catch(error => console.error('Pipeline deu ruim :(', error))

