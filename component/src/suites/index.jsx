import React, {PropTypes} from 'react'
import Suite from './suite'
import searchSuites from '../search-suites'

import clone from 'clone'

let hideSuites = (suites, hidden) => {
  suites = clone(suites)
  suites = suites.filter(suite => {
    return hidden.suites[suite._uuid] !== true
  })

  suites.forEach(suite => {
    if (suite.properties && hidden.properties[suite.properties._uuid]) delete suite.properties

    if (suite.tests) {
      suite.tests = suite.tests.filter(test => {
        return hidden.tests[test._uuid] !== true
      })
    }
  })
  return suites
}

let Suites = ({suites = [], search, collapsed, hidden, onToggle}) => {
  suites = searchSuites(suites, search)
  suites = hideSuites(suites, hidden)
  return <section className='section suites'>
    <div className='container'>{
        suites.map(suite => <Suite
          collapsed={collapsed}
          hidden={hidden}
          uuid={suite._uuid}
          onToggle={onToggle}
          key={`suite-${suite._uuid}`}
          name={suite.name}
          status={suite.status}
          properties={suite.properties}
          tests={suite.tests}
          />
        )
      }</div>
  </section>
}

Suites.propTypes = {
  suites: PropTypes.array,
  search: PropTypes.object.isRequired,
  collapsed: PropTypes.object.isRequired,
  hidden: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default Suites
