const ChecklistCompItem = require('../model/ChecklistCompItem');

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistCompItem.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistCompItem.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyCheckList(req, res){
        const returnShow = await ChecklistCompItem.find({ idchecklistcomp: req.params.id })
        .sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistCompItem.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistCompItem.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { ordemitem, nomeitem, avaliacao, foto, comentario, idchecklistcomp } = req.body;

        const returnPost = ChecklistCompItem.create({
            ordemitem,
            nomeitem,
            avaliacao,
            foto,
            comentario,
            idchecklistcomp     
        });

        return res.json(returnPost);
    },

    async storeManual(req, res) {
        const { nomeitem, idchecklistcomp } = req.body;
        
        //Search itens based on idchecklistcomp
        //check max orderitem and add +1 
        const checkItens = await ChecklistCompItem.findOne({ idchecklistcomp: idchecklistcomp }).sort({ordemitem: -1});
        const lastIdx = checkItens.ordemitem;
        const ordemitem = lastIdx +1;

        const returnPost = ChecklistCompItem.create({
            ordemitem,
            nomeitem,
            idchecklistcomp     
        });

        return res.json(returnPost);
    },

};






