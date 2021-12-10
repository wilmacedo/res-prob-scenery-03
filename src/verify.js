const symbols = ['~', '^', 'v', '&', '>', '-', '(', ')'];
const letters = ['p', 'q', 'r'];

const verify = sentence => {
  let result = { result: true, error: '' };

  sentence.split('').forEach(char => {
    if (!symbols.includes(char) && !letters.includes(char)) {
      result = {
        result: false,
        error: `Caractere ${char} não é um operador válido`,
      };
    }
  });

  return result;
};

module.exports = verify;
