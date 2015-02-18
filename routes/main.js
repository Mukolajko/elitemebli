var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var nodeMailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var ejs = require('ejs');
var request = require('request');
var config = {
    key: "6LfaSwITAAAAAIaSJhNFl3x1y0QEoCWjJHTS7g0x",
    mainUrl: "https://www.google.com/recaptcha/api/siteverify?"
}
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/popup', function (req, res) {
    res.render('popup')
});

router.get('/popup/done', function (req, res) {
    var msg = req.query.status == "200" ? "Листа відправлено. Скоро з вами зв'яжуться." : (req.query.status == "500" ? "Помилка при оброблені запиту. Спробуйте пізніше. Вибачте за незручності." : "Заборонено!");
    res.render('popup-res', {message: msg});
});

router.post('/sendmail', function (req, res) {
    var name = req.body.name || null;
    var phone = req.body.phone || null;
    var message = req.body.message || null;
    var captchaStr = req.body.captcha || null;
    var ip = req.connection.remoteAddress;
    var testUrl = config.mainUrl + "secret=" + config.key + "&response=" + captchaStr + "&remoteip=" + ip;

    if (!name || !phone) {
        res.send(400);
    }
    else {
        //check captcha
        request(testUrl, function(err, responce, body) {
            var data = JSON.parse(body);
            if (data.success) {
                //read template. Create JSON object with data. Fill HTML with data and send it.
                var html = buildHTML(name, phone, message);

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
                    subject: 'Новий запит від клієнта',
                    html: html
                };
                transport.sendMail(mailOptions, function (err, response) {
                    if (err) {
                        console.log(err);
                        res.send(500);
                    }
                    else {
                        res.send(200);
                    }
                });
            }
            else {
                 res.send(412);
            }
        });
    }
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

//helper functions
function buildHTML(name, phone, message) {
    //read template. Create JSON object with data. Fill HTML with data and send it.
    var file = fs.readFileSync(path.join(process.cwd() + '/views/mail.ejs'), 'utf-8');
    var jsonData = {}
    jsonData.name = name;
    jsonData.phone = phone;
    jsonData.message = message;
    var html = ejs.render(file, jsonData);
    return html;
}