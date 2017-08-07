const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const utils = require('../../libs/utils');

let dicHashMap = {};
let dicHashArray = [];
let result = [];

function initDicHash() {
    const dicPath = path.dirname(__filename) + '/../../dicts/simple.dict.utf8';
    dicHashArray = fs.readFileSync(dicPath).toString().split(os.EOL);
    dicHashArray.forEach((o)=>{
        dicHashMap[o] = 1;
    })
}

function inDict(words) {
    return dicHashMap.hasOwnProperty(words);
}

function testSentence(sentence,max,direction){
    let startIndex = direction === 'asc' ? 0 :sentence.length-max>0?sentence.length-max:0;
    let subSentence = '';
    subSentence = sentence.substr(startIndex, max);
    //log(subSentence);
    if(subSentence.length ===0){
        return;
    }
    let sigleWord = testWords(subSentence,direction);
    let sigleWordNoSymbol = sigleWord.replace(/[\n|\r|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
    sigleWordNoSymbol = sigleWordNoSymbol.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/,'');
    if(direction==='asc'){
        if(sigleWordNoSymbol !==''){
            result.push(sigleWordNoSymbol);
        }
        sentence = sentence.substr(startIndex+sigleWord.length);
    }else{
        if(sigleWordNoSymbol !==''){
            result.unshift(sigleWordNoSymbol);
        }

        sentence = sentence.substr(0,sentence.length-sigleWord.length);
    }

    //log(result);
    testSentence(sentence,max,direction);
}

function testWords(words, direction) {
    if (words.length === 1 || inDict(words)) {
        return words;
    } else {
        if(direction==='asc'){
            words = words.substr(0,words.length-1);
        }else{
            words = words.substr(1);
        }
        return testWords(words,direction);
    }
}

function cut(sentence, options) {
    options = options || {};
    options.maxCharNumOfWord = options.maxCharNumOfWord || 5;
    options.searchDirection = options.searchDirection.toLowerCase() || 'desc';
    result = [];
    testSentence(sentence,options.maxCharNumOfWord,options.searchDirection);
    return result;
}

initDicHash();
module.exports = {cut: cut,testWords:testWords};