const Catalogo = require('../model/Catalogo');

module.exports = {

    async index(req, res){
        const returnGet = await Catalogo.find();
        return res.json(returnGet)
    },
 
    async alive(req, res){
        return res.status(200).send();
    },


    async indexcomp(req, res){
        const returnGet = await Catalogo.find({tipo: 0});
        return res.json(returnGet)
    },

    async indexpit(req, res){
        const returnGet = await Catalogo.find({tipo: 1});
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Catalogo.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Catalogo.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Catalogo.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { nome, link, tipo } = req.body;

        const returnPost = Catalogo.create({
            nome,
            link,
            tipo   
        });

        return res.json(returnPost);
    },

};