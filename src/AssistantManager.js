import config from "./config"

class AssistantManager {
    constructor(store) {
        this.store = store
    }

    // Get list of assistants
    loadAssistants() {
        fetch(config.baseURL + "/assistants")
        .then(res => res.json())
        .then((result) => {
            // Dispatch assistants loaded event
            this.store.dispatch({
                type: config.ASSISTANT_LOADED,
                assistants: result.sort()
            })

        }, (error) => {
            console.log("Failed to get assistants")
        })
    }

    // Get stats for assistant named assistantName
    loadStats(assistantName) {
        fetch(config.baseURL + "/stats?assistant=" + assistantName)
        .then(res => res.json())
        .then((stats) => {     
            // Dispatch stats loaded event       
            this.store.dispatch({
                type: config.STATS_LOADED,
                assistantName: assistantName,
                stats: stats
            })

        }, (error) => {
            console.log("Failed to get logs")
        })
    }

}

export default AssistantManager
