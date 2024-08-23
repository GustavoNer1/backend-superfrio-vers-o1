const Marca = require('../model/Marca');

module.exports = {

    async index(req, res){

        const returnGet = await Marca.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Marca.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Marca.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Marca.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { titulo } = req.body;

        const returnPost = Marca.create({
            titulo           
        });

        return res.json(returnPost);
    },

};