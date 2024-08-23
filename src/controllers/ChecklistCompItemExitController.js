const ChecklistCompItemExit = require('../model/ChecklistCompItemExit');
const ChecklistItemExitDefault = require('../model/ChecklistItemExitDefault');
const ChecklistComp = require("../model/ChecklistComp");

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistCompItemExit.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistCompItemExit.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyCheckList(req, res){
        const returnShow = await ChecklistCompItemExit.find({ idchecklistcomp: req.params.id })
        .sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistCompItemExit.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistCompItemExit.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { ordemitem, nomeitem, avaliacao, foto, comentario, idchecklistcomp } = req.body;

        const returnPost = ChecklistCompItemExit.create({
            ordemitem,
            nomeitem,
            avaliacao,
            foto,
            comentario,
            idchecklistcomp     
        });

        return res.json(returnPost);
    },

    async createExitChecklist(req, res) {
        const CompItensExit = await ChecklistItemExitDefault.find({ type: "compExit" }).sort({
                ordemitem: 1,
        });

        const Comp = await ChecklistComp.updateOne({ _id: req.params.id }, {hasExitChecklist: true, statusExit:"0"})

        CompItensExit.forEach(async function (item) {
            await ChecklistCompItemExit.create({
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
                idchecklistcomp: req.params.id
            });
        });

        return res.status(200).send();
    },

    async storeManual(req, res) {
        const { nomeitem, idchecklistcomp } = req.body;
        
        //Search itens based on idchecklistcomp
        //check max orderitem and add +1 
        const checkItens = await ChecklistCompItemExit.findOne({ idchecklistcomp: idchecklistcomp }).sort({ordemitem: -1});
        const lastIdx = checkItens.ordemitem;
        const ordemitem = lastIdx +1;

        const returnPost = ChecklistCompItemExit.create({
            ordemitem,
            nomeitem,
            idchecklistcomp     
        });

        return res.json(returnPost);
    },

};






