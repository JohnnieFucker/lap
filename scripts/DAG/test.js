const DAG = require('./dag');

const testSentence = `恭喜你猜对了,我们的 NodeJS 程序还没起来呢

    目前先到这,现在需要回过头来看看我们的NodeJS程序的变化。`;
DAG.init();
const result = DAG.getDag(testSentence);
console.log(result);
