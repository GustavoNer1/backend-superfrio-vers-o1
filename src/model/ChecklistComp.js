const { Schema, model} = require('mongoose');

const ChecklistCompSchema = new Schema({
    nserie: {
        type: String,
        required: true
    },
    dataentrada: {
        type: Date,
        required: true
    },
    tensao: {
        type: String,
        required: true
    },
    gas: {
        type: String,
        required: true
    },
    nativo: {
        type: String,
        required: true
    },
    nos: {
        type: String,
        required: true
    },
    garantia: {
        type: Boolean,
        required: true
    },
    osgarantia: {
        type: String,
        required: false
    },
    comentarios: {
        type: String,
        required: false
    },
    comentariosExit: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    statusExit: {
        type: String,
        required: false
    },
    hasExitChecklist: {
        type: Boolean,
        required: true,
        default: false
    },
    status_comm: {
        type: String
    },
    pdflink: {
        type: String
    },
    idcliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    idcompressor: {
        type: Schema.Types.ObjectId,
        ref: 'Compressor'
    },
    idfabricante: {
        type: Schema.Types.ObjectId,
        ref: 'Fabricante'
    },
    idrequester: {
        type: String,
        required: false
    },
    nomerequester: {
        type: String,
        required: false
    },
    idusuario: {
        type: String,
        required: false
    },
    nomeusuario: {
        type: String,
        required: false
    },
    idusuarioExit: {
        type: String,
        required: false
    },
    nomeusuarioExit: {
        type: String,
        required: false
    },
    obsgeral: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = model('ChecklistComp', ChecklistCompSchema);