const { Schema, model} = require('mongoose');

const DespesaItemSchema = new Schema({
    descr: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    fotoSeq: {
        type: Number,
        default: 1
    },
    valor: {
        type: Number,
        required: true
    },
    categoria: {
        type: Number,
        required: true
    },
    categoriaText: {
        type: String,
        required: true
    },
    iddespesa: {
        type: Schema.Types.ObjectId,
        ref: 'Despesa'
    }
}, {
    timestamps: true
});

module.exports = model('DespesaItem', DespesaItemSchema);