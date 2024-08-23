const DespesaItem = require('../model/DespesaItem');

module.exports = {

    async index(req, res){

        const returnGet = await DespesaItem.find();
        return res.json(returnGet)
    },

    async aggreg(req, res){
        const returnGet = await DespesaItem.aggregate([
          { $sort: { createdAt: -1 } },
          {
              $project: {
                categoriaText: 1,
                iddespesa: 1,
                valor: 1,
                descr: 1,
                foto: 1
              },
          },
          {
              $lookup: {
                from: "despesas",
                localField: "iddespesa",
                foreignField: "_id",
                as: "iddespesa",
              },
            }
        ]);
    
        return res.json(returnGet);
      },

    async show(req, res){
        const returnShow = await DespesaItem.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showByDespesa(req, res){
        const returnShow = await DespesaItem.find({ iddespesa: req.params.id });
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await DespesaItem.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await DespesaItem.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { descr, foto, valor, categoria, categoriaText ,iddespesa } = req.body;

        const returnPost = DespesaItem.create({
            descr, 
            foto, 
            valor, 
            categoria,
            categoriaText,
            iddespesa
        });

        return res.json(returnPost);
    },

};
