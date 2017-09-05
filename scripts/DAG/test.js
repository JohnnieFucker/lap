// const DAG = require('./dag');

const testSentence = '现在需要回过头来看看我们程序的变化。';
// DAG.init();
// const result = DAG.getDag(testSentence);
// console.log(result);

const DAG = require('./dag2');

const dag = new DAG();
const ret = dag.getDAG(testSentence);
console.log(JSON.stringify(ret));
