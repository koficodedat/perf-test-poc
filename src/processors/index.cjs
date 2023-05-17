const before_scenarios = require('./before-scenarios.cjs')
const before_requests = require('./before-requests.cjs')
const after_responses = require('./after-responses.cjs')
const after_scenarios = require('./after-scenarios.cjs')

module.exports = {
    ...before_scenarios,
    ...before_requests,
    ...after_responses,
    ...after_scenarios
}