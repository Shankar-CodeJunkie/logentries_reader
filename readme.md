Query logentries.com via their REST API. We have to make two different requests to 
retrieve log messages from logentries. This module will help you to retreive the logs
in a single API call.

## Installation: 
```npm install --save logentries_reader```

## Usage:

#### How to initialize the module ?

```angular2
let Logger = require('logentries_reader');
let logger = new Logger({
  'token': '79ec877e-1234-41c8-a2ae-6789sha2345',
  'logset': '1fjiwhf-5641-19z3-1233-69z56y260co3'
})

logger.searchForString('SEARCH TEXT', 1599199226000, 1599203826000)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

logger.print(1599199226000, 1599203826000)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
```