const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { NodeClient } = require('hs-client');
const pkg = require('./package.json')
const { getDnssecProof, getUrkelProof } = require('./proofs')

require('dotenv').config()

const nodePorts = {
  main: 12037,
  testnet: 13037,
  regtest: 14037,
  simnet: 15037
};
const network = process.env.HSD_NETWORK || 'main'
const nodeClient = new NodeClient({
  host: process.env.HSD_HTTP_HOST,
  port: parseInt(process.env.HSD_HTTP_PORT) || nodePorts[network],
  apiKey: process.env.HSD_API_KEY,
});

const app = express()
app.use(cors())
app.use(helmet())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  return res.redirect(pkg.homepage)
})

app.get('/proofs/:domain', async (req, res) => {
  const domain = req.params.domain;

  // FQDN validate domain (modified from https://regexr.com/3g5j0)
  if (!/^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){0,127}[a-z0-9-]+\.?)$/gi.test(domain)) {
    return res.status(400).json({ error: 'Bad domain.' })
  }

  const port = parseInt(req.query.port, 10);

  const options = {
    // json object instead of hex encoded value
    parsed: req.query.parsed !== undefined,

    // domain port for DNSSEC/TLSA
    port: isNaN(port) ? 443 : port,

    // for delv (dnssec chain)
    resolverIP: process.env.SDANE_RESOLVER_IP,
    resolverPort: process.env.SDANE_RESOLVER_PORT,
  }

  const dnssec = req.query.dnssec !== undefined
  const urkel = req.query.urkel !== undefined

  console.log(domain, { dnssec, urkel, parsed: options.parsed, port: options.port });

  const promises = [];
  const proofs = {};

  if (dnssec) {
    promises.push(getDnssecProof(nodeClient, domain, options).then(proof => proofs.dnssec = proof))
  }

  if (urkel) {
    promises.push(getUrkelProof(nodeClient, domain, options).then(proof => proofs.urkel = proof))
  }

  try {
    await Promise.all(promises)
    return res.json(proofs)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message ?? 'An error occured.' })
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})