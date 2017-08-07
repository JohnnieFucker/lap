global.log = function (m) {
    if(!process.env.NODE_ENV ? 'development' : process.env.NODE_ENV !=='production'){
        console.log(m);
    }
};