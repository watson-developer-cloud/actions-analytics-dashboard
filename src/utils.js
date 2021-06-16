import moment from 'moment';

export function getDictCount(dict, startDateStr, endDateStr) {
    let startDate = moment(startDateStr, "L")
    let endDate = moment(endDateStr, "L").endOf('day');

    let keys = Object.keys(dict)
    let count = 0

    for (let i = 0; i < keys.length; i++) {
      let date = keys[i]

      if (moment(date, "L").isBetween(startDate, endDate, "day", "[]"))
        count += dict[date]
    }

    return count
}

export function getUniqueUsers(dict, startDateStr, endDateStr) {
    let startDate = moment(startDateStr, "L")
    let endDate = moment(endDateStr, "L").endOf('day');

    let keys = Object.keys(dict)
    let count = 0
    let counted = []

    for (let i = 0; i < keys.length; i++) {
        let date = keys[i]

        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            for (let j = 0; j < dict[date].users.length; j++) {
                if (counted.indexOf(dict[date].users[j]) > -1) continue
                
                console.log(counted)
                count += 1
                counted.push(dict[date].users[j])
            }
        }
    }

    return count
}

export function getLayeredDictCount(dict, startDateStr, endDateStr) {
    let startDate = moment(startDateStr, "L")
    let endDate = moment(endDateStr, "L").endOf('day');

    let ret = {}
    let keys = Object.keys(dict)

    for (let i = 0; i < keys.length; i++) {
      let date = keys[i]

        if (moment(date, "L").isBetween(startDate, endDate, "day", "[]")) {
            let innerDict = dict[date]
            let innerKeys = Object.keys(innerDict)

            for (let j = 0; j < innerKeys.length; j++) {
                let key = innerKeys[j]
                ret[key] = key in ret ? ret[key] + innerDict[key] : innerDict[key]
            }
        }
    }

    return ret
}

export function mergePromptCountsByDate(promptStatus) {
    let promptDateDict = {}
    
    Object.keys(promptStatus).forEach(key => {
      let date = key.split(":::")[0]

      promptDateDict[date] = promptDateDict[date] ?? { success: 0, fail: 0 }
      promptDateDict[date].success += promptStatus[key].success
      promptDateDict[date].fail += promptStatus[key].fail
    })

    return promptDateDict
}