const { Schema, model} = require('mongoose');

const NoticiaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descr: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    imagem: {
        type: String
    }
    
}, {
    timestamps: true
});

module.exports = model('Noticia', NoticiaSchema);
