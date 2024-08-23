const HomeAlert = require('../model/HomeAlert');

module.exports = {

    async index(req, res){

        const returnGet = await HomeAlert.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await HomeAlert.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await HomeAlert.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await HomeAlert.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { titulo, mensagem } = req.body;

        const returnPost = HomeAlert.create({
            titulo,
            mensagem           
        });

        return res.json(returnPost);
    },

};