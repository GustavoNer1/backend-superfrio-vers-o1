const CategoriaDespesa = require('../model/CategoriaDespesa');

module.exports = {

    async index(req, res){

        const returnGet = await CategoriaDespesa.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await CategoriaDespesa.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await CategoriaDespesa.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await CategoriaDespesa.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { categoria } = req.body;

        const returnPost = CategoriaDespesa.create({
            categoria
        });

        return res.json(returnPost);
    },

};