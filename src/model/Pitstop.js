const { Schema, model} = require('mongoose');

const PitstopSchema = new Schema({
    fabricante: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Pitstop', PitstopSchema);