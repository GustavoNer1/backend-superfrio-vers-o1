const Cliente = require('../model/Cliente');
const ChecklistComp = require('../model/ChecklistComp');

module.exports = {

    async index(req, res){

        const returnGet = await Cliente.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Cliente.find({ _id: req.params.id });
        return res.json(returnShow)
    },


    async update(req, res){
        const returnUpdate = await Cliente.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const checkList = await ChecklistComp.find({ idcliente: req.params.id });
        if (checkList.length < 1){
            const returnDel = await Cliente.deleteOne({ _id: req.params.id });
            return res.json(returnDel)
        } else {
            return res.status(200).send({ error: "Não foi possível apagar. Existem Checklists atrelados a esse cliente." });
        };
    },

    store(req, res) {
        const { nome, cidade, uf } = req.body;

        const returnPost = Cliente.create({
            nome, 
            cidade, 
            uf           
        });

        return res.json(returnPost);
    },

};