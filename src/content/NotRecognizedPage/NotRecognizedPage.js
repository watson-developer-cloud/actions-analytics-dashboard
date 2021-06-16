import React from 'react';
import { connect } from 'react-redux';
import config from "../../config"
import moment from "moment"
import "./not-recognized-page.scss"

class NotRecognizedPage extends React.Component {

  componentDidMount() {
    // Update activePage for sidebar and pageTitle on load
    this.props.dispatch({
      type: config.UPDATE,
      update: {
        pageTitle: "Not Recognized",
        activePage: "NotRecognized"
      }
    })
  }

  render() {

    let divider = <div style={{ width: "100%", height: "1px", background: "#f4f4f4", marginBottom: "2px" }}></div>
    var tableRows = []
    
    for (let i = 0; i < this.props.notRecognized.length; i++) {
      tableRows.push(<div className="notRecognizedRow">
                      <p className="notRecognizedText">{ this.props.notRecognized[i].text }</p>
                      <p className="notRecognizedDate">{ moment(this.props.notRecognized[i].timestamp).format("L") }</p>
                      { divider }
                    </div>)
    }

    if (this.props.notRecognized.length == 0)
      tableRows.push(<div className="notRecognizedRow">
        <p className="notRecognizedText">No unrecognized messages. Great job!</p>
        { divider }
      </div>)

    tableRows.push(<div className="notRecognizedRow"></div>)

    return <div className="notRecognizedTable">
               <ul>
                { tableRows.map((value, index) => {
                  return <li key={index}>{value}</li>
                }) }              </ul>
           </div>;
  }
};

const mapStateToProps = (state) => {
  let notRecognized = state.notRecognizedMessages.filter(val => moment(val.timestamp).isBetween(state.startDate, state.endDate, "day", "[]"))
        .sort((a, b) => moment(b.timestamp) - moment(a.timestamp))

  return { notRecognized: notRecognized }
}

export default connect(mapStateToProps)(NotRecognizedPage);