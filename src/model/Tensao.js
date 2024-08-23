const { Schema, model} = require('mongoose');

const TensaoSchema = new Schema({
    tensao: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Tensao', TensaoSchema);