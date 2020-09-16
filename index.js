'use strict';
let fetch = require('node-fetch');
let fetchLogEntries = require('./lib/fetchLogEntries')

class LogEntriesReader {
  /**
   * Creates a Log Entries Reader instance
   *
   * @constructor
   * @param {Map} opts Logger options
   */
  constructor(opts) {
    // Sanity check for the options params
    if (!opts.hasOwnProperty('token')) {
      throw new Error('Log Entries token not supplied')
    } else if (!opts.hasOwnProperty('logset')) {
      throw new Error('Logset not defined')
    } else {
      this.token = opts.token;
      this.logset = opts.logset;
    }
  }

  /**
   * Method to print logs for a given timeframe.
   * @param startTime
   * @param endTime
   * @returns {Promise<void>}
   */

  async print(startTime, endTime) {
    return search(false, startTime, endTime, this.logset, this.token);
  }

  /***
   * Method to search logentries for a specific query in the given timeframe
   * @param query
   * @param startTime
   * @param endTime
   */

  async searchForString(query, startTime, endTime) {
    return Promise.resolve(search(query, startTime, endTime, this.logset, this.token));
  }


}

/**
 * Function to fetch logs from logentries.com
 * @param query  optional
 * @param startTime
 * @param endTime
 * @param logset
 * @param token
 * @returns {Promise<unknown>}
 */

function search(query, startTime, endTime, logset, token ){
  return new Promise((resolve, reject) => {
    let logEntriesURL = new URL(`https://rest.logentries.com/query/logs/${logset}`)
    if(!query) {
      let params = {from:startTime, to:endTime}
    } else {
      let params = {query:`where(${query})`, from:startTime, to:endTime}
    }
    let params = {query:`where(${query})`, from:startTime, to:endTime}
    logEntriesURL.search = new URLSearchParams(params).toString();
    let options = {
      url: logEntriesURL,
      method: 'GET',
      headers : {
        'x-api-key': token
      },
      per_page: 500 // Maximum Events per page
    };

    fetchLogEntries.fetchData(logEntriesURL, options).then(async(res) => {
      if (res.status == 202) {
        const resData = await res.json();
        const hrefLink = resData.links[0].href;
        await fetchLogEntries.fetchData(hrefLink, options).then(async(res) => {
          if (res.status == 200) {
            let logger_obj= [];
            const logJSON = await res.json()
            let logEvents = logJSON.events;
            logEvents.forEach((element) => {
              logger_obj.push(element.message);
            })
            Promise.all(logger_obj).then(function(){
              resolve(logger_obj);
            })
          } else {
            reject(res.statusText)
          }
        })
      } else {
        reject(res.statusText)
      }
    })
  })
}

module.exports = LogEntriesReader;