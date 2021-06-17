import React from 'react';
import { connect } from 'react-redux';
import { LineChart } from "@carbon/charts-react";
import { Checkbox } from "carbon-components-react"
import './graph.scss';
import "@carbon/charts/styles.css";
import moment from 'moment';
import config from '../../config';
import { mergePromptCountsByDate } from "../../utils"

class Graph extends React.Component {
    constructor(props) {
        super(props)
    }

    render () {
      // Build graph panel with checkboxes for engagement page and Carbon LineChart
      return <div className="graph-panel">
                <p className="panel-title" style={{ marginBottom: this.props.type == "Prompt success rate" ? "0": "16px" }}>{ this.props.type + " over time" } </p>
                <fieldset className="bx--fieldset" style={{ visibility: this.props.type == "Engagement" && !this.props.noData ? "visible" : "hidden"}}>
                    <Checkbox labelText="Show active users" checked={ this.props.showActiveUsers } id="activeUsersCB"
                        onChange={ (checked) => { this.props.dispatch({type: config.UPDATE, update: {engagement_showActiveUsers: checked}}) } } />
                    <Checkbox labelText="Show conversations" checked={ this.props.showConversations } id="conversationsCB"
                        onChange={ (checked) => { this.props.dispatch({type: config.UPDATE, update: {engagement_showConversations: checked}}) } } />
                    <Checkbox labelText="Show requests" checked={ this.props.showRequests } id="requestsCB"
                        onChange={ (checked) => { this.props.dispatch({type: config.UPDATE, update: {engagement_showRequests: checked}}) } } />
                </fieldset>
                <div className="chartWrapper">
                    { !this.props.statsLoaded || !this.props.noData ?
                    <LineChart
                        data={this.props.data}
                        options={this.props.options}>
                    </LineChart> :
                    <p className="graphNoData">No {this.props.type.toLowerCase()} data to show</p>
                    }
                </div>
            </div>
    }
}

const mapStateToProps = (state, ownState) => {
  let props = {
      statsLoaded: state.statsLoaded,
      type: ownState.type,
      showActiveUsers: state.engagement_showActiveUsers,
      showConversations: state.engagement_showConversations,
      showRequests: state.engagement_showRequests,
      data: [],
      options: {
        axes: {
            bottom: {
              title: "Date",
              mapsTo: "date",
              scaleType: "time"
            },
            left: {
              mapsTo: "value",
              title: "Loading",
              scaleType: "linear"
            }
          },
        data: {
            loading: true,
        },
        legend: { enabled: ownState.type === "Prompt success rate", truncation: { type: "none" }, position: "top" },
        height: "400px"
    }
  }

  if (state.statsLoaded) {
      // Setup graph options
      props.options = {
        axes: {
            bottom: {
                title: "Date",
                mapsTo: "date",
                scaleType: "time"
            },
            left: {
                title: props.type + (ownState.type == "Engagement" ? "" : " (%)"),
                mapsTo: "value",
                scaleType: "linear"
            }
        },
        data: {
            loading: false,
        },
        height: "400px",
        legend: { enabled: ownState.type === "Prompt success rate", truncation: { type: "none" }, position: "top" },
        tooltip: { showTotal: false },
        color: { scale: { "Requests": "#9C74F7", "Active Users": "#38807E", "Conversations": "#DA5E93", "Recognized (%)": "#DA5E93", "Contained (%)": "#DA5E93" } }

    }

    // Load data based on type passed in ownState
    if (props.type === "Engagement") {
        let [data, filtered] = loadEngagementData(state)
        props.data = filtered
        props.noData = data.length == 0
    } else if (props.type === "Recognition") {
        props.data = loadRecognitionData(state)
        props.noData = props.data.length == 0
    } else if (props.type === "Prompt success rate") {
        props.data = loadPromptSuccessData(state)
        props.noData = props.data.length == 0
    }

  }

  return props
}

// Load requests, conversations, and active users data
const loadEngagementData = (state) => {
    let data = []
    let filtered = []

    let startDate = moment(state.startDate, "L")
    let endDate = moment(state.endDate, "L").endOf('day');

    for(let i = 0; i < Object.keys(state.uniqueUsers).length; i++) {
        let date = Object.keys(state.uniqueUsers)[i]
        
        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let val = {
                date: moment(date, "L").toISOString(),
                value: state.uniqueUsers[date].count,
                group: "Active Users"
            }

            data.push(val)
            if (state.engagement_showActiveUsers) filtered.push(val)
        }
    } 

    for(let i = 0; i < Object.keys(state.uniqueSessions).length; i++) {
        let date = Object.keys(state.uniqueSessions)[i]

        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let val = {
                date: moment(date, "L").toISOString(),
                value: state.uniqueSessions[date],
                group: "Conversations"
            }

            data.push(val)
            if (state.engagement_showConversations) filtered.push(val)
        }
    }
    
    for(let i = 0; i < Object.keys(state.requestCounts).length; i++) {
        let date = Object.keys(state.requestCounts)[i]
        
        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let val = {
                date: moment(date, "L").toISOString(),
                value: state.requestCounts[date],
                group: "Requests"
            }

            data.push(val)
            if (state.engagement_showRequests) filtered.push(val)
        }
    }

    return [data, filtered]
}

// Load recognition percent data
const loadRecognitionData = (state) => {
    let data = []

    let startDate = moment(state.startDate, "L")
    let endDate = moment(state.endDate, "L").endOf('day');

    for(let i = 0; i < Object.keys(state.recognized).length; i++) {
        let date = Object.keys(state.recognized)[i]
        
        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let rec = state.recognized[date].recognized
            let not = state.recognized[date].notRecognized

            data.push({
                date: moment(date, "L").toISOString(),
                value: Math.round(100 * rec / (rec + not)),
                group: "Recognized (%)"
            })
        }
    }

    return data
}

// Load prompt success percentage by prompt
const loadPromptSuccessData = (state) => {
    let data = []

    let startDate = moment(state.startDate, "L")
    let endDate = moment(state.endDate, "L").endOf('day');

    // For merged counts
    let promptCounts = mergePromptCountsByDate(state.promptStatus)

    for(let i = 0; i < Object.keys(promptCounts).length; i++) {
        let date = Object.keys(promptCounts)[i]

        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let success = promptCounts[date].success
            let fail = promptCounts[date].fail

            data.push({
                date: moment(date, "L").toISOString(),
                value: Math.round(100 * success / (success + fail)),
                group: "Average"
            })
        }
    }

    // For each separate prompt
    for(let i = 0; i < Object.keys(state.promptStatus).length; i++) {
        let key = Object.keys(state.promptStatus)[i]
        let [date, action, step] = key.split(":::")
        
        // Check data point is in selected range
        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            data.push({
                date: moment(date, "L").toISOString(),
                value: Math.round(100 * state.promptStatus[key].success / (state.promptStatus[key].success + state.promptStatus[key].fail)),
                group: action + " → " + step
            })
        }
    }

    return data
}

export default connect(mapStateToProps)(Graph)