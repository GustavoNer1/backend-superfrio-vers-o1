const Precadastro = require('../model/Precadastro');

module.exports = {

    async index(req, res){

        const returnGet = await Precadastro.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Precadastro.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Precadastro.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Precadastro.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    async store(req, res) {

        const { nome, descr, rua, numero, bairro, cep, fone1, fone2, pedonline, cardapio, email, facebook, instagram, whatsapp, hrinicio_semana, hrfim_semana, hrinicio_sabado, hrfim_sabado, hrinicio_domingo, hrfim_domingo,idcategoria } = req.body;

        const returnPost = await Precadastro.create({
            nome, 
            descr, 
            rua, 
            numero, 
            bairro, 
            cep, 
            fone1, 
            fone2, 
            pedonline,
            cardapio,
            email, 
            facebook, 
            instagram, 
            whatsapp,
            hrinicio_semana,
            hrfim_semana,
            hrinicio_sabado,
            hrfim_sabado,
            hrinicio_domingo,
            hrfim_domingo,
            idcategoria
        });

        return res.json(returnPost);
    }

};