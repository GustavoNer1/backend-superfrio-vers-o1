const ChecklistComp = require("../model/ChecklistComp");
const ChecklistCompItem = require("../model/ChecklistCompItem");
const ChecklistCompItemExit = require("../model/ChecklistCompItemExit");
const ChecklistItemDefault = require("../model/ChecklistItemDefault");
const ChecklistItemExitDefault = require("../model/ChecklistItemExitDefault");
const Usuario = require("../model/Usuario");
const querystring = require("querystring");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { Expo } = require("expo-server-sdk");

module.exports = {
  async index(req, res) {
    const returnGet = await ChecklistComp.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $project: {
          nserie: 1,
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
          statusExit: 1,
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

    return res.json(returnGet);
  },

  async indexapp(req, res) {
    const returnGet = await ChecklistComp.find({ status: 0 })
      .populate("idcliente")
      .sort({ createdAt: -1 });
    return res.json(returnGet);
  },

  async index_limit(req, res) {
    const returnGet = await ChecklistComp.find()
      .populate("idcliente")
      .sort({ createdAt: -1 })
      .limit(parseInt(req.params.limit));
    return res.json(returnGet);
  },

  async countType(req, res) {
    let totalCount0 = 0;
    let totalCount1 = 0;
    totalCount0 = await ChecklistComp.countDocuments({ hasExitChecklist: null });
    totalCount1 = await ChecklistComp.countDocuments({ hasExitChecklist: true });

    var result = {
      totalRecords0: totalCount0,
      totalRecords1: totalCount1,
    };

    return res.json(result);
  },

  async countStatus(req, res) {
    let totalCount0 = 0;
    let totalCount1 = 0;
    let totalCount2 = 0;
    totalCount0 = await ChecklistComp.countDocuments({ status: 0 });
    totalCount1 = await ChecklistComp.countDocuments({ status: 1 });
    totalCount2 = await ChecklistComp.countDocuments({ status: 2 });

    var result = {
      totalRecords0: totalCount0,
      totalRecords1: totalCount1,
      totalRecords2: totalCount2,
    };

    return res.json(result);
  },

  async countExitStatus(req, res) {
    let totalCount0 = 0;
    let totalCount1 = 0;
    let totalCount2 = 0;
    totalCount0 = await ChecklistComp.countDocuments({ statusExit: 0, hasExitChecklist: true });
    totalCount1 = await ChecklistComp.countDocuments({ statusExit: 1, hasExitChecklist: true });
    totalCount2 = await ChecklistComp.countDocuments({ statusExit: 2, hasExitChecklist: true });

    var result = {
      totalRecords0: totalCount0,
      totalRecords1: totalCount1,
      totalRecords2: totalCount2,
    };

    return res.json(result);
  },

  async show(req, res) {
    const returnShow = await ChecklistComp.find({ _id: req.params.id })
      .populate("idcliente")
      .populate("idcompressor")
      .populate("idfabricante");
    return res.json(returnShow);
  },

  async showbySearch(req, res) {
    const querystr = querystring.parse(req.params.query);

    const returnShow = await ChecklistComp.find(querystr)
      .populate("idcliente")
      .populate("idcompressor");

    return res.json(returnShow);
  },

  async showbyOS(req, res) {
    const returnShow = await ChecklistComp.find({
      nos: { $regex: ".*" + req.params.nos + ".*", $options: "i" },
    })
      .populate("idcliente")
      .populate("idcompressor");

    return res.json(returnShow);
  },

  async showbyUser(req, res) {
    const returnShow = await ChecklistComp.find({
      idusuario: req.params.iduser,
    })
      .populate("idcliente")
      .populate("idcompressor")
      .populate("idfabricante");

    return res.json(returnShow);
  },

  async showbyStatus(req, res) {
    const returnShow = await ChecklistComp.find({ status: req.params.status })
      .populate("idcliente")
      .populate("idcompressor");

    return res.json(returnShow);
  },

  async showbyStatusExit(req, res) {
    const returnShow = await ChecklistComp.find({ statusExit: req.params.status, hasExitChecklist: true })
      .populate("idcliente")
      .populate("idcompressor");
    
    return res.json(returnShow);
  },

  async update(req, res) {
    const returnUpdate = await ChecklistComp.updateOne(
      { _id: req.params.id },
      req.body
    );
    const { status, status_comm } = req.body;
    let messages = [];

    if (status == "1") {
      const user = await Usuario.find({ web_appr: true, access_comp: true });
      const checklist = await ChecklistComp.findOne({
        _id: req.params.id,
      }).populate("idcliente");

      if (user) {
        let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SMTP,
          port: 465,
          auth: {
            user: process.env.EMAIL_ACC,
            pass: process.env.EMAIL_PWD,
          },
        });

        const options = {
          viewEngine: {
            extName: ".handlebars",
            partialsDir: "./views/",
            defaultLayout: false,
          },
          viewPath: "./views/",
          extName: ".handlebars",
        };

        transporter.use("compile", hbs(options));

        for (const item of user) {

          try {
            await transporter.sendMail({
              from: "App Superfrio <app@superfriosr.com.br>",
              to: item.email,
              //bcc:'suporte@c2t.com.br',
              subject:
                "OS: " +
                checklist.nos +
                " - Novo Checklist para aprovação [Compressor]",
              text: "[Compressor] Novo Checklist para aprovação",
              template: "apprcompressor",
              context: {
                cliente: checklist.idcliente.nome,
                cidade: checklist.idcliente.cidade,
                os: checklist.nos,
                action_url:
                  "https://superfrio.netlify.app/checklistcomp/" + req.params.id,
                support_email: "mailto:app@superfriosr.com.br",
              },
            });
         } catch (err) {
            console.log(err);
         } 

          if (item.pushToken) {
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
            //     "title":"[Compressor] Novo Checklist para aprovação",
            //     "body": "OS: " + checklist.nos + " - Novo checklist aguardando sua aprovação. Entre no ambiente Web para revisar.",
            //     "_displayInForeground": "true"
            // }

            // //Envia push notification para o mobile
            // axios.post('https://exp.host/--/api/v2/push/send', datastore, {
            //     headers: headers
            // });

            // Create the messages that you want to send to clients

            // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)

            messages.push({
              to: item.pushToken,
              sound: "default",
              priority: "high",
              wake_screen: true,
              show_in_foreground: true,
              title: "[Compressor] Novo Checklist para aprovação",
              body:
                "OS: " +
                checklist.nos +
                " - Novo checklist aguardando sua aprovação. Entre no ambiente Web para revisar.",
            });
          }
        }
      }
    }

    if (status == "0" && typeof status_comm !== "undefined") {
      const checklist = await ChecklistComp.findOne({
        _id: req.params.id,
      }).populate("idcliente");
      const user = await Usuario.findOne({ _id: checklist.idusuario });

      if (user) {
        let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SMTP,
          port: 465,
          auth: {
            user: process.env.EMAIL_ACC,
            pass: process.env.EMAIL_PWD,
          },
        });

        const options = {
          viewEngine: {
            extName: ".handlebars",
            partialsDir: "./views/",
            defaultLayout: false,
          },
          viewPath: "./views/",
          extName: ".handlebars",
        };

        transporter.use("compile", hbs(options));


        try {
          await transporter.sendMail({
            from: "App Superfrio <app@superfriosr.com.br>",
            to: user.email,
            //bcc:'suporte@c2t.com.br',
            subject:
              "OS: " +
              checklist.nos +
              " - Seu Checklist precisa ser revisado [Compressor]",
            text: "[Compressor] Seu Checklist precisa ser revisado.",
            template: "rejcompressor",
            context: {
              cliente: checklist.idcliente.nome,
              cidade: checklist.idcliente.cidade,
              os: checklist.nos,
              comm: checklist.status_comm,
              support_email: "mailto:app@superfriosr.com.br",
            },
          });
       } catch (err) {
          console.log(err);
       }


       

        if (user.pushToken) {
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
          //     "title":"[Compressor] Seu Checklist foi rejeitado.",
          //     "body": 'Por favor revise seu checklist OS: ' + checklist.nos,
          //     "_displayInForeground": "true"
          // }

          // //Envia push notification para o mobile
          // axios.post('https://exp.host/--/api/v2/push/send', datastore, {
          //     headers: headers
          // });

          messages.push({
            to: user.pushToken,
            sound: "default",
            priority: "high",
            wake_screen: true,
            show_in_foreground: true,
            title: "[Compressor] Seu Checklist foi rejeitado",
            body: "Por favor revise seu checklist OS: " + checklist.nos,
          });
        }
      }
    }
    if (messages.length > 0) {
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
    return res.json(returnUpdate);
  },

  async delete(req, res) {
    const returnDel = await ChecklistComp.deleteOne({ _id: req.params.id });
    return res.json(returnDel);
  },

  async store(req, res) {
    const CompItens = await ChecklistItemDefault.find({ type: "comp" }).sort({
      ordemitem: 1,
    });

    // const CompItensExit = await ChecklistItemExitDefault.find({ type: "compExit" }).sort({
    //   ordemitem: 1,
    // });

    // const CompItens = [
    //     { ordemitem: 1, nomeitem: "Foto Inicial Frente" },
    //     { ordemitem: 2, nomeitem: "Foto Inicial Lado Esquerdo" },
    //     { ordemitem: 3, nomeitem: "Foto Inicial Lado Direito" },
    //     { ordemitem: 4, nomeitem: "Foto Inicial Traseira" },
    //     { ordemitem: 5, nomeitem: "Anel de Encosto" },
    //     { ordemitem: 6, nomeitem: "Anel Retentor" },
    //     { ordemitem: 7, nomeitem: "Biela" },
    //     { ordemitem: 8, nomeitem: "Bobina Elétrica" },
    //     { ordemitem: 9, nomeitem: "Bomba de Óleo" },
    //     { ordemitem: 10, nomeitem: "Buchas (Mancal, Motor, Tampa)" },
    //     { ordemitem: 11, nomeitem: "Bujões" },
    //     { ordemitem: 12, nomeitem: "Cabeçote" },
    //     { ordemitem: 13, nomeitem: "Camisa Cilindro" },
    //     { ordemitem: 14, nomeitem: "Carcaça" },
    //     { ordemitem: 15, nomeitem: "Controle De Capacidade" },
    //     { ordemitem: 16, nomeitem: "Contrapeso Virabrequim" },
    //     { ordemitem: 17, nomeitem: "Estator / Rotor" },
    //     { ordemitem: 18, nomeitem: "Filtro De Óleo / Bujão Magnético" },
    //     { ordemitem: 19, nomeitem: "Filtro Sucção" },
    //     { ordemitem: 20, nomeitem: "Flange Elétrica" },
    //     { ordemitem: 21, nomeitem: "Flange Cega Descarga" },"'''''''''''''''''  /g;nmhjhçjjloioiuuyuyyyyyuuijqq"
    //     { ordemitem: 22, nomeitem: "Flange Cega Sucção" },
    //     { ordemitem: 23, nomeitem: "Guarnições" },
    //     { ordemitem: 24, nomeitem: "Pino (Pistão)" },
    //     { ordemitem: 25, nomeitem: "Pintura" },
    //     { ordemitem: 26, nomeitem: "Pistão" },
    //     { ordemitem: 27, nomeitem: "Placa De Válvula" },
    //     { ordemitem: 28, nomeitem: "Pressostato De Óleo" },
    //     { ordemitem: 29, nomeitem: "Resistência De Cárter" },
    //     { ordemitem: 30, nomeitem: "Sistema Retorno De Óleo" },
    //     { ordemitem: 31, nomeitem: "Tampa Da Base" },
    //     { ordemitem: 32, nomeitem: "Tampa Do Motor" },
    //     { ordemitem: 33, nomeitem: "Válvula Reguladora De Pressão Bomba de Óleo" },
    //     { ordemitem: 34, nomeitem: "Válvula Schrader" },
    //     { ordemitem: 35, nomeitem: "Válvula T-Schrader" },
    //     { ordemitem: 36, nomeitem: "Válvula De Equalização" },
    //     { ordemitem: 37, nomeitem: "Válvula De Alívio (Segurança)" },
    //     { ordemitem: 38, nomeitem: "Virabrequim" },
    //     { ordemitem: 39, nomeitem: "Etiqueta" }
    //   ];

    const {
      nserie,
      dataentrada,
      tensao,
      gas,
      nativo,
      nos,
      garantia,
      osgarantia,
      comentarios,
      status,
      idcliente,
      idcompressor,
      idfabricante,
      idrequester,
      nomerequester,
      idusuario,
      nomeusuario,
      obsgeral,
    } = req.body;

    // não deixar duplicar mesma OS (nos)

    const returnPost = await ChecklistComp.create({
      nserie,
      dataentrada,
      tensao,
      gas,
      nativo,
      nos,
      garantia,
      osgarantia,
      comentarios,
      status,
      idcliente,
      idcompressor,
      idfabricante,
      idrequester,
      nomerequester,
      idusuario,
      nomeusuario,
      obsgeral,
    });

    const checklistdoc = await ChecklistComp.findOne({ nos });

    CompItens.forEach(async function (item) {
      await ChecklistCompItem.create({
        ordemitem: item.ordemitem,
        nomeitem: item.nomeitem,
        idchecklistcomp: checklistdoc._id,
      });
    });

    // CompItensExit.forEach(async function (item) {
    //   await ChecklistCompItemExit.create({
    //     ordemitem: item.ordemitem,
    //     nomeitem: item.nomeitem,
    //     idchecklistcomp: checklistdoc._id,
    //   });
    // });

    return res.json(returnPost);
  },
};
