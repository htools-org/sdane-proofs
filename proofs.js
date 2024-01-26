const { StatelessDANECertificate } = require('stateless-dane')

/**
 * @param {string} domain
 * @param {object} options
 * @param {boolean} options.parsed
 * @param {string} options.resolverIP
 * @param {number} options.resolverPort
 */
async function getDnssecProof(nodeClient, domain, options = {}) {
  const cert = new StatelessDANECertificate(nodeClient, domain, {
    resolverIP: options.resolverIP,
    resolverPort: options.resolverPort,
  })
  const dnssecExt = await cert._getDnssecChainExtension()

  if (options.parsed) {
    return dnssecExt.getJSON(true).extnValue
  } else {
    // not parsed json! hex encoded value
    return dnssecExt.extnValue.getJSON()
  }
}

/**
 * @param {string} domain
 * @param {object} options
 * @param {boolean} options.parsed
 */
async function getUrkelProof(nodeClient, domain, options = {}) {
  const cert = new StatelessDANECertificate(nodeClient, domain)
  const urkelExt = await cert._getUrkelProofExtension()

  if (options.parsed) {
    return urkelExt.getJSON(true).extnValue
  } else {
    // not parsed json! hex encoded value
    return urkelExt.extnValue.getJSON()
  }
}


module.exports = { getDnssecProof, getUrkelProof }
