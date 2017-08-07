const readline = require('readline');
const fs = require('fs');
const os = require('os');
const path = require('path');

let fRead = fs.createReadStream(path.dirname(__filename) + '/../dicts/jieba.dict.utf8');
let fWrite = fs.createWriteStream(path.dirname(__filename) + '/../dicts/simple.dict.utf8');

let rlObj = readline.createInterface({
    input: fRead,
});

rlObj.on('line', (line) => {
    let wordArray = line.split(' ');
    if (wordArray[0] && wordArray[0] != '') {
        fWrite.write(wordArray[0] + os.EOL);
    }
});

rlObj.on('close', () => {
    console.log('convert done...');
});
return;