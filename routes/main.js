var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var nodeMailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/popup', function (req, res) {
    res.render('popup');
});

router.get('/popup/done', function (req, res) {
    var msg = req.query.status == "200" ? "Листа відправлено. Скоро з вами зв'яжуться." : (req.query.status == "500" ? "Помилка при оброблені запиту. Спробуйте пізніше. Вибачте за незручності." : "Заборонено! Перевищено максимальну кількість надісланих листів.");
    res.render('popup-res', {message: msg});
});

router.post('/sendmail', function (req, res) {
    var transport = nodeMailer.createTransport(smtpTransport({
        host: 'smtp.mandrillapp.com',
        port: 587,
        auth: {
            user: 'borusyuk_kolya@ukr.net',
            pass: 'azt8WJ0RJBGJQvI-JZQbcg'
        }
    }));
    var mailOptions = {
        from: "admin@elitemebli.com",
        to: 'm.borysiuk@svitla.com',
        subject: 'TEST',
        text: 'Phone: ' + req.query.phone + '. Name: ' + req.query.name
    };
    transport.sendMail(mailOptions, function (err, response) {
        if (err) {
            console.log(err);
            res.send(500);
        }
        else {
            req.userData.emails++;
            res.send(200);
        }
    });
});

router.get('/download', function (req, res) {
    var name = req.query.name + '.pdf';
    var file = path.join(process.cwd() + '/public/files/' + name);
    //if file exists download it. Else we have bad query from user.
    if (fs.existsSync(file)) {
        res.download(file, name);
    }
    else {
        res.render('error', {
            message: 'Bad request',
            error: 500
        });
    }
});

router.use(function (req, res) {
    res.render('error', {
        message: 'Not found',
        error: 404
    });
});

module.exports = router;
