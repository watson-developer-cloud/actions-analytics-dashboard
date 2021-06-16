import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  ArrowRight16
} from '@carbon/icons-react';

import './overview-table.scss';
import { getLayeredDictCount } from "../../utils"
import moment from 'moment';

class OverviewTable extends React.Component {
    constructor(props) {
        super(props)

        this.titleDict = {
          "mostCommon": "Most common topics",
          "leastCommon": "Least common topics",
          "frequentlyFailedPrompts": "Frequently failed prompts",
          "notRecognized": "Requests not recognized"
        }
    }

    render () {
      let data = this.props[this.props.type] ?? []

      let divider = <div style={{ width: "100%", height: "1px", background: "#f4f4f4", marginBottom: "2px" }}></div>
      var tableRows = []

      // Iterate over data to build jsx rows
      for (var i = 0; i < Math.min(10, data.length); i++) {
        let val = data[i]

        if (this.props.type === "notRecognized") {          
          tableRows.push(<div className="overview-table-row">
                          <p className="overview-table-label">{val.label}</p>
                          { divider }
                        </div>)
        } else {
            tableRows.push(<div className="overview-table-row">
                            <div className="overview-table-label-wrapper">
                            { this.props.type == "frequentlyFailedPrompts" && <p className="overview-table-badge">{ val.intent }</p> }
                            { this.props.type == "frequentlyFailedPrompts" && <ArrowRight16 className="overview-table-arrow" />}
                            <p className={ this.props.type == "frequentlyFailedPrompts" ? "overview-table-label-wih-badge" :  "overview-table-num-label"}>{ val.label }</p>
                            </div>
                            <p className="overview-table-num">{ this.props.type === "frequentlyFailedPrompts" ? val.count  + "%" : val.count}</p>
                            <div className="overview-table-progress-container">
                              <div className="overview-table-progress-back"/>
                              <div className={ this.props.type === "mostCommon" ? "overview-table-green-bar" : "overview-table-red-bar" } 
                                style={{ width: (this.props.type === "frequentlyFailedPrompts" ? val.count : (100 * (val.count / this.props.maxTopicCount))) + "%" }}/>
                              </div>
                          </div>)
        }
      }

      // Add empty cells if there are < 10
      for (i = 0; i < Math.max(0, 10 - data.length); i++) {
        if (this.props.type === "notRecognized") {          
          tableRows.push(<div className="overview-table-row">
                          <div style={{ height: "30px" }}></div>
                          { divider }
                        </div>)
        } else {
            tableRows.push(<div className="overview-table-row">
                            <p className="overview-table-num-label transparent-text">-</p>
                            <p className="overview-table-num transparent-text">-</p>
                            <div className="overview-table-progress-container">
                              <div className="overview-table-progress-back"/>
                            </div>
                          </div>)
        }
      }

      // Build table with rows inserted as li
      return <div className="overview-table">
              <p className="panel-title">{ this.titleDict[this.props.type] }</p>
              <p className="overview-table-date">{ this.props.startDate } - { this.props.endDate }</p>
              { divider }
              <ul>
                { tableRows.map((value, index) => {
                  return <li key={index}>{value}</li>
                }) }
              </ul>
              {(this.props.type === "notRecognized") && 
                 <Link className='panel-link-div' to="/not-recognized">
                  <p className="panel-link">View all</p><ArrowRight16/>
                 </Link> }
            </div>

    }
}

const mapStateToProps = (state, ownState) => {
  let props = {
      ...ownState,
      mostCommon: [],
      leastCommon: [],
      frequentlyEscalated: [],
      notRecognized: [],
      startDate: moment(state.startDate, "L").format("MMM DD YYYY"),
      endDate: moment(state.endDate, "L").format("MMM DD YYYY")
  }

  if (state.statsLoaded) {
      let maxTopicCount = 0
      var intentsArr = []

      // Build json objects for intent counts and find max count
      let intentCounts = getLayeredDictCount(state.intentCounts, state.startDate, state.endDate)
      Object.keys(intentCounts).forEach(key => {
          maxTopicCount = Math.max(intentCounts[key], maxTopicCount)
          intentsArr.push({ "label": key, "count": intentCounts[key] })
      })

      props["maxTopicCount"] = maxTopicCount

      // Sort by count and get most common intents
      intentsArr.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
      let mostCommon = intentsArr.slice(0, 10)

      // Sort by count and get least common intents
      intentsArr.sort((a, b) => parseFloat(a.count) - parseFloat(b.count));
      let leastCommon = intentsArr.slice(0, 10)

      props.mostCommon = mostCommon
      props.leastCommon = leastCommon

      // Get most recent unrecognized messages
      props.notRecognized = state.notRecognizedMessages.filter(val => moment(val.timestamp).isBetween(state.startDate, state.endDate, "day", "[]"))
        .sort((a, b) => moment(b.timestamp) - moment(a.timestamp)).map(val => ({label: val.text}))

      // Get failed prompt percentages by prompt
      let failedPromptsObj = {}
      Object.keys(state.promptStatus).forEach(key => {
        let [date, intent, step] = key.split(":::")
        if (!moment(date, "L").isBetween(state.startDate, state.endDate, "day", "[]"))
          return

        let obj = failedPromptsObj[intent + ":::" + step] ?? { intent: intent, step: step, success: 0, fail: 0 }

        obj.success += state.promptStatus[key].success
        obj.fail += state.promptStatus[key].fail

        failedPromptsObj[intent + ":::" + step] = obj
      })

      let failedPromptCounts = []
      Object.keys(failedPromptsObj).forEach(key => {
        let [intent, step] = key.split(":::")
        let percent = Math.round(100 * (failedPromptsObj[key].fail / (failedPromptsObj[key].success + failedPromptsObj[key].fail)))
        failedPromptCounts.push({ "intent": intent, "label": step, "count": percent })
      })

      failedPromptCounts.sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
      props.frequentlyFailedPrompts = failedPromptCounts.slice(0, 10)
  }

  return props
}

export default connect(mapStateToProps)(OverviewTable)