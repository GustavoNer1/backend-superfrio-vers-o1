const { Schema, model} = require('mongoose');

const ChecklistRackItemSchema = new Schema({
    ordemitem: {
        type: Number,
        required: true
    },
    nomeitem: {
        type: String,
        required: true
    },
    avaliacao: {
        type: Number
    },
    foto: {
        type: String
    },
    fotoSeq: {
        type: Number,
        default: 1
    },
    comentario: {
        type: String
    },
    idchecklistrack: {
        type: Schema.Types.ObjectId,
        ref: 'ChecklistRack'
    }
}, {
    timestamps: true
});

module.exports = model('ChecklistRackItem', ChecklistRackItemSchema);