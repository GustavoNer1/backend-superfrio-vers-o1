const express = require('express');

const ChecklistCompController = require('./controllers/ChecklistCompController.js');
const ChecklistCompItemController = require('./controllers/ChecklistCompItemController.js');
const ChecklistCompItemExitController = require('./controllers/ChecklistCompItemExitController.js');
const ChecklistPitController = require('./controllers/ChecklistPitController.js');
const ChecklistPitItemController = require('./controllers/ChecklistPitItemController.js');
const ChecklistRackController = require('./controllers/ChecklistRackController.js');
const ChecklistRackItemController = require('./controllers/ChecklistRackItemController.js');
const ClienteController = require('./controllers/ClienteController.js');
const CompressorController = require('./controllers/CompressorController.js');
const FabricanteController = require('./controllers/FabricanteController.js');
const SistemaController = require('./controllers/SistemaController.js');
const GasController = require('./controllers/GasController.js');
const HomeAlertController = require('./controllers/HomeAlertController.js');
const PitstopController = require('./controllers/PitstopController.js');
const PrecadastroController = require('./controllers/PrecadastroController.js');
const UsuarioController = require('./controllers/UsuarioController.js');
const CatalogoController = require('./controllers/CatalogoController.js');
const TensaoController = require('./controllers/TensaoController.js');
const TensaoPitController = require('./controllers/TensaoPitController.js');
const ChecklistItemDefault = require('./controllers/ChecklistItemDefaultController.js');
const ChecklistItemExitDefault = require('./controllers/ChecklistItemExitDefaultController.js');
const Marca = require('./controllers/MarcaController.js');
const Despesa = require('./controllers/DespesaController.js');
const DespesaItem = require('./controllers/DespesaItemController.js');
const CategoriaDespesa = require('./controllers/CategoriaDespesaController.js');
const DespesaAreaApprController = require('./controllers/DespesaAreaApprController.js');  
const PDFGenerator = require('./controllers/PDFGenerator.js');
const PDFGeneratorPit = require('./controllers/PDFGeneratorPit.js');
const PDFGeneratorRack = require('./controllers/PDFGeneratorRack.js');
const PDFGeneratorDespesa = require('./controllers/PDFGeneratorDespesa.js');

const routes = express.Router();

routes.get("/", (req, res) => {
    res.status(200).send("Bem vindo")
})

routes.post('/generatePDF/:id', PDFGenerator.create);
routes.post('/generatePDFPit/:id', PDFGeneratorPit.create);
routes.post('/generatePDFRack/:id', PDFGeneratorRack.create);
routes.post('/generatePDFDespesa/:id', PDFGeneratorDespesa.create);

routes.get('/alive', CatalogoController.alive);

routes.post('/checklistcomp', ChecklistCompController.store);
routes.get('/checklistcomp', ChecklistCompController.index);
routes.get('/checklistcompapp', ChecklistCompController.indexapp);
routes.get('/checklistcomp/limit/:limit', ChecklistCompController.index_limit);
routes.get('/checklistcomp/countDocs/app/type/summary', ChecklistCompController.countType);
routes.get('/checklistcomp/countDocs', ChecklistCompController.countStatus);
routes.get('/checklistcomp/count/docs/exit', ChecklistCompController.countExitStatus);
routes.get('/checklistcomp/:id', ChecklistCompController.show);
routes.get('/checklistcomp/nos/:nos', ChecklistCompController.showbyOS);
routes.get('/checklistcomp/user/:iduser', ChecklistCompController.showbyUser);
routes.get('/checklistcomp/status/:status', ChecklistCompController.showbyStatus);
routes.get('/checklistcompexit/status/:status', ChecklistCompController.showbyStatusExit);
routes.get('/checklistcomp/busca/:query', ChecklistCompController.showbySearch);
routes.put('/checklistcomp/:id', ChecklistCompController.update);
routes.delete('/checklistcomp/:id', ChecklistCompController.delete);

routes.post('/checklistcompitem', ChecklistCompItemController.store);
routes.post('/checklistcompitemManual', ChecklistCompItemController.storeManual);
routes.get('/checklistcompitem', ChecklistCompItemController.index);
routes.get('/checklistcompitem/:id', ChecklistCompItemController.show);
routes.get('/checklistcompitem/checklist/:id', ChecklistCompItemController.showbyCheckList);
routes.put('/checklistcompitem/:id', ChecklistCompItemController.update);
routes.delete('/checklistcompitem/:id', ChecklistCompItemController.delete);

routes.post('/checklistcompitemexit', ChecklistCompItemExitController.store);
routes.post('/checklistcompitemexit/:id', ChecklistCompItemExitController.createExitChecklist);
routes.post('/checklistcompitemexitManual', ChecklistCompItemExitController.storeManual);
routes.get('/checklistcompitemexit', ChecklistCompItemExitController.index);
routes.get('/checklistcompitemexit/:id', ChecklistCompItemExitController.show);
routes.get('/checklistcompitemexit/checklist/:id', ChecklistCompItemExitController.showbyCheckList);
routes.put('/checklistcompitemexit/:id', ChecklistCompItemExitController.update);
routes.delete('/checklistcompitemexit/:id', ChecklistCompItemExitController.delete);

routes.post('/checklistpit', ChecklistPitController.store);
routes.get('/checklistpit', ChecklistPitController.index);
routes.get('/checklistpitapp', ChecklistPitController.indexapp);
routes.get('/checklistpit/limit/:limit', ChecklistPitController.index_limit);
routes.get('/checklistpit/countDocs', ChecklistPitController.countStatus);
routes.get('/checklistpit/:id', ChecklistPitController.show);
routes.get('/checklistpit/controlid/:id', ChecklistPitController.showbyControlid);
routes.get('/checklistpit/user/:iduser', ChecklistCompController.showbyUser);
routes.get('/checklistpit/status/:status', ChecklistPitController.showbyStatus);
routes.put('/checklistpit/:id', ChecklistPitController.update);
routes.delete('/checklistpit/:id', ChecklistPitController.delete);

routes.post('/checklistpititem', ChecklistPitItemController.store);
routes.post('/checklistpititemManual', ChecklistPitItemController.storeManual);
routes.get('/checklistpititem', ChecklistPitItemController.index);
routes.get('/checklistpititem/:id', ChecklistPitItemController.show);
routes.get('/checklistpititem/checklist/:id', ChecklistPitItemController.showbyCheckList);
routes.put('/checklistpititem/:id', ChecklistPitItemController.update);
routes.delete('/checklistpititem/:id', ChecklistPitItemController.delete);

routes.post('/checklistrack', ChecklistRackController.store);
routes.get('/checklistrack', ChecklistRackController.index);
routes.get('/checklistrachapp', ChecklistRackController.indexapp);
routes.get('/checklistrack/limit/:limit', ChecklistRackController.index_limit);
routes.get('/checklistrack/countDocs', ChecklistRackController.countStatus);
routes.get('/checklistrack/:id', ChecklistRackController.show);
routes.get('/checklistrack/controlid/:id', ChecklistRackController.showbyControlid);
routes.get('/checklistrack/user/:iduser', ChecklistRackController.showbyUser);
routes.get('/checklistrack/status/:status', ChecklistRackController.showbyStatus);
routes.put('/checklistrack/:id', ChecklistRackController.update);
routes.delete('/checklistrack/:id', ChecklistRackController.delete);

routes.post('/checklistrackitem', ChecklistRackItemController.store);
routes.post('/checklistrackitemManual', ChecklistRackItemController.storeManual);
routes.get('/checklistrackitem', ChecklistRackItemController.index);
routes.get('/checklistrackitem/:id', ChecklistRackItemController.show);
routes.get('/checklistrackitem/checklist/:id', ChecklistRackItemController.showbyCheckList);
routes.put('/checklistrackitem/:id', ChecklistRackItemController.update);
routes.delete('/checklistrackitem/:id', ChecklistRackItemController.delete);

routes.post('/cliente', ClienteController.store);
routes.get('/cliente', ClienteController.index);
routes.get('/cliente/:id', ClienteController.show);
routes.put('/cliente/:id', ClienteController.update);
routes.delete('/cliente/:id', ClienteController.delete);

routes.post('/compressor', CompressorController.store);
routes.get('/compressor', CompressorController.index);
routes.get('/compressor/:id', CompressorController.show);
routes.put('/compressor/:id', CompressorController.update);
routes.delete('/compressor/:id', CompressorController.delete);

routes.post('/fabricante', FabricanteController.store);
routes.get('/fabricante', FabricanteController.index);
routes.get('/fabricante/:id', FabricanteController.show);
routes.put('/fabricante/:id', FabricanteController.update);
routes.delete('/fabricante/:id', FabricanteController.delete);

routes.post('/sistema', SistemaController.store);
routes.get('/sistema', SistemaController.index);
routes.get('/sistema/:id', SistemaController.show);
routes.put('/sistema/:id', SistemaController.update);
routes.delete('/sistema/:id', SistemaController.delete);

routes.post('/gas', GasController.store);
routes.get('/gas', GasController.index);
routes.get('/gas/:id', GasController.show);
routes.put('/gas/:id', GasController.update);
routes.delete('/gas/:id', GasController.delete);

routes.post('/pitstop', PitstopController.store);
routes.get('/pitstop', PitstopController.index);
routes.get('/pitstop/:id', PitstopController.show);
routes.put('/pitstop/:id', PitstopController.update);
routes.delete('/pitstop/:id', PitstopController.delete);

routes.post('/homealert', HomeAlertController.store);
routes.get('/homealert', HomeAlertController.index);
routes.get('/homealert/:id', HomeAlertController.show);
routes.put('/homealert/:id', HomeAlertController.update);
routes.delete('/homealert/:id', HomeAlertController.delete);

routes.post('/catalogo', CatalogoController.store);
routes.get('/catalogo', CatalogoController.index);
routes.get('/catalogo/web/comp', CatalogoController.indexcomp);
routes.get('/catalogo/web/pit', CatalogoController.indexpit);
routes.get('/catalogo/:id', CatalogoController.show);
routes.put('/catalogo/:id', CatalogoController.update);
routes.delete('/catalogo/:id', CatalogoController.delete);

routes.post('/precadastro', PrecadastroController.store);
routes.get('/precadastro', PrecadastroController.index);
routes.get('/precadastro/:id', PrecadastroController.show);
routes.put('/precadastro/:id', PrecadastroController.update);
routes.delete('/precadastro/:id', PrecadastroController.delete);

routes.post('/tensao', TensaoController.store);
routes.get('/tensao', TensaoController.index);
routes.get('/tensao/:id', TensaoController.show);
routes.put('/tensao/:id', TensaoController.update);
routes.delete('/tensao/:id', TensaoController.delete);

routes.post('/tensaopit', TensaoPitController.store);
routes.get('/tensaopit', TensaoPitController.index);
routes.get('/tensaopit/:id', TensaoPitController.show);
routes.put('/tensaopit/:id', TensaoPitController.update);
routes.delete('/tensaopit/:id', TensaoPitController.delete);

routes.post('/marca', Marca.store);
routes.get('/marca', Marca.index);
routes.get('/marca/:id', Marca.show);
routes.put('/marca/:id', Marca.update);
routes.delete('/marca/:id', Marca.delete);

routes.post('/despesa', Despesa.store);
routes.get('/despesa', Despesa.index);
routes.get('/despesa/:id', Despesa.show);
routes.get('/despesa/requester/:id', Despesa.showByRequester);
routes.get('/despesa/status/pending/:id', Despesa.showByPending);
routes.get('/despesa/status/apprej/:id', Despesa.showByAppRej);
routes.get('/despesa/requester/count/:id', Despesa.countByRequester);
routes.get('/despesa/pending/count/:id', Despesa.countByPending);
routes.put('/despesa/:id', Despesa.update);
routes.delete('/despesa/:id', Despesa.delete);

routes.post('/despesaItem', DespesaItem.store);
routes.get('/despesaItem', DespesaItem.index);
routes.get('/despesaItem/:id', DespesaItem.show);
routes.get('/despesaItem/despesa/:id', DespesaItem.showByDespesa);
routes.get('/despesaItem/aggreg/export', DespesaItem.aggreg);
routes.put('/despesaItem/:id', DespesaItem.update);
routes.delete('/despesaItem/:id', DespesaItem.delete);

routes.post('/categoriadespesa', CategoriaDespesa.store);
routes.get('/categoriadespesa', CategoriaDespesa.index);
routes.get('/categoriadespesa/:id', CategoriaDespesa.show);
routes.put('/categoriadespesa/:id', CategoriaDespesa.update);
routes.delete('/categoriadespesa/:id', CategoriaDespesa.delete);

routes.post('/checklistitemdefault', ChecklistItemDefault.store);
routes.get('/checklistitemdefault', ChecklistItemDefault.index);
routes.get('/checklistitemdefault/:id', ChecklistItemDefault.show);
routes.get('/checklistitemdefault/type/:type', ChecklistItemDefault.showbyType);
routes.put('/checklistitemdefault/:id', ChecklistItemDefault.update);
routes.delete('/checklistitemdefault/:id', ChecklistItemDefault.delete);
//routes.get('/checklistitemdefault/reset/itens/all', ChecklistItemDefault.resetDefault);

routes.post('/checklistitemdefaultexit', ChecklistItemExitDefault.store);
routes.get('/checklistitemdefaultexit', ChecklistItemExitDefault.index);
routes.get('/checklistitemdefaultexit/:id', ChecklistItemExitDefault.show);
routes.get('/checklistitemdefaultexit/type/:type', ChecklistItemExitDefault.showbyType);
routes.put('/checklistitemdefaultexit/:id', ChecklistItemExitDefault.update);
routes.delete('/checklistitemdefaultexit/:id', ChecklistItemExitDefault.delete);
//routes.get('/checklistitemdefaultexit/reset/itens/all', ChecklistItemExitDefault.resetDefault);

routes.post('/despesaareaappr', DespesaAreaApprController.store);
routes.get('/despesaareaappr', DespesaAreaApprController.index);
routes.get('/despesaareaappr/:id', DespesaAreaApprController.show);
routes.put('/despesaareaappr/:id', DespesaAreaApprController.update);
routes.delete('/despesaareaappr/:id', DespesaAreaApprController.delete);

routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios', UsuarioController.index);
routes.get('/usuarios/:id', UsuarioController.show);
routes.get('/usuarios/email/:email', UsuarioController.showbyEmail);
routes.get('/usuarios/telefone/:telefone', UsuarioController.showbyPhone);
routes.post('/authenticate', UsuarioController.authenticate);
routes.post('/admauthenticate/', UsuarioController.authenticateadmin);
routes.post('/forgotpwd', UsuarioController.forgotpwd);
routes.post('/validacadastro', UsuarioController.validacadastro);
routes.put('/usuarios/:id', UsuarioController.update);
routes.delete('/usuarios/:id', UsuarioController.delete);

module.exports = routes;