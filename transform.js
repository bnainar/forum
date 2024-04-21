module.exports = function(file, api) {
    const j = api.jscodeshift;
  
    // Transform function to prepend request.traceId to logger calls
    const transform = (root) => {
      // Find all function declarations (controller functions)
      root.find(j.FunctionDeclaration).forEach((path) => {
        // Find logger calls inside controller function
        path.get('body').get('body').filter((statement) => {
          return (
            statement.node.type === 'ExpressionStatement' &&
            statement.node.expression.type === 'CallExpression' &&
            statement.node.expression.callee?.object?.name === 'logger'
          );
        }).forEach((loggerCall) => {
          // Prepend request.traceId to logger call
          const traceId = j.memberExpression(j.identifier('request'), j.identifier('traceId'));
          loggerCall.node.expression.arguments[0] = j.binaryExpression('+', traceId, j.literal(' ') ,loggerCall.node.expression.arguments[0]);
        });
      });
    };
  
    // Return transformed AST
    return j(file.source).toSource();
  };
  