const TensaoPit = require('../model/TensaoPit');

module.exports = {

    async index(req, res){

        const returnGet = await TensaoPit.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await TensaoPit.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await TensaoPit.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await TensaoPit.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { tensao } = req.body;

        const returnPost = TensaoPit.create({
            tensao
        });

        return res.json(returnPost);
    },

};