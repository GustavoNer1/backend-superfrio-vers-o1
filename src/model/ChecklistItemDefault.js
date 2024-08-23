const { Schema, model} = require('mongoose');

const ChecklistCompItemDefaultSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    ordemitem: {
        type: Number,
        required: true
    },
    nomeitem: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('ChecklistCompItemDefault', ChecklistCompItemDefaultSchema);