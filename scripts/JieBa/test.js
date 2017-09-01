require('../../libs/utils');
const JB = require('./cut');
const hmm = require('./HMM/hmm');

const sentence = '国庆大典我在research结巴分词';
JB.init(() => {
    let result = JB.cut(sentence, true, false);
    console.log(result);
    useMem();
    result = JB.cut(sentence, false, false);
    console.log(result);
    useMem();
});

const result = hmm.cut(sentence);
console.log(result);

