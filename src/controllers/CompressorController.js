const Compressor = require('../model/Compressor');
const ChecklistComp = require('../model/ChecklistComp');

module.exports = {

    async index(req, res){

        const returnGet = await Compressor.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Compressor.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Compressor.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const checkList = await ChecklistComp.find({ idcompressor: req.params.id });
        if (checkList.length < 1){
            const returnDel = await Compressor.deleteOne({ _id: req.params.id });
            return res.json(returnDel)
        } else {
            return res.status(200).send({ error: "Não foi possível apagar. Existem Checklists atrelados a esse modelo." });
        };
    },

    store(req, res) {
        const { modelo } = req.body;

        const returnPost = Compressor.create({
            modelo       
        });

        return res.json(returnPost);
    },

};