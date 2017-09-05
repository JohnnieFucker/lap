const path = require('path');
const os = require('os');
const fs = require('fs');

class CnToken {
    constructor(vertexFrom, vertexTo, word, prob) {
        this.start = vertexFrom;
        this.end = vertexTo;
        this.termText = word;
        this.logProb = prob;
    }
}
class Node {
    constructor(item) {
        this.item = item;
        this.next = null;
    }
}
class TokenLinkedList {
    constructor() {
        this.head = null;
    }
    shift(item) {
        const n = new Node(item);
        if (this.head) {
            n.next = this.head;
        } else {
            n.next = null;
        }
        this.head = n;
    }
    unshift() {
        if (this.head) {
            const ret = this.head.item;
            if (this.head.next) {
                this.head = this.head.next;
            } else {
                this.head = null;
            }
            return ret;
        }
        return null;
    }
    push(item) {
        const n = new Node(item);
        if (this.head) {
            let end = this.head;
            while (end && end.next) {
                end = end.next;
            }
            end.next = n;
        } else {
            this.head = n;
        }
    }
    pop() {
        let end = this.head;
        let preEnd = this.head;
        while (end && end.next) {
            preEnd = end;
            end = end.next;
        }
        preEnd.next = null;
        return end.item;
    }
    getHead() {
        return this.head;
    }
    getEnd() {
        let end = this.head;
        while (end && end.next) {
            end = end.next;
        }
        return end;
    }
    toString() {
        let ret = '';
        let end = this.head;
        while (end.next) {
            ret += `${end.item.termText} `;
            end = end.next;
        }
        ret += end.item.termText;
        return ret;
    }
}

class DAG {
    constructor() {
        this.dicTotal = 0;
        this.dicHashMap = {};
        this.initDicHash();
    }

    initDicHash() {
        const dicPath = `${path.dirname(__filename)}/../../dicts/jieba.dict.utf8`;
        fs.readFileSync(dicPath).toString().split(os.EOL).forEach((o) => {
            if (o && o !== '') {
                const oArr = o.split(' ');
                this.dicHashMap[oArr[0]] = parseInt(oArr[1], 10);
            }
        });
        for (const k in this.dicHashMap) {
            if (this.dicHashMap.hasOwnProperty(k)) {
                this.dicTotal += this.dicHashMap[k];
            }
        }
    }

    getDAG(sentence) {
        const l = sentence.length;
        const retArr = [];
        for (let i = 0; i < l; i++) {
            let k = 0;
            let frag = sentence[i];
            const list = new TokenLinkedList();
            while (k < l) {
                if (this.dicHashMap.hasOwnProperty(frag)) {
                    list.push(new CnToken(i, k, frag, Math.log(this.dicHashMap[frag] / this.dicTotal)));
                } else if (i === k) {
                    list.push(new CnToken(i, k, frag, -10));
                }
                k++;
                frag = sentence.substring(i, k + 1);
            }
            retArr.push(list);
        }
        return retArr;
    }
}

module.exports = DAG;
