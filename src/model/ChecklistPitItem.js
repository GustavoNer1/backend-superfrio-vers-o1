const { Schema, model} = require('mongoose');

const ChecklistPitItemSchema = new Schema({
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
    idchecklistpit: {
        type: Schema.Types.ObjectId,
        ref: 'ChecklistPit'
    }
}, {
    timestamps: true
});

module.exports = model('ChecklistPitItem', ChecklistPitItemSchema);