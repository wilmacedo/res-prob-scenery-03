const verify = require('./verify');
const analyzer = require('./analyzer');

const sentence = 'p&(q^r)-(p&q)^(p&r)';
let step = 0;

const runSteps = () => {
  switch (step) {
    case 0:
      const verified = verify(sentence);
      if (verified) {
        step++;
      }
    case 1:
      const analyzed = analyzer(sentence);
      if (analyzed) {
        step++;
      }
  }
};

runSteps();
