const Despesa = require('../model/Despesa');
const Usuario = require("../model/Usuario");
const DespesaAreaAppr = require("../model/DespesaAreaAppr");
const DespesaItem = require('../model/DespesaItem');
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = {

    async index(req, res){

        const returnGet = await Despesa.find();
        return res.json(returnGet)
    },

    async show(req, res){
        const returnShow = await Despesa.find({ _id: req.params.id });
        return res.json(returnShow)
    },

    async showByRequester(req, res){
        const returnShow = await Despesa.find({ idrequester: req.params.id }).sort({ createdAt: -1 });
        return res.json(returnShow)
    },

    async showByPending(req, res){
      const returnShow = await Despesa.find({ idaprovador: req.params.id, status: 1 });
      return res.json(returnShow)
    },

    async showByAppRej(req, res){
      const returnShow = await Despesa.find({ idaprovador: req.params.id, status: {$in: [2,3] }}).sort({ createdAt: -1 });
      return res.json(returnShow)
    },

    async countByRequester(req, res){
        const returnShow = await Despesa.countDocuments({ idrequester: req.params.id });
        return res.json(returnShow)
    },

    async countByPending(req, res){
      console.log(req.params.id);
      const returnShow = await Despesa.countDocuments({ status: 1, idaprovador: req.params.id });
      return res.json(returnShow)
  },

    async update(req, res){
        const returnUpdate = await Despesa.updateOne({ _id: req.params.id },req.body);
        const DespesaDoc = await Despesa.findOne({ _id: req.params.id });
        const { status } = req.body;
        let messages = [];

        if (status == "1") { //envia para aprovação
          const requester = await Usuario.find({ _id: DespesaDoc.idrequester });
          const reqArea = await DespesaAreaAppr.find({_id: requester[0].idarea});
          let user = await Usuario.find({ _id: reqArea[0].idaprovador });

          if(requester[0]._id == user[0]._id) {
            const returnUpdate3 = await Despesa.updateOne({ _id: req.params.id },{idaprovador: user[0]._id, nomeaprovador: user[0].nome, status: 2});
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
                    //to: "cleber.znch@gmail.com",
                    bcc: "cleber.znch@gmail.com",
                    subject:
                      "Seu Relatório de despesas foi aprovado",
                    text: "Seu Relatório de despesas foi aprovado",
                    template: "apprdespesaAprovado",
                    context: {
                      numero: DespesaDoc.numero,
                      requester: DespesaDoc.nomerequester,
                      //data: DespesaDoc.updatedAt,
                      aprovador: DespesaDoc.nomeaprovador,
                      obsgeral: DespesaDoc.obsgeral,
                      titulo: "Seu Relatório de despesas foi aprovado",
                      status: "Aprovado",
                      support_email: "mailto:app@superfriosr.com.br",
                    },
                  });
               } catch (err) {
                  console.log(err);
               } 
      
                if (item.pushToken) {
                  messages.push({
                    to: item.pushToken,
                    sound: "default",
                    priority: "high",
                    wake_screen: true,
                    show_in_foreground: true,
                    title: "Seu Relatório de despesas foi aprovado",
                    body:
                      "Seu Relatório de despesas foi aprovado. Revise pelo App Superfrio.",
                  });
                }
              }

              sendFinalEmail(DespesaDoc, messages, transporter);

            }
            return res.json(returnUpdate)
          }

          const returnUpdate2 = await Despesa.updateOne({ _id: req.params.id },{idaprovador: user[0]._id, nomeaprovador: user[0].nome});

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
                      //to: "cleber.znch@gmail.com",
                      bcc: "cleber.znch@gmail.com",
                      subject:
                        "Novo Relatório de despesas para aprovação",
                      text: "Novo Relatório de despesas para aprovação",
                      template: "apprdespesa",
                      context: {
                        numero: DespesaDoc.numero,
                        requester: DespesaDoc.nomerequester,
                        data: DespesaDoc.updatedAt,
                        obsgeral: DespesaDoc.obsgeral,
                        titulo: "Novo Relatório de despesas para aprovação",
                        status: "Pendente Aprovação",
                        support_email: "mailto:app@superfriosr.com.br",
                      },
                    });
                 } catch (err) {
                    console.log(err);
                 } 
        
                  if (item.pushToken) {
                    messages.push({
                      to: item.pushToken,
                      sound: "default",
                      priority: "high",
                      wake_screen: true,
                      show_in_foreground: true,
                      title: "Novo Relatório de despesas para aprovação",
                      body:
                        "Novo relatório de despesas aguardando sua aprovação. Revise pelo App Superfrio.",
                    });
                  }
                }
              }
        }

        if (status == "2") { //aprova -- Incluir email final para o financeiro
          const user = await Usuario.find({ _id: DespesaDoc.idrequester });
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
                  //to: "cleber.znch@gmail.com",
                  bcc: "cleber.znch@gmail.com",
                  subject:
                    "Seu Relatório de despesas foi aprovado",
                  text: "Seu Relatório de despesas foi aprovado",
                  template: "apprdespesaAprovado",
                  context: {
                    numero: DespesaDoc.numero,
                    requester: DespesaDoc.nomerequester,
                    aprovador: DespesaDoc.nomeaprovador,
                    obsgeral: DespesaDoc.obsgeral,
                    //data: DespesaDoc.updatedAt,
                    titulo: "Seu Relatório de despesas foi aprovado",
                    status: "Aprovado",
                    support_email: "mailto:app@superfriosr.com.br",
                  },
                });
             } catch (err) {
                console.log(err);
             } 
    
              if (item.pushToken) {
                messages.push({
                  to: item.pushToken,
                  sound: "default",
                  priority: "high",
                  wake_screen: true,
                  show_in_foreground: true,
                  title: "Seu Relatório de despesas foi aprovado",
                  body:
                    "Seu Relatório de despesas foi aprovado. Revise pelo App Superfrio.",
                });
              }
            }
            
            sendFinalEmail(DespesaDoc, messages, transporter);

          }
        }

        if (status == "3") { //rejeita
          const user = await Usuario.find({ _id: DespesaDoc.idrequester });
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
                  //to: "cleber.znch@gmail.com",
                  bcc: "cleber.znch@gmail.com",
                  subject:
                    "Seu Relatório de despesas foi reprovado",
                  text: "Seu Relatório de despesas foi reprovado",
                  template: "apprdespesa",
                  context: {
                    numero: DespesaDoc.numero,
                    requester: DespesaDoc.nomerequester,
                    data: DespesaDoc.updatedAt,
                    obsgeral: DespesaDoc.obsgeral,
                    titulo: "Seu Relatório de despesas foi reprovado",
                    status: "Reprovado",
                    support_email: "mailto:app@superfriosr.com.br",
                  },
                });
             } catch (err) {
                console.log(err);
             } 
    
              if (item.pushToken) {
                messages.push({
                  to: item.pushToken,
                  sound: "default",
                  priority: "high",
                  wake_screen: true,
                  show_in_foreground: true,
                  title: "Seu Relatório de despesas foi reprovado",
                  body:
                    "Seu Relatório de despesas foi reprovado. Revise pelo App Superfrio.",
                });
              }
            }
          }
        }

        return res.json(returnUpdate)
    },

    async delete(req, res){
        const returnDel = await Despesa.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    async store(req, res) {
        const { dataentrada, status, pdflink, idrequester, nomerequester, idaprovador, nomeaprovador, commaprovador, obsgeral } = req.body;
        var numeroDoc;
        // buscar pelo ultimo numero e inserir numero+1 para o store
        try {
            const returnNumero = await Despesa.findOne({}).sort({numero: -1}).collation({locale: "en_US", numericOrdering: true});    
            numeroDoc = parseInt(returnNumero.numero) + 1;
        } catch (error) {
            numeroDoc = 1;
        }
        
        const returnPost = await Despesa.create(
            {
                dataentrada, 
                numero: numeroDoc,
                status, 
                pdflink, 
                idrequester, 
                nomerequester, 
                idaprovador, 
                nomeaprovador, 
                commaprovador, 
                obsgeral    
            },
            async function (erro, docDespesa) {
            //     docDespesaId = docDespesa._id;
            //     await itens.forEach(async function (item) {
            //         await DespesaItem.create({
            //             descr:item.descr, 
            //             foto:item.foto, 
            //             categoria:item.categoria, 
            //             valor:item.valor, 
            //             iddespesa: docDespesa._id
            //         })
            //     });
            console.log(erro);
                return await res.json({docDespesaId:docDespesa._id})
            }
        );
        
    }

};

async function sendFinalEmail(DespesaDoc, messages, transporter){
  //envia email para financeiro

  // buscar usuarios com flag receive_final_email ativo
  let userFinal = await Usuario.find({ receive_final_despesa: true });

  //faz a soma dos valores dos items
  let DespesaItemValor = await DespesaItem.aggregate([
      { 
        $match:
        {
          "iddespesa": DespesaDoc._id
        }
      },
      {
        $group:
          {
            _id: null,
            totalAmount: { $sum: "$valor"}
          }
      }
  ]);

  for (const item of userFinal) {
    try {
      await transporter.sendMail({
        from: "App Superfrio <app@superfriosr.com.br>",
        to: item.email,
        //to: "cleber.znch@gmail.com",
        bcc: "cleber.znch@gmail.com",
        subject:
          "Novo Relatório de despesas aprovado",
        text: "Novo Relatório de despesas aprovado",
        template: "apprdespesaFinal",
        context: {
          numero: DespesaDoc.numero,
          requester: DespesaDoc.nomerequester,
          //data: DespesaDoc.updatedAt,
          aprovador: DespesaDoc.nomeaprovador,
          obsgeral: DespesaDoc.obsgeral,
          valor: DespesaItemValor[0].totalAmount,
          titulo: "Novo Relatório de despesas aprovado",
          status: "Aprovado",
          support_email: "mailto:app@superfriosr.com.br",
        },
      });
    } catch (err) {
        console.log(err);
    } 

    if (item.pushToken) {
      messages.push({
        to: item.pushToken,
        sound: "default",
        priority: "high",
        wake_screen: true,
        show_in_foreground: true,
        title: "Novo Relatório de despesas aprovado",
        body:
          "Novo relatório de despesas aprovado. Por favor analisar e seguir com a programação",
      });
    }

  }
};