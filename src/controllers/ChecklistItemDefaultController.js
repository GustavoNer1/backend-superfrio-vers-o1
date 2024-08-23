const ChecklistItemDefault = require('../model/ChecklistItemDefault');

module.exports = {

    async index(req, res){
        const returnGet = await ChecklistItemDefault.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistItemDefault.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyType(req, res){
        const returnShow = await ChecklistItemDefault.find({ type: req.params.type }).sort({ordemitem: 1});
        return res.json(returnShow)
    },

    async update(req, res){
        const returnUpdate = await ChecklistItemDefault.updateOne({ _id: req.params.id },req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await ChecklistItemDefault.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    store(req, res) {
        const { type, ordemitem ,nomeitem } = req.body;
        const returnPost = ChecklistItemDefault.create({
            type, 
            ordemitem,
            nomeitem
        });

        return res.json(returnPost);
    },

    async resetDefault(req, res) {
       
        const CompItens = [
            { ordemitem: 1, nomeitem: "Foto Inicial Frente" },
            { ordemitem: 2, nomeitem: "Foto Inicial Lado Esquerdo" },
            { ordemitem: 3, nomeitem: "Foto Inicial Lado Direito" },
            { ordemitem: 4, nomeitem: "Foto Inicial Traseira" },
            { ordemitem: 5, nomeitem: "Anel de Encosto" },
            { ordemitem: 6, nomeitem: "Anel Retentor" },
            { ordemitem: 7, nomeitem: "Biela" },
            { ordemitem: 8, nomeitem: "Bobina Elétrica" },
            { ordemitem: 9, nomeitem: "Bomba de Óleo" },
            { ordemitem: 10, nomeitem: "Buchas (Mancal, Motor, Tampa)" },
            { ordemitem: 11, nomeitem: "Bujões" },
            { ordemitem: 12, nomeitem: "Cabeçote" },
            { ordemitem: 13, nomeitem: "Camisa Cilindro" },
            { ordemitem: 14, nomeitem: "Carcaça" },
            { ordemitem: 15, nomeitem: "Controle De Capacidade" },
            { ordemitem: 16, nomeitem: "Contrapeso Virabrequim" },
            { ordemitem: 17, nomeitem: "Estator / Rotor" },
            { ordemitem: 18, nomeitem: "Filtro De Óleo / Bujão Magnético" },
            { ordemitem: 19, nomeitem: "Filtro Sucção" },
            { ordemitem: 20, nomeitem: "Flange Elétrica" },
            { ordemitem: 21, nomeitem: "Flange Cega Descarga" },
            { ordemitem: 22, nomeitem: "Flange Cega Sucção" },
            { ordemitem: 23, nomeitem: "Guarnições" },
            { ordemitem: 24, nomeitem: "Pino (Pistão)" },
            { ordemitem: 25, nomeitem: "Pintura" },
            { ordemitem: 26, nomeitem: "Pistão" },
            { ordemitem: 27, nomeitem: "Placa De Válvula" },
            { ordemitem: 28, nomeitem: "Pressostato De Óleo" },
            { ordemitem: 29, nomeitem: "Resistência De Cárter" },
            { ordemitem: 30, nomeitem: "Sistema Retorno De Óleo" },
            { ordemitem: 31, nomeitem: "Tampa Da Base" },
            { ordemitem: 32, nomeitem: "Tampa Do Motor" },
            { ordemitem: 33, nomeitem: "Válvula Reguladora De Pressão Bomba de Óleo" },
            { ordemitem: 34, nomeitem: "Válvula Schrader" },
            { ordemitem: 35, nomeitem: "Válvula T-Schrader" },
            { ordemitem: 36, nomeitem: "Válvula De Equalização" },
            { ordemitem: 37, nomeitem: "Válvula De Alívio (Segurança)" },
            { ordemitem: 38, nomeitem: "Virabrequim" },
            { ordemitem: 39, nomeitem: "Etiqueta" }
          ];

          await ChecklistItemDefault.deleteMany({ type: 'comp' });

          CompItens.forEach(async function(item){
            await ChecklistItemDefault.create({
                type:'comp',
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
            });
        });

        const PitItens = [
            { ordemitem: 1, nomeitem: "Foto Pit Stop c/ Toldo Aberto" },
            { ordemitem: 2, nomeitem: "Foto Pit Stop c/ Toldo Fechado" },
            { ordemitem: 3, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Fechada" },
            { ordemitem: 4, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Aberta e Toldo Fechado" },
            { ordemitem: 5, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Aberta e Toldo Aberto" },
            { ordemitem: 6, nomeitem: "Foto Pit Stop Lateral Esquerda" },
            { ordemitem: 7, nomeitem: "Foto Material de EPI" },
            { ordemitem: 8, nomeitem: "Foto Porta Câmara Parte Interna" },
            { ordemitem: 9, nomeitem: "Foto Parte Interna Expositor" },
            { ordemitem: 10, nomeitem: "Foto Parte Interna Câmara" },
            { ordemitem: 11, nomeitem: "Foto Pit Stop Parte Traseira" },
            { ordemitem: 12, nomeitem: "Foto do Evaporador" },
            { ordemitem: 13, nomeitem: "Foto do Adesivo de Empilhamento" },
            { ordemitem: 14, nomeitem: "Foto do LED" },
            { ordemitem: 15, nomeitem: "Foto do Painel de Controle Atingindo Temperatura" },
            { ordemitem: 16, nomeitem: "Foto da Unidade Condensadora" },
            { ordemitem: 17, nomeitem: "Foto do Nº serie e modelo da unidade condensadora" },
            { ordemitem: 18, nomeitem: "Foto do Nº serie e modelo do evaporador" },
            { ordemitem: 19, nomeitem: "Foto do Toldo Galpão" },
            { ordemitem: 20, nomeitem: "Foto do Toldo Lateral" },
            { ordemitem: 21, nomeitem: "Foto do Toldo Vitrine" },            
            { ordemitem: 22, nomeitem: "Foto Câmara Frente" },  
            { ordemitem: 23, nomeitem: "Foto Câmara Lateral Direita" },  
            { ordemitem: 24, nomeitem: "Foto Câmara Lateral Esquerda" },  
            { ordemitem: 25, nomeitem: "Foto Câmara Traseira" },
            { ordemitem: 26, nomeitem: "Armário aço" },
            { ordemitem: 27, nomeitem: "Gondola 800X1800X400 MM" },
            { ordemitem: 28, nomeitem: "Gondola 2630X150X1700MM" },
            { ordemitem: 29, nomeitem: "Gaveteiro Suspenso" },
            { ordemitem: 30, nomeitem: "Organizadores de Comanda" },
            { ordemitem: 31, nomeitem: "Cofre Mecânico" },
            { ordemitem: 32, nomeitem: "Painel digital de temperatura" },
            { ordemitem: 33, nomeitem: "Display de piso" },
            { ordemitem: 34, nomeitem: "Totem de sinalização" },
            { ordemitem: 35, nomeitem: "Precificador" },
            { ordemitem: 36, nomeitem: "Limitador de abertura Luminoso/pórtico" }
          ];

          await ChecklistItemDefault.deleteMany({ type: 'pit' });

          PitItens.forEach(async function(item){
            await ChecklistItemDefault.create({
                type:'pit',
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
            });
        });

        return res.status(200).send();
    },

};