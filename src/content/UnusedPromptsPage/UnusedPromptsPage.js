import React from 'react';
import { connect } from 'react-redux';
import config from "../../config"
import moment from "moment"
import "./unused-prompts-page.scss"
import { ArrowRight16, ArrowRight20 } from '@carbon/icons-react';

class UnusedPromptsPage extends React.Component {

  componentDidMount() {
    // Update activePage for sidebar and pageTitle on load
    this.props.dispatch({
      type: config.UPDATE,
      update: {
        pageTitle: "Unresolved Conversations",
        activePage: "UnusedPrompts"
      }
    })
  }

  render() {

    let divider = <div style={{ width: "100%", height: "1px", background: "#f4f4f4", marginBottom: "2px" }}></div>
    var tableRows = []
    
    // Build jsx rows for each unused prompt
    for (let i = 0; i < this.props.actions.length; i++) {
      tableRows.push(<div className="unusedPromptsRow">
                      <p className="unusedPromptsAction">{ this.props.actions[i] }</p>
                      <ArrowRight20 className="unusedPromptsArrow" />
                      <p className="unusedPromptsStep">{ this.props.steps[i] }</p>
                      { divider }
                    </div>)
    }

    // Show if no unused prompts
    if (this.props.actions.length == 0)
      tableRows.push(<div className="unusedPromptsRow">
        <p className="unusedPromptsAction">No unresolved conversations</p>
        <ArrowRight20 className="unusedPromptsArrow" />
        <p className="unusedPromptsStep">Great job!</p>
        { divider }
        </div>)

    tableRows.push(<div className="unusedPromptsRow"></div>)

    return <div className="unusedPromptsTable">
               <ul>
                { tableRows.map((value, index) => {
                  return <li key={index}>{value}</li>
                }) }
              </ul>
           </div>;
  }
};

const mapStateToProps = (state) => {
  return { actions: state.unusedPrompts.map(val => val.split(":::")[0]), steps: state.unusedPrompts.map(val => val.split(":::")[1]) }
}

export default connect(mapStateToProps)(UnusedPromptsPage);