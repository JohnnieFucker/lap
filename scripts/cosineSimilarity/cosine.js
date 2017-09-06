const cut = require('../JieBa/cut');

const initValue = 0.2;
function getSimilar(sentense1, sentense2, cb) {
    cut.init(() => {
        const words1 = cut.cut(sentense1, false, false);
        const words2 = cut.cut(sentense2, false, false);
        const allWords = words1.concat(words2);
        let s1 = 0;
        let s2 = 0;
        let sum = 0;
        allWords.forEach((w) => {
            let c1 = initValue;
            let c2 = initValue;
            if (words1.indexOf(w) >= 0) {
                c1 = 1;
            }
            if (words2.indexOf(w) >= 0) {
                c2 = 1;
            }
            s1 += c1 * c1;
            s2 += c2 * c2;
            sum += c1 * c2;
        });
        const result = sum / Math.sqrt(s1 * s2);
        console.log(result);
        if (cb) {
            cb(result);
        }
    });
}

module.exports = {
    getSimilar: getSimilar
};
