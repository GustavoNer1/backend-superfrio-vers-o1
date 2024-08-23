const { Schema, model} = require('mongoose');

const GasSchema = new Schema({
    nome: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Gas', GasSchema);