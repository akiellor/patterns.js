function flatten(node) {
  if (node.type === 'BinaryExpression') {
    return flatten(node.left).concat([node.right]);
  } else {
    return [node];
  }
}

function isStringLiteral(node) {
  return node.type === 'Literal' && typeof node.value === 'string';
}

export default function refactorInterpolation(node) {
  const flat = flatten(node);
  const squished = flat.reduce(function(memo, element) {
    const lastElement = memo[memo.length - 1];
    if (lastElement && isStringLiteral(lastElement) && isStringLiteral(element)) {
      lastElement.value += element.value;
      lastElement.raw = `"${lastElement.value}"`;
    } else if (lastElement && !isStringLiteral(lastElement) && !isStringLiteral(element)) {
      memo.push({type: 'Literal', value: ''});
      memo.push(element);
    } else {
      memo.push(element);
    }
    return memo;
  }, []);
  const mapped = squished.map(function(element) {
    if (element.type === 'Literal') {
      return {type: "TemplateElement", value: {raw: element.value, cooked: element.value}, tail: false};
    } else {
      return element;
    }
  });
  if (mapped[0].type !== 'TemplateElement') {
    mapped.unshift({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: false});
  }
  if (mapped[mapped.length - 1].type === 'TemplateElement') {
    mapped[mapped.length - 1].tail = true;
  } else {
    mapped.push({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: true});
  }
  const { quasis, expressions } = mapped.reduce((memo, element) => {
    if (element.type === 'TemplateElement') {
      memo.quasis.push(element);
    } else {
      memo.expressions.push(element);
    }
    return memo;
  }, {quasis: [], expressions: []});

  return {type: "TemplateLiteral", quasis: quasis, expressions: expressions};
}
