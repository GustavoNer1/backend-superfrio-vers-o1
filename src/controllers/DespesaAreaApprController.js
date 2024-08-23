const DespesaAreaAppr = require('../model/DespesaAreaAppr');

module.exports = {

    async index(req, res){
        const returnGet = await DespesaAreaAppr.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await DespesaAreaAppr.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await DespesaAreaAppr.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await DespesaAreaAppr.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { nome, aprovador, idaprovador } = req.body;

        const returnPost = DespesaAreaAppr.create({
            nome,
            aprovador,
            idaprovador   
        });

        return res.json(returnPost);
    },

};