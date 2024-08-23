const ChecklistRack = require('../model/ChecklistRack');
const ChecklistRackItem = require('../model/ChecklistRackItem');
const ChecklistItemDefault = require('../model/ChecklistItemDefault');
const Usuario = require('../model/Usuario');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { Expo } = require('expo-server-sdk');

module.exports = {

    async index(req, res){

        const returnGet = await ChecklistRack.aggregate([
            { $sort: { createdAt: -1 } },
            {
              $project: {
                nos: 1,
                idcliente: 1,
                status: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$status", "0"] }, then: "Pendente" },
                      { case: { $eq: ["$status", "1"] }, then: "Processando" },
                      { case: { $eq: ["$status", "2"] }, then: "Concluido" },
                    ],
                  },
                },
                dataentrada: {
                  $dateToString: {
                    format: "%d/%m/%Y",
                    date: "$dataentrada",
                  },
                },
              },
            },
            {
              $lookup: {
                from: "clientes",
                localField: "idcliente",
                foreignField: "_id",
                as: "idcliente",
              },
            },
          ]);
        return res.json(returnGet)

    },

    async indexapp(req, res){
        const returnGet = await ChecklistRack.find({status: 0}).sort({createdAt: -1});
        return res.json(returnGet)
    },

    async index_limit(req, res){
        const returnGet = await ChecklistRack.find().sort({createdAt: -1}).limit(parseInt(req.params.limit));
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await ChecklistRack.find({ _id: req.params.id })
        .populate("idcliente");
        return res.json(returnShow)
    },

    async showbyControlid(req, res){

        const returnShow = await ChecklistRack.find(
            {controlid: { $regex: '.*' + req.params.id + '.*', $options: 'i' }}
        );
        
        return res.json(returnShow)
    },

    async showbyStatus(req, res){
    
        const returnShow = await ChecklistRack.find({status: req.params.status})
        .populate("idcliente");
        
        return res.json(returnShow)
    },

    async showbyUser(req, res){
        
        const returnShow = await ChecklistRack.find(
            {idusuario: req.params.iduser}
        )
        
        return res.json(returnShow)
    },

    async countStatus(req, res){
        let totalCount0 = 0;
        let totalCount1 = 0;
        let totalCount2 = 0;
        totalCount0 = await ChecklistRack.countDocuments({ status: 0 });
        totalCount1 = await ChecklistRack.countDocuments({ status: 1 });
        totalCount2 = await ChecklistRack.countDocuments({ status: 2 });

        var result = {
            "totalRecords0" : totalCount0,
            "totalRecords1" : totalCount1,
            "totalRecords2" : totalCount2
        };

        return res.json(result)
    },

    async update(req, res){
        const returnUpdate = await ChecklistRack.updateOne({ _id: req.params.id },req.body);
        const { status, status_comm } = req.body;
        let messages = [];

        if(status == '1'){
            const user = await Usuario.find({ web_appr: true, access_rack: true });
            const checklist = await ChecklistRack.findOne({ _id: req.params.id })
            .populate("idcliente");
            
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
                            subject: 'OS: ' + checklist.nos + ' - Novo Checklist para aprovação [Rack]',
                            text: '[Rack] Novo Checklist para aprovação',
                            template: 'apprpitstop',
                            context: {
                                cliente: checklist.idcliente.nome,
                                cidade: checklist.idcliente.cidade,
                                os: checklist.nos,
                                action_url: 'https://superfrio.netlify.app/checklistrack/' + req.params.id,
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
                            title: "[Rack] Novo Checklist para aprovação",
                            body: "OS: " + checklist.nos + " - Novo checklist aguardando sua aprovação. Entre no ambiente Web para revisar."
                        });
                    }

                };
                
                

            }
        }

        if(status == '0' && typeof status_comm !== 'undefined'){

            const checklist = await ChecklistRack.findOne({ _id: req.params.id });
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
                        subject: 'ID: ' + checklist.controlid + ' - Seu Checklist precisa ser revisado [Rack]',
                        text: '[Rack] Seu Checklist precisa ser revisado.',
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
                        title: "[Rack] Seu checklist foi rejeitado",
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
        const returnDel = await ChecklistRack.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    async store(req, res) {

        const RackItens = await ChecklistItemDefault.find({ type:'rack' }).sort({ordemitem: 1});

        const { 
            dataentrada,
            nos,
            idcliente,
            gas,
            tensao,
            sistema,
            status,
            status_comm,
            pdflink,
            idrequester,
            nomerequester,
            idusuario,
            nomeusuario,
            compressores,
            obsgeral
         } = req.body;

        // não deixar duplicar mesmo controlID

        const returnPost = await ChecklistRack.create({
            dataentrada,
            nos,
            idcliente,
            gas,
            tensao,
            sistema,
            status,
            status_comm,
            pdflink,
            idrequester,
            nomerequester,
            idusuario,
            nomeusuario,
            compressores,
            obsgeral
        });

        const checklistdoc = await ChecklistRack.findOne({ nos });

        RackItens.forEach(async function(item){
            await ChecklistRackItem.create({
                ordemitem: item.ordemitem,
                nomeitem: item.nomeitem,
                idchecklistrack: checklistdoc._id
            });
        });

        return res.json(returnPost);
    },

};





