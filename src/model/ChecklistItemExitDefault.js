const { Schema, model} = require('mongoose');

const ChecklistCompItemExitDefaultSchema = new Schema({
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

module.exports = model('ChecklistCompItemExitDefault', ChecklistCompItemExitDefaultSchema);