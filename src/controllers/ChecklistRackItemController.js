const ChecklistRackItem = require('../model/ChecklistRackItem');

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistRackItem.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistRackItem.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyCheckList(req, res){
        const returnShow = await ChecklistRackItem.find({ idchecklistrack: req.params.id })
        .sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistRackItem.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistRackItem.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { ordemitem, nomeitem, avaliacao, foto, comentario, idchecklistrack } = req.body;

        const returnPost = ChecklistRackItem.create({
            ordemitem,
            nomeitem,
            avaliacao,
            foto,
            comentario,
            idchecklistrack   
        });

        return res.json(returnPost);
    },

    async storeManual(req, res) {
        const { nomeitem, idchecklistrack } = req.body;
        
        //Search itens based on idchecklistcomp
        //check max orderitem and add +1 
        const checkItens = await ChecklistRackItem.findOne({ idchecklistrack: idchecklistrack }).sort({ordemitem: -1});
        const lastIdx = checkItens.ordemitem;
        const ordemitem = lastIdx +1;

        const returnPost = ChecklistRackItem.create({
            ordemitem,
            nomeitem,
            idchecklistrack
        });

        return res.json(returnPost);
    },

};






