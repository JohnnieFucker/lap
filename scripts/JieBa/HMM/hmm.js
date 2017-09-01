const minFloat = -3.14e100;
const prevStatus = {
    B: [
        'M',
        'S'
    ],
    M: [
        'M',
        'B'
    ],
    S: [
        'S',
        'E'
    ],
    E: [
        'B',
        'M'
    ]
};
const startP = require('./probStart.json');
const emitP = require('./probEmit.json');
const transP = require('./probTrans.json');

const regH = new RegExp('([\u4E00-\u9FD5]+)');
const regS = new RegExp('(\d+\.\d+|[a-zA-Z0-9]+)');// eslint-disable-line


function viterbi(sentence, states) {
    states = states || ['B', 'M', 'E', 'S'];
    const V = [{}];
    let path = {};
    const n = sentence.length - 1;
    for (const y of states) {
        V[0][y] = startP[y] + emitP[y].hasOwnProperty(sentence[0]) ? emitP[y][sentence[0]] : minFloat;
        path[y] = [y];
    }
    console.log(V);
    console.log(path);

    for (let i = 1; i <= n; i++) {
        V.push({});
        const newpath = {};
        for (const y of states) {
            const emP = emitP[y].hasOwnProperty(sentence[i]) ? emitP[y][sentence[i]] : minFloat;
            const max = {
                p: false,
                s: 'B'
            };
            for (const y0 of prevStatus[y]) {
                const yp0 = V[i - 1][y0] + transP[y0][y] ? transP[y0][y] : minFloat + emP;
                if (!max.p) {
                    max.p = yp0;
                    max.s = y0;
                } else if (yp0 > max.p) {
                    max.p = yp0;
                    max.s = y0;
                }
            }
            V[i][y] = max.p;
            console.log(max.s);
            newpath[i] = path[max.s].push(y);
            console.log(V[i]);
        }
        path = newpath;
    }
    if (V[n].E > V[n].S) {
        return {
            prob: V[n].E,
            path: path.E
        };
    }
    return {
        prob: V[n].S,
        path: path.S
    };
}

function _cut(sentence) {
    const p = viterbi(sentence);
    console.log(p);
    let begin = 0;
    let next = 0;
    const result = [];
    for (let i = 0; i < sentence.length; i++) {
        const pos = p.path[i];
        switch (pos) {
        case 'B':
            begin = i;
            break;
        case 'E':
            result.push(sentence.substring(begin, i + 1));
            next = i + 1;
            break;
        case 'S':
            result.push(sentence[i]);
            next = i + 1;
            break;
        default:
        }
        if (next < sentence.length) {
            result.push(sentence.substr(next));
        }
    }
    return result;
}

function cut(sentence) {
    const result = [];
    sentence.split(regH).forEach((blk) => {
        if (regH.test(blk)) {
            _cut(blk).forEach((w) => {
                result.push(w);
            });
        } else {
            blk.split(regS).forEach((x) => {
                if (x && x !== '') {
                    result.push(x);
                }
            });
        }
    });
    return result;
}

module.exports = {
    cut: cut
};
