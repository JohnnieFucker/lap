class TNode {
    constructor(ch) {
        this.v = '';
        this.k = ch;
        this.c = {};//children
    }
}

let trie = {
    trieMap: new TNode(''),
    addWord: function (wordStr, value) {
        let testNode = this.trieMap;
        for (let i = 0; i < wordStr.length; i++) {
            let k = wordStr.charAt(i);
            let tmpNode;
            if (testNode.c && testNode.c.hasOwnProperty(k)) {
                tmpNode = testNode.c[k];
            } else {
                tmpNode = new TNode(k);
            }
            if (i === wordStr.length - 1) {
                tmpNode.v = value;
            }
            if (!(tmpNode.v && tmpNode.v !== '')) {
                delete tmpNode.v;
            }
            testNode.c[k] = tmpNode;
            testNode = tmpNode;
        }
    },
    deleteWord: function (wordStr) {
        let testNode = this.trieMap;
        for (let i = 0; i < wordStr.length; i++) {
            let k = wordStr.charAt(i);
            if (testNode.c && testNode.c.hasOwnProperty(k)) {
                if(i===wordStr.length-1){
                    if(testNode.c[k].c){
                        if(Object.keys(testNode.c[k].c).length>0){
                            delete testNode.c[k].v;
                        }else{
                            delete testNode.c[k];
                        }
                    }
                    return;
                }
                testNode = testNode.c[k];
            }else{
                return;
            }
        }
    },
    search: function (wordStr) {
        let testNode = this.trieMap;
        for (let i = 0; i < wordStr.length; i++) {
            let k = wordStr.charAt(i);
            if (testNode.c && testNode.c.hasOwnProperty(k)) {
                testNode = testNode.c[k];
            }
            if ((i === wordStr.length - 1) && testNode.v && testNode.v !== '') {
                return testNode.v;
            }
        }
        return null;
    },
};

module.exports = trie;