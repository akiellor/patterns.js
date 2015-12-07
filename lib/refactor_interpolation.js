function mergeTemplateLiteral(left, right) {
  const expressions = left.expressions.concat(right.expressions);
  const quasis = left.quasis.concat(right.quasis).reduce(function(memo, entry) {
    const lastElement = memo[memo.length - 1];
    if (lastElement && expressions.length === 0) {
      lastElement.value.raw += entry.value.raw;
      lastElement.value.cooked += entry.value.cooked;
    } else {
      memo.push(entry);
    }
    return memo;
  }, []);

  return {
    type: "TemplateLiteral",
    quasis: quasis,
    expressions: expressions
  }
}

function toTemplateLiteral(node) {
  if (node.type === 'BinaryExpression') {
    const left = toTemplateLiteral(node.left);
    const right = toTemplateLiteral(node.right);

    return mergeTemplateLiteral(left, right);
  } else if (node.type === 'Literal') {
    return {type: "TemplateLiteral", quasis: [{type: "TemplateElement", value: {raw: node.value, cooked: node.value}, tail: false}], expressions: []}
  } else {
    return {type: "TemplateLiteral", quasis: [], expressions: [node]};
  }
}

export default function refactorInterpolation(node) {
  var result = toTemplateLiteral(node);
  if (node.right.type !== 'Literal') {
    result.quasis.push({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: true});
  }
  var left = node.left;
  while (left.type === 'BinaryExpression') {
    left = left.left;
  }
  if (left.type !== 'Literal') {
    result.quasis.unshift({type: "TemplateElement", value: {raw: "", cooked: ""}, tail: false});
  }

  return result;
}
