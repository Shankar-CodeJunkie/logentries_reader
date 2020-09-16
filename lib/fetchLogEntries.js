let fetch = require('node-fetch');

module.exports = {
  fetchData(url, options) {
    return new Promise(async(resolve, reject) => {
      try {
        const response =  await fetch(url, options);
        resolve(response);
      } catch (err) {
        console.log(err)
        reject(err);
      }
    })
  }
}