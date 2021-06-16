import React from 'react';
import { connect } from 'react-redux';
import config from '../../config';

import OverviewTable from "../../components/OverviewTable/OverviewTable"
import Graph from "../../components/Graph/Graph"
import "./prompt-stats-page.scss"


class FailedPromptsPage extends React.Component {

  componentDidMount() {
    // Update activePage for sidebar and pageTitle on load
    this.props.dispatch({
      type: config.UPDATE,
      update: {
        pageTitle: "Prompt Stats",
        activePage: "promptstats"
      }
    })
  }

  render() {
    // Show prompt success rate graph and frequentlyFailedPrompts table
    return  <div className="bx--grid bx--grid--full-width">
              <div className="bx--row">
              </div>
              <div className="bx--row">
                <Graph type="Prompt success rate" /> 
              </div>
              <div className="bx--row" style={{ marginTop: "16px" }}>
                <h1 className="improve-assistant-heading">Decrease failed prompts</h1>
                <p className="improve-assistant-desc">As you look to find ways to improve the performance of your assistant, use the<br></br> suggestions below to start your analysis by filtering conversations</p>
              </div>
              <div className="bx--row" style={{ marginLeft: "16px", marginBottom: "512px"}}>
                <OverviewTable type="frequentlyFailedPrompts"></OverviewTable>
              </div>
          </div>;
  }

}

const mapStateToProps = (state) => {
  return { }
}

export default connect(mapStateToProps)(FailedPromptsPage);