//本节参考阮一峰 贝叶斯推断及其互联网应用（一）：定理简介
//http://www.ruanyifeng.com/blog/2011/08/bayesian_inference_part_one.html

const Bayes = require('./bayesProb');

/*
测试条件概率计算
 */
function testConPro(){
    let result = Bayes.getConProb(0.3,0.2,0.1);
    console.log("条件概率为："+result);
}
testConPro();

/*
测试全概率计算
 */
function testTotalProb(){
    let result = Bayes.getTotalProb(0.3,0.7,0.1,0.2);
    console.log("全概率为："+result);
}
testTotalProb();

/*
糖果测试
两个一模一样的碗，一号碗有30颗水果糖和10颗巧克力糖，二号碗有水果糖和巧克力糖各20颗。
现在随机选择一个碗，从中摸出一颗糖，发现是水果糖。
请问这颗水果糖来自一号碗的概率有多大？
 */
function testCandy(){
    //选一号碗和二号碗的概率都是50%;
    let Pa = 0.5, Pb = 0.5;
    //从一号碗中选出水果糖的概率为75%  30除以40
    let Pca = 0.75;
    //从二号碗中选出水果糖的概率为50%  20除以40
    let Pcb = 0.5;
    //摸出了一颗水果糖,概率通过全概率计算
    let Pc = Bayes.getTotalProb(Pa,Pb,Pca,Pcb);
    //求来自一号碗的概率,概率通过条件计算
    let Pac = 0;
    Pac = Bayes.getConProb(Pa,Pc,Pca);
    console.log(Pac);
}
testCandy();


/*
疾病测试，假阳性
一种病的感染率是0.1%，某种手段检查准确率为99%（患病者99%会测出阳性，正常人99%会测出阴性）
现在有一个人测出为阳性，那么他患病的可能性为多少
 */
function testPositive(){
    //感染率
    let Pa = 0.001;
    //正常率
    let Pb = 0.999;
    //患病情况检查出阳性
    let Pca = 0.99;
    //正常情况检查出阳性
    let Pcb = 0.01;

    //检查出阳性的概率通过全概率计算
    let Pc = Bayes.getTotalProb(Pa,Pb,Pca,Pcb);
    //检查出阳性且真正患病的概率
    let Pac = 0;
    Pac = Bayes.getConProb(Pa,Pc,Pca);
    console.log("检查出阳性且真正患病的概率："+Pac);
    //检查出阳性但正常的概率
    let Pbc = 0;
    Pbc = Bayes.getConProb(Pb,Pc,Pcb);
    console.log("检查出阳性但正常的概率："+Pbc);
}
testPositive();

/*
疾病测试，假阳性
一种病的感染率是0.1%，某种手段检查准确率为99%（患病者99%会测出阳性，正常人99%会测出阴性）
现在有一个人测出为阴性，那么他正常的可能性为多少
 */
function testNegative(){
    //感染率
    let Pa = 0.001;
    //正常率
    let Pb = 0.999;
    //患病情况检查出阴性
    let Pda = 0.01;
    //正常情况检查出阴性
    let Pdb = 0.99;

    //检查出阴性的概率通过全概率计算
    let Pd = Bayes.getTotalProb(Pa,Pb,Pda,Pdb);
    //检查出阴性且真正健康的概率
    let Pbd = 0;
    Pbd = Bayes.getConProb(Pb,Pd,Pdb);
    console.log("检查出阴性且真正健康的概率："+Pbd);
    //检查出阴性且患病的概率
    let Pad = 0;
    Pad = Bayes.getConProb(Pa,Pd,Pda);
    console.log("检查出阴性且患病的概率："+Pad);
}
testNegative();
