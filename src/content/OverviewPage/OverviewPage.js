import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  ArrowRight16
} from '@carbon/icons-react';
import './overview-page.scss'
import PercentRing from "../../components/PercentRing/PercentRing"
import OverviewTable from "../../components/OverviewTable/OverviewTable"
import { mergePromptCountsByDate, getDictCount, getLayeredDictCount, getUniqueUsers } from "../../utils"
import config from '../../config';

class OverviewPage extends React.Component {

  componentDidMount() {
    // Update activePage for sidebar and pageTitle on load
    this.props.dispatch({
      type: config.UPDATE,
      update: {
        pageTitle: "Analytics overview",
        activePage: "Overview"
      }
    })
  }

  render() {
    const dividerStyle = {width: "100%", height: "1px", background: "#f4f4f4", marginTop: "24px"}

    return <div className="bx--grid bx--grid--full-width overview-page">

            <div className="bx--row multi-panel-wrapper" style={{ marginTop: "24px" }}>

              <div className="engagement-panel" style={{ marginRight: "8px" }}>
                  <p className="panel-title" style={{ width: "100%" }}>Engagement</p>
                  <div className="engagement-num-div">
                    <p className="engagement-num-title">Active Users</p>
                    <p className="engagement-num">{ this.props.statsLoaded ? this.props.uniqueUsers : "-" }</p>
                  </div>
                  <div className="engagement-num-div">
                    <p className="engagement-num-title">Conversations</p>
                    <p className="engagement-num">{ this.props.statsLoaded ? this.props.uniqueSessions : "-" }</p>
                  </div>
                  <div className="engagement-num-div" style={{ marginBottom: "auto"}}>
                    <p className="engagement-num-title">Requests</p>
                    <p className="engagement-num">{ this.props.statsLoaded ? this.props.requestCount : "-" }</p>
                  </div>
                  <div className="panel-bottom" style={{ width: "100%" , marginTop: "5px"}}>
                    <div style={ dividerStyle }></div>
                    <Link className='panel-link-div' to="/engagement">
                      <p className="panel-link">View engagement</p><ArrowRight16/>
                    </Link>
                  </div>
              </div>

              <div style={{ marginLeft: "8px" }}>
                <p className="panel-title">Unresolved Conversations</p>
                <p className="panel-desc">Checks for logs with actions containing prompts where<br></br>the action finishes before the response is used.</p>
                <div className="engagement-num-div" style={{ marginBottom: "auto"}}>
                    <p className="engagement-num">{ this.props.statsLoaded ? this.props.unusedPrompts : "-" }</p>
                  </div>
                <div style={ dividerStyle }></div>
                <Link className='panel-link-div' to="/unused-prompts">
                  <p className="panel-link">View unresolved conversations</p><ArrowRight16/>
                </Link>
              </div>
            </div>

            <div className="bx--row multi-panel-wrapper">

              <div style={{ marginRight: "8px" }}>
                  <PercentRing type="recognized"></PercentRing>
                  <div className="panel-desc-container">
                    <p className="panel-title">Recognition</p>
                    <p className="panel-desc">Measures the requests within a given time period that are recognized and successfully routed to a trained topic.</p>
                  </div>
                  <p className="panel-num-header" style={{ marginTop: "32px"}}>Requests recognized</p>
                  <p className="panel-num-sm">{ this.props.statsLoaded ? this.props.recognized : "-" }</p>
                  <p className="panel-num-header blue-text">Requests not recognized</p>
                  <p className="panel-num-sm">{ this.props.statsLoaded ? this.props.notRecognized: "-" }</p>
                  <div style={ dividerStyle }></div>
                  <Link className='panel-link-div' to="/recognition">
                    <p className="panel-link">View recognition</p><ArrowRight16/>
                  </Link>
              </div>

              <div style= {{ marginLeft: "8px" }}>
                  <PercentRing type="promptsuccess"></PercentRing>
                  <div className="panel-desc-container">
                    <p className="panel-title">Prompt Success Rate</p>
                    <p className="panel-desc">Measures the percentage of all prompts that recieved a successful response.</p>
                  </div>
                  <p className="panel-num-header" style={{ marginTop: "32px"}}>Successful prompts</p>
                  <p className="panel-num-sm">{ this.props.statsLoaded ? this.props.successfulPrompts : "-" }</p>
                  <p className="panel-num-header blue-text">Failed prompts</p>
                  <p className="panel-num-sm">{ this.props.statsLoaded ? this.props.failedPrompts : "-" }</p>
                  <div style={ dividerStyle }></div>
                  <Link className='panel-link-div' to="/promptstats">
                    <p className="panel-link">View prompt stats</p><ArrowRight16/>
                  </Link>
              </div>

            </div>

            <div className="bx--row">
              <h1 className="improve-assistant-heading">Improve your assistant</h1>
              <p className="improve-assistant-desc">As you look to find ways to improve the performance of your assistant, use the<br></br> suggestions below to start your analysis by filtering conversations</p>
            </div>
            <div className="bx--row" style={{ marginLeft: "16px", marginBottom: "16px"}}>
              <OverviewTable type="mostCommon"></OverviewTable>
              <OverviewTable type="leastCommon"></OverviewTable>
            </div>
            <div className="bx--row" style={{ marginLeft: "16px" }}>
              <OverviewTable type="notRecognized"></OverviewTable>
              <OverviewTable type="frequentlyFailedPrompts"></OverviewTable>
            </div>
          </div>
  }

}

const mapStateToProps = (state) => {
    let props = {
        statsLoaded: state.statsLoaded,
        uniqueUsers: 0,
        uniqueSessions: 0,
        requestCount:0,
        recognized: 0,
        notRecognized: 0,
        successfulPrompts: 0,
        failedPrompts: 0,
        unusedPrompts: 0,
        startDate: state.startDate,
        endDate: state.endDate
    };

    if (state.statsLoaded) {
      // Get engagement counts
      props.uniqueUsers = getUniqueUsers(state.uniqueUsers, state.startDate, state.endDate)
      props.uniqueSessions = getDictCount(state.uniqueSessions, state.startDate, state.endDate)
      props.requestCount = getDictCount(state.requestCounts, state.startDate, state.endDate)

      // Get recognized counts
      let recCounts = getLayeredDictCount(state.recognized, state.startDate, state.endDate)
      props.recognized = recCounts.recognized ?? 0
      props.notRecognized = recCounts.notRecognized ?? 0

      // Get failed prompt counts
      let promptDateDict = mergePromptCountsByDate(state.promptStatus)

      let promptCounts = getLayeredDictCount(promptDateDict, state.startDate, state.endDate)
      props.successfulPrompts = promptCounts.success ?? 0
      props.failedPrompts = promptCounts.fail ?? 0

      // Get unused prompts
      props.unusedPrompts = state.unusedPrompts.length
    }

    return props
}

export default connect(mapStateToProps)(OverviewPage)