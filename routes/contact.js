var nodemailer = require('nodemailer');

exports.send = function(req, res) {
    var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shauvon.mcgill@gmail.com',
                pass: 'cvgoyzkfbhusjpoh'
            }
        }),
        mailOptions = {
            from: req.body.email || 'none@denyconformity.com',
            to: 'shauvonmcg.i.ll@gmail.com', //'contact@improvdatabase.com',
            subject: 'Improv Database Contact Submission'
        },
        html;

    html = '<p>Dear Proprietors of The Improv Comedy Database,</p>';

    html += '<p>I wish to contact you to ' + req.body.wishto + '. This particular incident has caused me to ' + req.body.caused + '. I am currently seeking ' + req.body.seeking + ' for this situation.</p>';

    html += '<p>To elaborate:</p>';

    html += '<p>***</p> <p>' + req.body.message + '</p> <p>***</p>';

    html += '<p>I demand that you ' + req.body.demand + '</p>';

    html += '<p>Sincerely, ' + req.body.name + ' - ' + req.body.email + '</p>';

    mailOptions.html = html;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            res.json(500, error);
        } else {
            console.log('Message Sent: ', info.response);
            res.sendStatus(200);
        }
    });
};


