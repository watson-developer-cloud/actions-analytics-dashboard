import React from 'react';
import './percent-ring.scss';
import { connect } from 'react-redux';
import { getLayeredDictCount, mergePromptCountsByDate } from "../../utils"


class PercentRing extends React.Component {
    constructor(props) {
        super(props)

        this.width = 275
        this.stroke = 16
        this.circumference = (this.width / 2 - 2 * this.stroke) * 2 * Math.PI
    }

    render () {
        return <div className="rings-wrapper" style={{ opacity: this.props.statsLoaded ? 1: 0.1}}>
          <svg
            className="progress-ring"
            width={ this.width }
            height={ this.width }>
            <circle
              className="progress-ring__circle"
              stroke="#e98588"
              strokeWidth={ this.stroke }
              fill="transparent"
              r={ this.width / 2 - 2 * this.stroke }
              cx={ this.width / 2 }
              cy={ this.width / 2 } />
          </svg>
          <svg
            style={{ 
              strokeDasharray: `${this.circumference} ${this.circumference}`,
              strokeDashoffset: this.circumference - (this.props.percent / 100) * this.circumference,
              transform: "rotate(-90deg)" }}
            className="progress-ring"
            width={ this.width }
            height={ this.width }>
            <circle
              className="progress-ring__circle"
              stroke="#333333"
              strokeWidth={ this.stroke }
              fill="transparent"
              r={ this.width / 2 - 2 * this.stroke }
              cx={ this.width / 2 }
              cy={ this.width / 2 } />
          </svg>
          <div className="percent-div" style={{ marginTop: this.width / 2, marginLeft: this.width / 2 }}>
            <p className="percent-num">{this.props.percent}</p><p className="percent-sign">%</p>
          </div>
     </div>

    }
}

const mapStateToProps = (state, ownState) => {
  let props = {
      ...ownState,
      percent: 0,
      statsLoaded: state.statsLoaded
  }

  if (props.type == "recognized" && state.statsLoaded) {
    // Recognized % = recognized / (recognized + not-recognized)
    let counts = getLayeredDictCount(state.recognized, state.startDate, state.endDate)
    props.percent = Math.round(100 * (counts.recognized / (counts.recognized + counts.notRecognized)))
  } else if (props.type == "promptsuccess") {
      // Prompt Success % = success / (success + fails)
    let promptCounts = getLayeredDictCount(mergePromptCountsByDate(state.promptStatus), state.startDate, state.endDate)
    props.percent = Math.round(100 * (promptCounts.success / (promptCounts.success  + promptCounts.fail)))
  }

  // If loading percent fails, show 0 instead of NAN
  if (isNaN(props.percent) || !props.statsLoaded)
    props.percent = 0

  return props
}

export default connect(mapStateToProps)(PercentRing)