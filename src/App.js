import React, { Component } from 'react';
import './app.scss';
import {
  Restart16,
} from '@carbon/icons-react';
import { Content, DatePicker, DatePickerInput } from 'carbon-components-react';
import ActionsHeader from './components/ActionsHeader/ActionsHeader';
import Sidebar from './components/Sidebar/Sidebar';

import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment'
import config from './config';

import ScrollToTop from "./ScrollToTop"
import OverviewPage from './content/OverviewPage/OverviewPage';
import EngagementPage from './content/EngagementPage/EngagementPage';
import RecognitionPage from './content/RecognitionPage/RecognitionPage';
import FailedPromptsPage from './content/PromptStatsPage/PromptStatsPage';
import NotRecognizedPage from './content/NotRecognizedPage/NotRecognizedPage';
import UnusedPromptsPage from './content/UnusedPromptsPage/UnusedPromptsPage';

class App extends Component {

  // Date picker dates changed
  datesChanged = (dates) => {
    let startDate = moment(dates[0]).format("L")
    let endDate = moment(dates[1]).format("L")

    // Dispatch DATES_CHANGED update so data will update to correspond with date range
    this.props.dispatch({
      type: config.DATES_CHANGED,
      startDate: startDate,
      endDate: endDate
    })
  }

  // If refresh clicked, reload stats for selected assistant
  refreshClicked = () => {
    this.props.dispatch({ type: config.REFRESH_STATS })
  }

  render() {
    return (
      <>
        <ActionsHeader/>
        <Sidebar/>
        <div className="bx--grid bx--grid--full-width app-grid">
          <div className="bx--row padded-row">
            <h1 className="overview-page__heading">{ this.props.pageTitle }</h1>
            <div className="lastRefreshed" onClick={ this.refreshClicked }>
              <Restart16 className={this.props.loadingStats ? "rotating" : ""} />
              <p >Last Updated:<br></br>{ this.props.lastUpdated }</p>
              </div>
          </div>
          <div className="bx--row padded-row" style={{ marginTop: "16px" }}>
              <DatePicker light
                id="overview-date-picker"
                onChange={ this.datesChanged }
                datePickerType="range"
                minDate={ this.props.minDate }
                maxDate={ this.props.maxDate }
                value={ [ this.props.startDate, this.props.endDate ] }>
                <DatePickerInput
                  id="date-picker-input-id-start"
                  placeholder="mm/dd/yyyy"
                  labelText="Start date"
                />
                <DatePickerInput 
                  id="date-picker-input-id-finish"
                  placeholder="mm/dd/yyyy"
                  labelText="End date"
                />
            </DatePicker>
          </div>
          <Content>
            <ScrollToTop />
            <Switch
              onChange={ this.routeChanged }>
              <Route exact path="/" component={OverviewPage} />
              <Route path="/engagement" component={EngagementPage} />
              <Route path="/recognition" component={RecognitionPage} />
              <Route path="/promptstats" component={FailedPromptsPage} />
              <Route path="/not-recognized" component={NotRecognizedPage} />
              <Route path="/unused-prompts" component={UnusedPromptsPage} />
            </Switch>
          </Content>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pageTitle: state.pageTitle,
    lastUpdated: state.lastUpdated,
    startDate: state.startDate,
    endDate: state.endDate,
    minDate: state.minDate,
    maxDate: state.maxDate,
    loadingStats: state.loadingStats
  }
}

export default connect(mapStateToProps)(App);
