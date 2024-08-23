const ChecklistPit = require('../model/ChecklistPit');
const ChecklistPitItem = require('../model/ChecklistPitItem');
const ChecklistItemDefault = require('../model/ChecklistItemDefault');
const Usuario = require('../model/Usuario');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { Expo } = require('expo-server-sdk');

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistPit.aggregate([
            { "$sort": { "createdAt": -1 } },
            {
                "$project": {
                    "nserie":1,
                    "controlid":1,
                    "rsocial":1,
                    "tipo": {
                        "$cond": { "if": "0", "then": "Liberação", "else": "Instalação" }
                    },
                    "status": {
                        "$switch": {
                            "branches": [
                                { "case": { "$eq": [ "$status", "0" ] }, "then": "Pendente" },
                                { "case": { "$eq": [ "$status", "1" ]  }, "then": "Processando" },
                                { "case": { "$eq": [ "$status", "2" ] }, "then": "Concluido" }
                            ]
                        }
                    },
                    "dataentrada": {
                        "$dateToString": { 
                            "format": "%d/%m/%Y", 
                            "date": "$dataentrada"
                        }
                    }
                }
            }
          ]);
        return res.json(returnGet)

    },

    async indexapp(req, res){
        const returnGet = await ChecklistPit.find({status: 0}).sort({createdAt: -1});
        return res.json(returnGet)
    },

    async index_limit(req, res){
        const returnGet = await ChecklistPit.find().sort({createdAt: -1}).limit(parseInt(req.params.limit));
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistPit.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showbyControlid(req, res){

        const returnShow = await ChecklistPit.find(
            {controlid: { $regex: '.*' + req.params.id + '.*', $options: 'i' }}
        );
        
        return res.json(returnShow)
    },

    async showbyStatus(req, res){
    
        const returnShow = await ChecklistPit.find(
            {status: req.params.status}
        );
        
        return res.json(returnShow)
    },

    async showbyUser(req, res){
        
        const returnShow = await ChecklistPit.find(
            {idusuario: req.params.iduser}
        )
        
        return res.json(returnShow)
    },

    async countStatus(req, res){
        let totalCount0 = 0;
        let totalCount1 = 0;
        let totalCount2 = 0;
        totalCount0 = await ChecklistPit.countDocuments({ status: 0 });
        totalCount1 = await ChecklistPit.countDocuments({ status: 1 });
        totalCount2 = await ChecklistPit.countDocuments({ status: 2 });

        var result = {
            "totalRecords0" : totalCount0,
            "totalRecords1" : totalCount1,
            "totalRecords2" : totalCount2
        };

        return res.json(result)
    },

   // async update(req, res){
   //     const returnUpdate = await ChecklistPit.updateOne({ _id: req.params.id },req.body);
   //     return res.json(returnUpdate)
   // },

    async update(req, res){
        const returnUpdate = await ChecklistPit.updateOne({ _id: req.params.id },req.body);
        const { status, status_comm } = req.body;
        let messages = [];

        if(status == '1'){
            const user = await Usuario.find({ web_appr: true, access_pit: true });
            const checklist = await ChecklistPit.findOne({ _id: req.params.id });
            
            if (user){
                
                let transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SMTP,
                    port: 465,
                    auth: {
                        user: process.env.EMAIL_ACC,
                        pass: process.env.EMAIL_PWD
                    }
                });
        
                const options = {
                    viewEngine: {
                        extName: ".handlebars",
                        partialsDir: './views/',
                        defaultLayout: false
                    },
                    viewPath: './views/',
                    extName: ".handlebars"
                };
        
                console.log(user);

                transporter.use('compile', hbs(options));

                for (const item of user) {

                    try {
                        await transporter.sendMail({
                            from: 'App Superfrio <app@superfriosr.com.br>',
                            to: item.email,
                            //bcc:'suporte@c2t.com.br',
                            subject: 'ID: ' + checklist.controlid + ' - Novo Checklist para aprovação [Pit-Stop]',
                            text: '[Pit-Stop] Novo Checklist para aprovação',
                            template: 'apprpitstop',
                            context: {
                                cliente: checklist.rsocial,
                                os: checklist.controlid,
                                action_url: 'https://superfrio.netlify.app/checklistpit/' + req.params.id,
                                support_email: 'mailto:app@superfriosr.com.br'
                            }
                        });
                     } catch (err) {
                        console.log(err);
                     }
                    
                    if(item.pushToken){
                        // const headers = {
                        //     host: 'exp.host',
                        //     Accept: 'application/json',
                        //     'Accept-encoding': 'gzip, deflate',
                        //     'Content-Type': 'application/json'
                        // }
            
                        // const datastore = {
                        //     "to": item.pushToken,
                        //     //"to":"ExponentPushToken[4PbdO0M7a-4DJ6pXsKfqps]",
                        //     "sound": "default",
                        //     "title":"[Pit-Stop] Novo Checklist para aprovação",
                        //     "body": "ID: " + checklist.controlid + " - Novo checklist aguardando sua aprovação. Entre no ambiente Web para revisar.",
                        //     "_displayInForeground": "true"
                        // }
            
                        // //Envia push notification para o mobile
                        // axios.post('https://exp.host/--/api/v2/push/send', datastore, {
                        //     headers: headers
                        // });

                        messages.push({
                            to: item.pushToken,
                            sound: 'default',
                            priority: 'high',
                            wake_screen: true,
                            show_in_foreground: true,
                            title: "[Pit-Stop] Novo Checklist para aprovação",
                            body: "ID: " + checklist.controlid + " - Novo checklist aguardando sua aprovação. Entre no ambiente Web para revisar."
                        });
                    }

                };
                
                

            }
        }

        if(status == '0' && typeof status_comm !== 'undefined'){

            const checklist = await ChecklistPit.findOne({ _id: req.params.id });
            const user = await Usuario.findOne({ _id: checklist.idusuario} );
        

            if (user){

                let transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SMTP,
                    port: 465,
                    auth: {
                        user: process.env.EMAIL_ACC,
                        pass: process.env.EMAIL_PWD
                    }
                });
        
                const options = {
                    viewEngine: {
                        extName: ".handlebars",
                        partialsDir: './views/',
                        defaultLayout: false
                    },
                    viewPath: './views/',
                    extName: ".handlebars"
                };
        
                transporter.use('compile', hbs(options));

                
                try {
                    await transporter.sendMail({
                        from: 'App Superfrio <app@superfriosr.com.br>',
                        to: user.email,
                        //bcc:'suporte@c2t.com.br',
                        subject: 'ID: ' + checklist.controlid + ' - Seu Checklist precisa ser revisado [Pit-Stop]',
                        text: '[Pit-Stop] Seu Checklist precisa ser revisado.',
                        template: 'rejpitstop',
                        context: {
                            cliente: checklist.rsocial,
                            os: checklist.controlid,
                            comm: checklist.status_comm,
                            support_email: 'mailto:app@superfriosr.com.br'
                        }
                    });
                 } catch (err) {
                    console.log(err);
                 }
                
                if(user.pushToken){
                    // const headers = {
                    //     host: 'exp.host',
                    //     Accept: 'application/json',
                    //     'Accept-encoding': 'gzip, deflate',
                    //     'Content-Type': 'application/json'
                    // }
        
                    // const datastore = {
                    //     "to": user.pushToken,
                    //     //"to":"ExponentPushToken[4PbdO0M7a-4DJ6pXsKfqps]",
                    //     "sound": "default",
                    //     "title":"[Pit-Stop] Seu checklist foi rejeitado.",
                    //     "body": 'Por favor revise seu checklist ID: ' + checklist.controlid,
                    //     "_displayInForeground": "true"
                    // }
        
                    // //Envia push notification para o mobile
                    // axios.post('https://exp.host/--/api/v2/push/send', datastore, {
                    //     headers: headers
                    // });
                    messages.push({
                        to: user.pushToken,
                        sound: 'default',
                        priority: 'high',
                        wake_screen: true,
                        show_in_foreground: true,
                        title: "[Pit-Stop] Seu checklist foi rejeitado",
                        body: 'Por favor revise seu checklist ID: ' + checklist.controlid,
                    });
                }
                

            }
        }
        
        if(messages.length > 0) {
            let expo = new Expo();
            let chunks = expo.chunkPushNotifications(messages);
            (async () => {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    //console.log(ticketChunk);
                    //tickets.push(...ticketChunk);
                    // NOTE: If a ticket contains an error code in ticket.details.error, you
                    // must handle it appropriately. The error codes are listed in the Expo
                    // documentation:
                    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                    } catch (error) {
                    console.error(error);
                    }
            }
            })();
        }

        return res.json(returnUpdate)

    },

    async delete(req, res){
        const returnDel = await ChecklistPit.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    async store(req, res) {

        const PitItens = await ChecklistItemDefault.find({ type:'pit' }).sort({ordemitem: 1});

        // const PitItens = [
        //     { ordemitem: 1, nomeitem: "Foto Pit Stop c/ Toldo Aberto" },
        //     { ordemitem: 2, nomeitem: "Foto Pit Stop c/ Toldo Fechado" },
        //     { ordemitem: 3, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Fechada" },
        //     { ordemitem: 4, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Aberta e Toldo Fechado" },
        //     { ordemitem: 5, nomeitem: "Foto Pit Stop Lateral Direira c/ Portal Aberta e Toldo Aberto" },
        //     { ordemitem: 6, nomeitem: "Foto Pit Stop Lateral Esquerda" },
        //     { ordemitem: 7, nomeitem: "Foto Material de EPI" },
        //     { ordemitem: 8, nomeitem: "Foto Porta Câmara Parte Interna" },
        //     { ordemitem: 9, nomeitem: "Foto Parte Interna Expositor" },
        //     { ordemitem: 10, nomeitem: "Foto Parte Interna Câmara" },
        //     { ordemitem: 11, nomeitem: "Foto Pit Stop Parte Traseira" },
        //     { ordemitem: 12, nomeitem: "Foto do Evaporador" },
        //     { ordemitem: 13, nomeitem: "Foto do Adesivo de Empilhamento" },
        //     { ordemitem: 14, nomeitem: "Foto do LED" },
        //     { ordemitem: 15, nomeitem: "Foto do Painel de Controle Atingindo Temperatura" },
        //     { ordemitem: 16, nomeitem: "Foto da Unidade Condensadora" },
        //     { ordemitem: 17, nomeitem: "Foto do Nº serie e modelo da unidade condensadora" },
        //     { ordemitem: 18, nomeitem: "Foto do Nº serie e modelo do evaporador" },
        //     { ordemitem: 19, nomeitem: "Foto do Toldo Galpão" },
        //     { ordemitem: 20, nomeitem: "Foto do Toldo Lateral" },
        //     { ordemitem: 21, nomeitem: "Foto do Toldo Vitrine" },            
        //     { ordemitem: 22, nomeitem: "Foto Câmara Frente" },  
        //     { ordemitem: 23, nomeitem: "Foto Câmara Lateral Direita" },  
        //     { ordemitem: 24, nomeitem: "Foto Câmara Lateral Esquerda" },  
        //     { ordemitem: 25, nomeitem: "Foto Câmara Traseira" },
        //     { ordemitem: 26, nomeitem: "Armário aço" },
        //     { ordemitem: 27, nomeitem: "Gondola 800X1800X400 MM" },
        //     { ordemitem: 28, nomeitem: "Gondola 2630X150X1700MM" },
        //     { ordemitem: 29, nomeitem: "Gaveteiro Suspenso" },
        //     { ordemitem: 30, nomeitem: "Organizadores de Comanda" },
        //     { ordemitem: 31, nomeitem: "Cofre Mecânico" },
        //     { ordemitem: 32, nomeitem: "Painel digital de temperatura" },
        //     { ordemitem: 33, nomeitem: "Display de piso" },
        //     { ordemitem: 34, nomeitem: "Totem de sinalização" },
        //     { ordemitem: 35, nomeitem: "Precificador" },
        //     { ordemitem: 36, nomeitem: "Limitador de abertura Luminoso/pórtico" }
        //   ];

        const { 
            dataentrada, 
            controlid, 
            nserie, 
            CNPJ, 
            rsocial, 
            comentarios, 
            status, 
            tipo, 
            pdflink, 
            idrequester, 
            nomerequester, 
            idusuario, 
            nomeusuario, 
            obsgeral, 
            tensao, 
            marca,
            cidade,
            uf,
            chave
         } = req.body;

        // não deixar duplicar mesmo controlID

        const returnPost = await ChecklistPit.create({
            dataentrada,            
            nserie,
            controlid,
            CNPJ,
            rsocial,
            comentarios,
            status,
            tipo,
            pdflink,
            idusuario,
            idrequester,
            nomerequester,
            nomeusuario,
            obsgeral,
            tensao,
            marca,
            cidade,
            uf,
            chave
        });

        const checklistdoc = await ChecklistPit.findOne({ controlid: controlid });

        PitItens.forEach(async function(item){
            await ChecklistPitItem.create({
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
                idchecklistpit: checklistdoc._id
            });
        });

        return res.json(returnPost);
    },

};





