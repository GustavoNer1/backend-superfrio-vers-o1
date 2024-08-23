const { Schema, model} = require('mongoose');

const ChecklistCompItemExitSchema = new Schema({
//CheckListComp
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
    idchecklistcomp: {
        type: Schema.Types.ObjectId,
        ref: 'ChecklistComp'
    }
}, {
    timestamps: true
});

module.exports = model('ChecklistCompItemExit', ChecklistCompItemExitSchema);