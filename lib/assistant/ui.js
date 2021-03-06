import csp from 'js-csp';
import inquirer from 'inquirer';
import { defaultActions } from './actions.js';

function prompt(questions) {
  var result = csp.chan();
  inquirer.prompt(questions, function(answers) {
    csp.go(function*() {
      yield csp.put(result, answers);
    });
  });
  return result;
}

export default function ui(chan) {
  csp.go(function*() {
    while (true) {
      let refactor = yield csp.take(chan);
      if (refactor === csp.CLOSED) {
        return;
      }

      if (refactor.context) {
        console.log(refactor.context);
      }
      var answers = yield prompt({
        type: "list",
        name: "action",
        message: refactor.name,
        choices: Object.keys(refactor.options).concat(Object.keys(defaultActions))
      });

      const options = Object.assign({}, refactor.options, defaultActions);
      const action = options[answers.action];

      yield csp.take(action());
    }
  });
}
