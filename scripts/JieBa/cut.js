const fs = require('fs');
const path = require('path');
const readline = require('readline');

const self = {
    total: 0,
    dicHashMap: {}
};
const regEng = new RegExp('[a-zA-Z0-9]');
const regChi = new RegExp('([\u4E00-\u9FD5a-zA-Z0-9+#&\\._]+)');
const regSkip = new RegExp('(\\r|\\n|\\s)');
const regChiCutAll = new RegExp('([\u4E00-\u9FD5]+)');
const regSkipCutAll = new RegExp('[^a-zA-Z0-9+#\\n]');


function initDicHash(cb) {
    const fRead = fs.createReadStream(`${path.dirname(__filename)}/../../dicts/jieba.dict.utf8`);

    const rlObj = readline.createInterface({
        input: fRead
    });

    rlObj.on('line', (line) => {
        const wordArray = line.split(' ');
        if (wordArray[0] && wordArray[0] !== '') {
            if (!self.dicHashMap.hasOwnProperty(wordArray[0])) {
                if (wordArray[1] && !isNaN(parseInt(wordArray[1], 10))) {
                    self.total += parseInt(wordArray[1], 10);
                    self.dicHashMap[wordArray[0]] = parseInt(wordArray[1], 10);
                } else {
                    // 未指定词频的按1处理
                    self.total += 1;
                    self.dicHashMap[wordArray[0]] = 1;
                }
            }
        }
    });
    rlObj.on('close', () => {
        // console.log('convert done...');
        if (cb) {
            cb();
        }
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
            if (self.dicHashMap.hasOwnProperty(frag)) {
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


function calRoute(sentence, DAG) {
    const route = {};
    const n = sentence.length;
    route[n] = {
        q: 0,
        i: 0
    };
    for (let i = n - 1; i >= 0; i--) {
        const maxFreq = { q: false, i: 0 };
        for (const x of DAG[i]) {
            const word = sentence.substring(i, x + 1);
            let freq = self.dicHashMap.hasOwnProperty(word) ? self.dicHashMap[word] : 1;
            freq = Math.log(freq / self.total) + route[x + 1].q;
            if (maxFreq.q === false) {
                maxFreq.q = freq;
                maxFreq.i = x;
            }
            if (freq > maxFreq.q) {
                maxFreq.q = freq;
                maxFreq.i = x;
            }
        }
        route[i] = maxFreq;
    }
    return route;
}

function _cutDAGNoHMM(sentence) {
    const route = calRoute(sentence, getDAG(sentence));
    const result = [];
    let x = 0;
    let y = 0;
    const n = sentence.length;
    let word = '';
    while (x < n) {
        y = route[x].i + 1;
        const tmpWord = sentence.substring(x, y);
        if (tmpWord.length === 1 && regEng.test(tmpWord)) {
            word += tmpWord;
        } else {
            if (word !== '') {
                result.push(word);
                word = '';
            }
            result.push(tmpWord);
        }
        x = y;
    }
    if (word !== '') {
        result.push(word);
    }
    return result;
}

function _cutDAGWithHMM(sentence) {
    const route = calRoute(sentence, getDAG(sentence));
    const result = [];
    let x = 0;
    let y = 0;
    const n = sentence.length;
    let word = '';
    while (x < n) {
        y = route[x].i + 1;
        const tmpWord = sentence.substring(x, y);
        if (tmpWord.length === 1) {
            word += tmpWord;
        } else {
            if (word !== '') {
                if (word.length === 1) {
                    result.push(word);
                    word = '';
                } else {
                    if (self.dicHashMap.hasOwnProperty(word)) {

                    } else {

                    }
                    word = '';
                }
            }
            result.push(tmpWord);
        }
        x = y;
    }
    if (word !== '') {
        result.push(word);
    }
    return result;
}

function _cutAll(sentence) {
    const dag = getDAG(sentence);
    let oldJ = -1;
    const result = [];
    for (const k in dag) {
        if (dag.hasOwnProperty(k)) {
            if (dag[k].length === 1 && k > oldJ) {
                result.push(sentence.substring(k, dag[k][0] + 1));
                oldJ = dag[k][0];
            } else {
                dag[k].forEach((l) => {
                    if (l > k) {
                        result.push(sentence.substring(k, l + 1));
                        oldJ = l;
                    }
                });
            }
        }
    }
    return result;
}

function cut(sentence, cutAll, HMM) {
    if (typeof (cutAll) === 'undefined') {
        cutAll = false;
    }
    if (typeof (HMM) === 'undefined') {
        HMM = true;
    }
    let regH = regChi;
    let regS = regSkip;
    if (cutAll) {
        regH = regChiCutAll;
        regS = regSkipCutAll;
    }
    const blocks = sentence.split(regH);
    const result = [];
    blocks.forEach((blk) => {
        if (blk && blk !== '') {
            if (regH.test(blk)) {
                let words = [];
                if (cutAll) {
                    words = _cutAll(blk);
                } else if (HMM) {
                    words = _cutDAGWithHMM(blk);
                } else {
                    words = _cutDAGNoHMM(blk);
                }
                words.forEach((w) => {
                    result.push(w);
                });
            } else {
                blk.split(regS).forEach((x) => {
                    if (x && x !== '') {
                        if (regS.test(x)) {
                            result.push(x);
                        } else if (cutAll) {
                            result.push(x);
                        } else {
                            for (let i = 0; i < x.length; i++) {
                                result.push(x[i]);
                            }
                        }
                    }
                });
            }
        }
    });
    return result;
}

module.exports = {
    init: initDicHash,
    cut: cut
};
