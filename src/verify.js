const symbols = ['~', '^', 'v', '>', '-', '(', ')'];
const letters = ['p', 'q', 'r', 's'];

const verify = sentence => {
  sentence.split('').forEach(char => {
    if (!symbols.includes(char) && !letters.includes(char)) {
      throw Error(`Caractere ${char} não é um operador válido`);
    }
  });

  return true;
};

module.exports = {
  symbols,
  letters,
  verify,
};
