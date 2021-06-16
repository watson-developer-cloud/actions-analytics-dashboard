import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router } from 'react-router-dom';
import 'core-js/modules/es7.array.includes';
import 'core-js/modules/es6.array.fill';
import 'core-js/modules/es6.string.includes';
import 'core-js/modules/es6.string.trim';
import 'core-js/modules/es7.object.values';
import AssistantManager from './AssistantManager';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import config from './config';
import moment from 'moment';
import { getCookie, setCookie } from "./cookies"

let assistantManager;

const initialState = {
    pageTitle: "Analytics Overview",
    activePage: "Overview",
    assistants: [],
    assistantsLoaded: false,
    selectedAssistant: getCookie("selectedAssistant") ?? "",
    statsLoaded: false,
    loadingStats: true,
    uniqueUsers: {},
    uniqueSessions: {},
    requestCounts: {},
    engagement_showActiveUsers: true,
    engagement_showConversations: true,
    engagement_showRequests: true,
    recognized: {},
    notRecognizedMessages: [],
    intentCounts: {},
    promptStatus: {},
    failedPromptMessages: [],
    unusedPrompts: [],
    lastUpdated:"-:--",
    minDate: moment().format("L"),
    maxDate: moment().format("L"),
    startDate: moment().format("L"),
    endDate: moment().format("L")
}

// Recieves dispatched updates and updates redux state
function reducer(state=initialState, action) {
    switch(action.type) {
        case config.ASSISTANT_LOADED:
            // Check cookies for selected assistant, if not there, default to first assistant
            let selected = action.assistants.indexOf(state.selectedAssistant) > -1 ? state.selectedAssistant : action.assistants[0]
            // Load stats for selected assistant
            assistantManager.loadStats(selected)

            return Object.assign({}, state, {
                loadingStats: true,
                assistants: action.assistants,
                assistantsLoaded: true,
                selectedAssistant: selected
            });
        case config.STATS_LOADED:
            let update = {...action.stats}
            update.statsLoaded = true
            update.loadingStats = false

            let dates = Object.keys(action.stats.requestCounts).map(str => moment(str, "L"))
            update.minDate = moment.min(dates).format("L")
            update.maxDate = moment.max(dates).format("L")
            update.lastUpdated = moment().format('h:mm A')

            update.startDate = update.minDate
            update.endDate = update.maxDate

            return Object.assign({}, state, update);
        case config.ASSISTANT_SELECTED:
            // Load stats for selected assistant and update cookie
            assistantManager.loadStats(action.assistant)
            setCookie("selectedAssistant", action.assistant)

            return Object.assign({}, state, {
                selectedAssistant: action.assistant,
                loadingStats: true,
                statsLoaded: false
            });
        case config.REFRESH_STATS:
            // Reload stats if an assistant is selected and not currently loading
            if (state.selectedAssistant && !state.loadingStats) {
                assistantManager.loadStats(state.selectedAssistant)
                return Object.assign({}, state, {
                    loadingStats: true,
                });
            } else {
                return state
            }
        case config.DATES_CHANGED:
            // Date range updated
            return Object.assign({}, state, {
                startDate: action.startDate,
                endDate: action.endDate
            });
        case config.UPDATE:
            // Generic update
            return Object.assign({}, state, action.update);
        default:
            return state
    }
}

let store = createStore(reducer)

// Create assistant manager and load list of assistants
assistantManager = new AssistantManager(store)
assistantManager.loadAssistants()

ReactDOM.render(<Router><Provider store={store}><App/></Provider></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
