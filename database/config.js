const mongoose = require('mongoose');

//jgh_adv
//rfUZNLk40Z4cOccK

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la db, favor ver logs');
    }
}


module.exports = {
    dbConnection
}
