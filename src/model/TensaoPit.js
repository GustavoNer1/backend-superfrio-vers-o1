const { Schema, model} = require('mongoose');

const TensaoPitSchema = new Schema({
    tensao: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('TensaoPit', TensaoPitSchema);