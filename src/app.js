const verify = require('./verify');
const analyzer = require('./analyzer');

const sentence = 'p&(q^r)-(p&q)^(p&r)';
let step = 0;

const runSteps = () => {
  switch (step) {
    case 0:
      const { error } = verify(sentence);

      if (error) {
        throw Error(error);
      }

      step++;
    case 1:
      analyzer(sentence);
  }
};

runSteps();
