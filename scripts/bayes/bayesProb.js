let bayes = {
    /*
    贝叶斯条件概率计算
    求在事件B发生的情况下，事件A发生的概率
    Pa 事件A发生概率
    Pb 事件B发生概率
    Pba 在事件A发生的情况下，事件B发生的概率
    */
    getConProb: function (Pa, Pb, Pba) {
        let Pab = 0;
        Pab = (Pba * Pa / Pb).toFixed(4);
        return Pab;
    },
    /*
    贝叶斯全概率计算
    如果A和B构成样本空间的一个划分，那么事件C的概率，就等于A和B的概率分别乘以C对这两个事件的条件概率之和。
    Pa 事件A发生概率
    Pb 事件B发生概率
    Pca 在事件A发生的情况下，事件C发生的概率
    Pcb 在事件B发生的情况下，事件C发生的概率
    求在事件C的概率
     */
    getTotalProb: function (Pa, Pb, Pca, Pcb) {
        let Pc = 0;
        Pc = (Pca * Pa + Pcb * Pb).toFixed(4);
        return Pc;
    }
};
module.exports = bayes;
