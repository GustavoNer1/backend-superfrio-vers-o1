const Tensao = require('../model/Tensao');

module.exports = {

    async index(req, res){

        const returnGet = await Tensao.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Tensao.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Tensao.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Tensao.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { tensao } = req.body;

        const returnPost = Tensao.create({
            tensao
        });

        return res.json(returnPost);
    },

};