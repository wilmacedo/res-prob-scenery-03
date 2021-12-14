const { symbols, letters } = require('./verify');

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

  let values = {};
  let counter = 0;

  new Array(prepositions).fill('').map((_, i) => {
    let isTrue = true;

    let result = new Array(lines).fill('').map((_, index) => {
      const breaker = lines / 2 / 2 ** counter;

      if (index !== 0 && index % breaker === 0) {
        isTrue = !isTrue;
      }

      return isTrue ? 'v' : 'f';
    });

    counter++;

    values = { ...values, [formattedLetters[i]]: result };
  });

  combinations = combinations.map(({ key }) => ({
    key,
    values: values[key],
  }));

  return combinations;
};

const generatePriorites = sentence => {
  const priorities = [];

  let fixedSentence = sentence;
  fixedSentence = fixedSentence.replace('))', ')');
  fixedSentence = fixedSentence.replace('((', '(');

  let prefixChar;
  fixedSentence.split('').forEach((char, index) => {
    if (prefixChar !== undefined && char === ')') {
      let operator = '';

      for (let i = prefixChar + 1; i < index; i++) {
        operator += fixedSentence[i];
      }

      priorities.push(operator);
    }

    if (char === '(') {
      prefixChar = index;
    }
  });

  return priorities;
};

const processLettersConnectors = (keys, connector, trueTable) => {
  const values = trueTable.filter(({ key }) => keys.includes(key));

  let algorith;

  switch (connector) {
    case '^':
      algorith = (item, index) => {
        if (item === 'v' && values[1].values[index] === 'v') {
          return 'v';
        } else {
          return 'f';
        }
      };
      break;
    case 'v':
      algorith = (item, index) => {
        if (item === 'v' || values[1].values[index] === 'v') {
          return 'v';
        } else {
          return 'f';
        }
      };
      break;
    case '-':
      algorith = (item, index) => {
        if (
          (item === 'v' && values[1].values[index] === 'v') ||
          (item === 'f' && values[1].values[index] === 'f')
        ) {
          return 'v';
        } else {
          return 'f';
        }
      };
  }

  const table = values[0].values.map(algorith);
  return table;
};

const getResult = table => {
  let allTrue = true;
  let allFalse = true;

  table.forEach(item => {
    if (item !== 'v') {
      allTrue = false;
    } else if (item !== 'f') {
      allFalse = false;
    }
  });

  if (allTrue) {
    return 'Tautologia';
  } else if (allFalse) {
    return 'Contradicao';
  } else {
    return 'Contingencia';
  }
};

const analyzer = sentence => {
  const trueTable = generateTrueTable(sentence);

  if (sentence.includes('-')) {
    const parsedSentences = sentence.split('-');

    const trueTables = parsedSentences.map(parsedSentence => {
      let prepositions = [];

      let connectorIndex;
      parsedSentence.split('').forEach((char, index) => {
        if (connectorIndex !== undefined) {
          const haveBefore = parsedSentence[connectorIndex - 1] !== ')';
          const haveAfter = parsedSentence[connectorIndex + 1] !== '(';

          if (haveBefore) {
            prepositions.push(parsedSentence[connectorIndex - 1]);
          }

          if (haveAfter) {
            prepositions.push(parsedSentence[connectorIndex - 1]);
          }

          if (!haveBefore || !haveAfter) {
            const operators = generatePriorites(parsedSentence);

            prepositions = [...prepositions, ...operators];
          }

          prepositions.push(parsedSentence[connectorIndex]);

          connectorIndex = undefined;
        }

        if (symbols.includes(char) && char !== '(' && char !== ')') {
          const parsedString = parsedSentence.substring(0, index);

          const haveParent =
            parsedString.includes('(') && parsedString.slice(-1) !== ')';

          if (parsedString.slice(-1) === ')' || !haveParent) {
            connectorIndex = index;
          }
        }
      });

      const connector = prepositions[prepositions.length - 1];
      prepositions.length = prepositions.length - 1;

      const values = prepositions.map((prep, index) => {
        if (!symbols.some(r => prep.split('').includes(r))) {
          return { key: prep, values: trueTable[0].values };
        }

        const conn = prep.split('').filter(item => symbols.includes(item))[0];
        const keys = prep.split('').filter(item => letters.includes(item));

        return {
          key: letters[index],
          values: processLettersConnectors(keys, conn, trueTable),
        };
      });

      return processLettersConnectors(
        values.map(({ key }) => key),
        connector,
        values,
      );
    });

    const finalTables = trueTables.map((item, index) => ({
      key: letters[index],
      values: item,
    }));

    const resultTable = processLettersConnectors(
      finalTables.map(({ key }) => key),
      '-',
      finalTables,
    );

    console.table(resultTable);
    console.log(`Resultado: ${getResult(resultTable)}`);
  }
};

module.exports = analyzer;
