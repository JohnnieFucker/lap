const cosine = require('./cosine');

const sentence1 = '我想看看公司的整体销售情况';
const sentence2 = '看看曾锦的销售完成得怎么样';
cosine.getSimilar(sentence1, sentence2);
