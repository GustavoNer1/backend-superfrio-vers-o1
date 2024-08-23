const Pitstop = require('../model/Pitstop');

module.exports = {

    async index(req, res){

        const returnGet = await Pitstop.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Pitstop.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Pitstop.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Pitstop.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { fabricante, modelo } = req.body;

        const returnPost = Pitstop.create({
            fabricante,
            modelo         
        });

        return res.json(returnPost);
    },

};