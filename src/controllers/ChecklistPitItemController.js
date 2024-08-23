const ChecklistPitItem = require('../model/ChecklistPitItem');

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistPitItem.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistPitItem.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyCheckList(req, res){
        const returnShow = await ChecklistPitItem.find({ idchecklistpit: req.params.id })
        .sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistPitItem.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistPitItem.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { ordemitem, nomeitem, avaliacao, foto, comentario, idchecklistpit } = req.body;

        const returnPost = ChecklistPitItem.create({
            ordemitem,
            nomeitem,
            avaliacao,
            foto,
            comentario,
            idchecklistpit   
        });

        return res.json(returnPost);
    },

    async storeManual(req, res) {
        const { nomeitem, idchecklistpit } = req.body;
        
        //Search itens based on idchecklistcomp
        //check max orderitem and add +1 
        const checkItens = await ChecklistPitItem.findOne({ idchecklistpit: idchecklistpit }).sort({ordemitem: -1});
        const lastIdx = checkItens.ordemitem;
        const ordemitem = lastIdx +1;

        const returnPost = ChecklistPitItem.create({
            ordemitem,
            nomeitem,
            idchecklistpit     
        });

        return res.json(returnPost);
    },

};






