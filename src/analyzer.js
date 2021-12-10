const errorMessage = error => `Erro ao seguir padrão FBF: ${error}`;

const analyzer = sentence => {
  const operations = [];

  let fixedSentence = sentence;
  fixedSentence = fixedSentence.replace('))', ')');
  fixedSentence = fixedSentence.replace('((', '(');

  let prefixChar;
  fixedSentence.split('').forEach((char, index) => {
    if (char === ')' && fixedSentence[index + 1] === '~') {
      throw Error(errorMessage('Negacão após parentese'));
    }

    if (prefixChar !== undefined && char === ')') {
      let operator = '';

      for (let i = prefixChar; i <= index; i++) {
        operator += fixedSentence[i];
      }

      operations.push(operator);
    }

    if (char === '(') {
      let toIndex = index;

      if (fixedSentence[index - 1] === '~') {
        toIndex = index - 1;
      }

      prefixChar = toIndex;
    }
  });

  console.log(operations);
};

module.exports = analyzer;
