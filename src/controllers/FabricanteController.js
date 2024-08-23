const Fabricante = require('../model/Fabricante');
const ChecklistComp = require('../model/ChecklistComp');

module.exports = {

    async index(req, res){

        const returnGet = await Fabricante.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Fabricante.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await Fabricante.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const checkList = await ChecklistComp.find({ idfabricante: req.params.id });
        if (checkList.length < 1){
            const returnDel = await Fabricante.deleteOne({ _id: req.params.id });
            return res.json(returnDel)
        } else {
            return res.status(200).send({ error: "Não foi possível apagar. Existem Checklists atrelados a esse fabricante." });
        };
    },

    store(req, res) {
        const { nome } = req.body;

        const returnPost = Fabricante.create({
            nome
        });

        return res.json(returnPost);
    },

};