const { symbols, letters } = require('./verify');

const errorMessage = error => `Erro ao seguir padrão FBF: ${error}`;

const getPrepositions = sentence => {
  let prepositions = 0;
  letters.forEach(letter => {
    if (sentence.includes(letter)) {
      prepositions++;
    }
  });

  return prepositions;
};

const generateTrueTable = sentence => {
  const prepositions = getPrepositions(sentence);

  let formattedLetters = [...letters];
  formattedLetters.length = prepositions;

  const lines = 2 ** prepositions;
  let combinations = formattedLetters.map(letter => ({
    key: letter,
    value: [],
  }));

  let values = [];
  let counter = 0;

  values = new Array(prepositions).fill('').map((_, i) => {
    let isTrue = true;

    let result = new Array(lines).fill('').map((_, index) => {
      const breaker = lines / 2 / 2 ** counter;

      if (index !== 0 && index % breaker === 0) {
        isTrue = !isTrue;
      }

      return isTrue ? 'v' : 'f';
    });

    counter++;

    return { [formattedLetters[i]]: result };
  });

  combinations = combinations.map(({ key }) => ({
    key,
    values: values[key],
  }));
};

const newAnalyzer = sentence => {
  const operations = [];
};

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
};

module.exports = generateTrueTable;
