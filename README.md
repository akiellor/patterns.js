# Patterns.js [experimental]

Patterns.js is an experiment to see if it is possible to identify common patterns in javascript. An extension to this idea, is being able to identify and automatically refactor code.

Current state of the project simply finds duplicated code.

## Try it out

```
$ npm install https://github.com/akiellor/patterns.js/archive/master.tar.gz
$ wget https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js
$ node_modules/.bin/patterns -c 150 jquery.js
```
