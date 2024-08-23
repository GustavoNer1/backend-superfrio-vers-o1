const { Schema, model} = require('mongoose');

const ChecklistRackSchema = new Schema({
    dataentrada: {
        type: Date,
        required: true
    },
    nos: {
        type: String,
        required: true
    },
    idcliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    gas: {
        type: String,
        required: true
    },
    tensao: {
        type: String,
        required: true
    },
    sistema: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    status_comm: {
        type: String
    },
    pdflink: {
        type: String
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
    compressores: {
        type: Array,
        required: true
    },
    comentarios: {
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

module.exports = model('ChecklistRack', ChecklistRackSchema);