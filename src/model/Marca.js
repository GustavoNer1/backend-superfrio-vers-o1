const { Schema, model} = require('mongoose');

const MarcaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Marca', MarcaSchema);