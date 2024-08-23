const ChecklistItemExitDefault = require('../model/ChecklistItemExitDefault');

module.exports = {

    async index(req, res){
        const returnGet = await ChecklistItemExitDefault.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistItemExitDefault.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyType(req, res){
        const returnShow = await ChecklistItemExitDefault.find({ type: req.params.type }).sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistItemExitDefault.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistItemExitDefault.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { type, ordemitem ,nomeitem } = req.body;
        const returnPost = ChecklistItemExitDefault.create({
            type, 
            ordemitem,
            nomeitem
        });

        return res.json(returnPost);
    },

    async resetDefault(req, res) {
       
        const CompItens = [
            { ordemitem: 1, nomeitem: "Pressão de Descarga (PSIG)" },
            { ordemitem: 2, nomeitem: "Pressão de Sucção (PSIG)" },
            { ordemitem: 3, nomeitem: "Pressão de Alta da Bomba (PSIG)" },
            { ordemitem: 4, nomeitem: "Pressão de Baixa da Bomba (PSIG)" },
            { ordemitem: 5, nomeitem: "Tensão RS" },
            { ordemitem: 6, nomeitem: "Tensão RT" },
            { ordemitem: 7, nomeitem: "Tensão ST" },
            { ordemitem: 8, nomeitem: "Corrente R" },
            { ordemitem: 9, nomeitem: "Corrente S" },
            { ordemitem: 10, nomeitem: "Corrente T" },
            { ordemitem: 11, nomeitem: "Nível de Óleo" }
          ];

          //await ChecklistItemExitDefault.deleteMany({ type: 'compExit' });

          CompItens.forEach(async function(item){
            await ChecklistItemExitDefault.create({
                type:'compExit',
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
            });
        });

        return res.status(200).send();
    },

};