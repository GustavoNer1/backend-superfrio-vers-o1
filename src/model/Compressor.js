const { Schema, model} = require('mongoose');

const CompressorSchema = new Schema({
    modelo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Compressor', CompressorSchema);