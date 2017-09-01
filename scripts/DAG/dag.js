const path = require('path');
const os = require('os');
const fs = require('fs');

let dicHashArray = [];
const dicHashMap = {};

function initDicHash() {
    const dicPath = `${path.dirname(__filename)}/../../dicts/simple.dict.utf8`;
    dicHashArray = fs.readFileSync(dicPath).toString().split(os.EOL);
    dicHashArray.forEach((o) => {
        dicHashMap[o] = 1;
    });
}
function getDAG(sentence) {
    const DAG = {};
    const n = sentence.length;
    for (let i = 0; i < n; i++) {
        const tmp = [];
        let k = i;
        let frag = sentence[i];
        while (k < n) {
            if (dicHashMap.hasOwnProperty(frag)) {
                tmp.push(k);
            }
            k++;
            frag = sentence.substring(i, k + 1);
        }
        if (tmp.length === 0) {
            tmp.push(i);
        }
        DAG[i] = tmp;
    }
    return DAG;
}

const dag = {
    init: initDicHash,
    getDag: getDAG
};

module.exports = dag;
