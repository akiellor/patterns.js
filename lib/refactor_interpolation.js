function flatten(node) {
  if (node.type === 'BinaryExpression') {
    return flatten(node.left).concat([node.right]);
  } else {
    return [node];
  }
}

function partition(nodes) {
  return nodes.reduce((memo, element) => {
    if (element.type === 'TemplateElement') {
      memo.quasis.push(element);
    } else {
      memo.expressions.push(element);
    }
    return memo;
  }, {quasis: [], expressions: []});
}

function isStringLiteral(node) {
  return node.type === 'Literal' && typeof node.value === 'string';
}

function mergeAdjacentLiterals(nodes) {
  return nodes.reduce(function(memo, element) {
    const lastElement = memo[memo.length - 1];
    if (lastElement && isStringLiteral(lastElement) && isStringLiteral(element)) {
      lastElement.value += element.value;
      lastElement.raw = `"${lastElement.value}"`;
    } else {
      memo.push(element);
    }
    return memo;
  }, []);
}

function interleaveBlanksBetweenExpressions(nodes) {
  return nodes.reduce(function(memo, element) {
    const lastElement = memo[memo.length - 1];
    if (lastElement && !isStringLiteral(lastElement) && !isStringLiteral(element)) {
      memo.push({type: 'Literal', value: ''});
      memo.push(element);
    } else {
      memo.push(element);
    }
    return memo;
  }, []);
}

function convertLiteralsToTemplateElements(nodes) {
  return nodes.map(function(element) {
    if (element.type === 'Literal') {
      return {type: "TemplateElement", value: {raw: element.value, cooked: element.value}, tail: false};
    } else {
      return element;
    }
  });
}

function fixHeadAndTailTemplateElements(nodes) {
  if (nodes[0].type !== 'TemplateElement') {
    nodes.unshift({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: false});
  }
  if (nodes[nodes.length - 1].type === 'TemplateElement') {
    nodes[nodes.length - 1].tail = true;
  } else {
    nodes.push({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: true});
  }
  return nodes;
}

function toTemplateLiteral(nodes) {
  const { quasis, expressions } = partition(nodes);

  return {type: "TemplateLiteral", quasis: quasis, expressions: expressions};
}

function comp(...fns) {
  return fns.reduce(function(memo, fn) {
    return (x) => fn(memo(x));
  }, (x) => x);
}

export default comp(
  flatten,
  mergeAdjacentLiterals,
  interleaveBlanksBetweenExpressions,
  convertLiteralsToTemplateElements,
  fixHeadAndTailTemplateElements,
  toTemplateLiteral
);
