var pdf = require('html-pdf');
var ejs = require('ejs');
const fs = require("fs");
const AWS = require('aws-sdk');
const ChecklistPit = require('../model/ChecklistPit');
const ChecklistPitItem = require('../model/ChecklistPitItem');
var path = require('path');

module.exports = {

    async create(req, res){
        
        const checkList = await ChecklistPit.findOne({ _id: req.params.id });
        const checkListItens = await ChecklistPitItem.find({ idchecklistpit: req.params.id }).sort({ordemitem: 1});
        var pdflocation = '';
        const dataentrada = new Date(checkList.dataentrada);
        ejs.renderFile(path.join(__dirname, '..' ,'templates', 'pitstop-instalacao.ejs'), {checklist: checkList, checklistItens: checkListItens, dataentrada: dataentrada.toLocaleDateString('pt-BR', {timeZone: 'UTC'})}, (err, html) => {
            if(err){
                console.log("Erro ao renderizar HTML: " + err);
                return res.status(400).send({ error: "Erro ao gerar HTML" });
            } else {
                pdf.create(html, {timeout: '100000'}).toFile("./assets/" + checkList._id +".pdf",(err, filepath) => {
                    if(err){
                        console.log("Erro: " + err)
                        return res.status(400).send({ error: "Erro ao gerar PDF" });
                    } else {
                        const s3 = new AWS.S3({
                            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                          });
                        const filename = checkList._id +".pdf";
                        
                        // Read content from the file
                        const fileContent = fs.readFileSync(path.join(__dirname, '..', '../assets', filename));
                          
                        // Setting up S3 upload parameters
                        const params = {
                            Bucket: process.env.S3_BUCKET,
                            Key: filename, // File name you want to save as in S3
                            Body: fileContent
                        };

                        // Uploading files to the bucket
                        s3.upload(params, async function(err, data) {
                            if (err) {
                                console.log(err);
                                return res.status(400).send({ error: "Erro ao salvar na AWS" });
                            }
                            pdflocation = data.Location;
                            console.log(`File uploaded successfully. ${data.Location}`);
                            const returnUpdate = await ChecklistPit.updateOne({ _id: checkList._id },{pdflink: pdflocation});
                            //return res.json(returnUpdate);

                            //Remove File after upload to AWS
                            fs.unlink(path.join(__dirname, '..', '../assets', filename),function(err){
                                if(err) return console.log(err);
                                console.log('file deleted successfully');
                            });  
                        });
                        return res.status(200).send({ success: true, pdflink: pdflocation});
                    }
                });       
            }
        });
    }
};

