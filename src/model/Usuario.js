const { Schema, model} = require('mongoose');

const UsuarioSchema = new Schema({
    nome: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    validado: {
        type: Boolean,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    access_web: {
        type: Boolean,
        required: true
    },
    web_appr:{
        type: Boolean,
        required: true
    },
    desp_appr:{
        type: Boolean,
        required: true,
        default: false
    },
    access_app: {
        type: Boolean,
        required: true
    },
    access_comp:{
        type: Boolean,
        required: true
    },
    access_pit:{
        type: Boolean,
        required: true
    },
    access_rack:{
        type: Boolean,
        required: true,
        default: false
    },
    access_despesa:{
        type: Boolean,
        required: true,
        default: false
    },
    telefone: {
        type: String
    },
    centro_custo: {
        type: String
    },
    area: {
        type: String,
        required: true
    },
    idarea: {
        type: String,
        required: true
    },
    receive_final_despesa:{
        type: Boolean,
        required: true,
        default: false
    },
    pushToken: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = model('Usuario', UsuarioSchema);