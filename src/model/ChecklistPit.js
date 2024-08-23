const { Schema, model} = require('mongoose');

const ChecklistPitSchema = new Schema({
    dataentrada: {
        type: Date,
        required: true
    },
    nserie: {
        type: String,
        required: true
    },
    controlid: {
        type: String,
        required: true
    },
    CNPJ: {
        type: String,
        required: true
    },
    rsocial: {
        type: String,
        required: true
    },
    comentarios: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    status_comm: {
        type: String
    },
    tipo: {
        type: Number,
        required: true
    },
    pdflink: {
        type: String
    },
    // idcliente: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Cliente'
    // },
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
    obsgeral: {
        type: String,
        required: false
    },
    tensao: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
    chave: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('ChecklistPit', ChecklistPitSchema);