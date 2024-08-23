const { Schema, model} = require('mongoose');

const HomeAlertSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('HomeAlert', HomeAlertSchema);