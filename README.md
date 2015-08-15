# Patterns.js

## This is experimental

Patterns.js is an experiment to see if it is possible to identify common patterns in javascript. An extension to this idea, is being able to identify and automatically refactor said code.

Current state of the project simply finds duplicated code.

# Code Generator

Out of **absolute necessity**, a javascript code generator was built as part of this project, for the purpose of creating test data.

## To try it out

```
npm install
cat statistics.json | ./bin/generate
```

## To generate with more fun statistics

```
cat <(curl https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js) <(curl https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js) | ./bin/statistics | ./bin/generate
```
