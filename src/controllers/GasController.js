const Gas = require('../model/Gas');
const ChecklistRack = require('../model/ChecklistRack');

module.exports = {

    async index(req, res){

        const returnGet = await Gas.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Gas.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Gas.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const checkList = await ChecklistRack.find({ gas: req.params.id });
        if (checkList.length < 1){
            const returnDel = await Gas.deleteOne({ _id: req.params.id });
            return res.json(returnDel)
        } else {
            return res.status(200).send({ error: "Não foi possível apagar. Existem Checklists atrelados a esse Gas." });
        };
    },

    store(req, res) {
        const { nome } = req.body;

        const returnPost = Gas.create({
            nome
        });

        return res.json(returnPost);
    },

};