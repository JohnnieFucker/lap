const Trie = require('./trie');
const phoneList = require('./phoneNum.json');
phoneList.forEach((p)=>{
    Trie.addWord(p.name,p.phone);
});
console.log(JSON.stringify(Trie.trieMap));

console.log(Trie.search('王五撒'));

Trie.deleteWord('王五');
console.log(JSON.stringify(Trie.trieMap));