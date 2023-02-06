
randomNumberGenerator= function(lenght){
    return Math.random().toFixed(lenght).split('.')[1];
};

module.exports=randomNumberGenerator;