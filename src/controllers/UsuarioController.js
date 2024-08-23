const Usuario = require('../model/Usuario');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
var CryptoJS = require("crypto-js");
//var AWS = require('aws-sdk');

module.exports = {

    async index(req, res) {
        const returnGet = await Usuario.find();
        return res.json(returnGet)
    },

    async show(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const returnShow = await Usuario.find({ _id: req.params.id });
            return res.json(returnShow)
          } else {
            return res.status(200).send({ error: "Usuário Não Encontrado" });
          }
    },

    async authenticate(req, res) {

        const { email, senha } = req.body;
        // const user = await Usuario.findOne({ email: email, access_app: true });
        const user = await Usuario.findOne({ $or:[ {email: email}, {telefone: email} ], access_app: true });

        if (!user)
            return res.status(400).send({ error: "Usuário/Senha inválida" });

        if (senha != user.pwd)
            return res.status(400).send({ error: "Usuário/Senha inválida" });

        user.pwd = undefined;
        return res.json(user)

    },

    async authenticateadmin(req, res) {

        const { email, senha } = req.body;

        const skey = process.env.SECRET_KEY;

        const hashEmail = CryptoJS.AES.decrypt(email, skey).toString(CryptoJS.enc.Utf8);
        const hashPwd = CryptoJS.AES.decrypt(senha, skey).toString(CryptoJS.enc.Utf8);

        // const user = await Usuario.findOne({ email: hashEmail, access_web: true });
        const user = await Usuario.findOne({ $or:[ {email: hashEmail}, {telefone: hashEmail} ], access_web: true });

        if (!user)
            return res.status(200).send({ error: "Usuário/Senha inválida" });

        if (hashPwd != user.pwd)
            return res.status(200).send({ error: "Usuário/Senha inválida" });

        user.pwd = undefined;

        return res.json(user)
    },

    async validacadastro(req, res) {

        const { idusuario } = req.body;

        try {
            const user = await Usuario.findById(idusuario);
            if (!user)
                return res.status(200).send({ msg: "Usuário não encontrado" });

            if (user.validado)
                return res.status(200).send({ msg: "Usuário já está validado" });

            await Usuario.updateOne({ _id: idusuario }, { validado: true });
            return res.status(200).send({ msg: "Usuário ativado com sucesso" });

        } catch (error) {
            return res.status(200).send({ msg: "Usuário não encontrado" });
        }

    },

    async forgotpwd(req, res) {

        const { email } = req.body;
        const user = await Usuario.findOne({ email });

        if (!user)
            return res.status(200).send({ error: "Usuário não encontrado" });

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

        const userid = user._id;
        const useridp1 = userid.toString().substring(0, 1);
        const useridp2 = userid.toString().substring(5, 6);

        try {
            await transporter.sendMail({
                from: 'App Superfrio <app@superfriosr.com.br>',
                to: email,
                subject: 'Redefinição da sua senha ✔',
                text: 'Redefina sua senha',
                template: 'forgotpwd',
                context: {
                    nome: user.nome,
                    action_url: 'https://superfrio.netlify.app/redefinirsenha/' + userid + '/' + useridp1 + useridp2,
                    support_email: 'mailto:app@superfriosr.com.br'
                }
            });
         } catch (err) {
            console.log(err);
         }

        return res.status(200).send({ success: "Email enviado" });
    },

    async showbyEmail(req, res) {
        const returnShow = await Usuario.countDocuments({ email: req.params.email });
        return res.json(returnShow)
    },

    async showbyPhone(req, res) {
        const returnShow = await Usuario.findOne({ telefone: req.params.telefone });
        return res.json(returnShow)
    },

    async update(req, res) {
        const returnUpdate = await Usuario.updateOne({ _id: req.params.id }, req.body);
        return res.json(returnUpdate)
    },

    async delete(req, res) {
        const returnDel = await Usuario.deleteOne({ _id: req.params.id });
        return res.json(returnDel)
    },

    async store(req, res) {
        const { nome, email, pwd, validado, telefone, centro_custo, admin, access_comp, access_pit, access_web, access_rack, access_despesa, web_appr, desp_appr, access_app, area, idarea, receive_final_despesa } = req.body;

        const returnCount = await Usuario.countDocuments({ email: email });
        if (returnCount > 0)
            return res.status(200).send({ error: "O e-mail informado já está cadastrado." });

        const returnCount2 = await Usuario.countDocuments({ telefone: telefone });
        if (returnCount2 > 0)
            return res.status(200).send({ error: "O telefone informado já está cadastrado." });

        await Usuario.create({
            nome,
            email,
            pwd,
            validado,
            telefone,
            admin,
            access_comp,
            access_pit,
            access_web,
            access_rack,
            access_despesa,
            web_appr,
            desp_appr,
            access_app,
            area,
            idarea,
            centro_custo,
            receive_final_despesa
        });

        const user = await Usuario.findOne({ email });

        // var params = {
        //     Message: "EloyAqui: Seu código de acesso é 058765",
        //     PhoneNumber: '+5511976023836',
        //     MessageAttributes: {
        //         'AWS.SNS.SMS.SenderID': {
        //             'DataType': 'String',
        //             'StringValue': 'teste'
        //         }
        //     }
        // };

        // var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

        // publishTextPromise.then(
        //     function (data) {
        //         console.log(JSON.stringify({ MessageID: data.MessageId }));
        //     }).catch(
        //         function (err) {
        //             console.log(JSON.stringify({ Error: err }));
        //         });


        // let transporter = nodemailer.createTransport({
        //     host: "smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //         user: "cb617fac631548",
        //         pass: "e6242a10de30be"
        //     }
        // });

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
                to: email,
                subject: 'Bem vindo(a) ao App Superfrio ✔',
                text: 'Bem vindo(a) ao App Superfrio',
                template: 'index',
                context: {
                    nome: nome,
                    //action_url: 'https://superfrio.netlify.app/validausuario/' + user._id,
                    action_url: 'https://superfrio.netlify.app',
                    support_email: 'mailto:app@superfriosr.com.br'
                }
            });
         } catch (err) {
            console.log(err);
         }

       

        return res.json(user)

    },
};