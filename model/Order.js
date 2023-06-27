const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
var Order = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product'
            },
            total: Number,
            color: String
        }
    ],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled ', 'Processing', 'Successed']
    },

    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

//Export the model
module.exports = mongoose.model('Order', Order);