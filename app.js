var crypto = require('crypto');
const express = require('express')
const app = express()
const bodyParser  = require('body-parser');
var maxWords = {};
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

router.post('/token', function (req, res) {
    if (req.body.email) {
        var newToken = crypto.createHash('sha256').update(crypto.randomBytes(48).toString('hex')).digest('hex');
        maxWords[newToken] = {words:0 , date: new Date()}
        console.log(maxWords)
        return res.json({
            success: true,
            token: newToken,
            msg: 'token'
        });
    } else {
        return res.json({
            success: false,
            msg: 'Email is obligatory'
        });

}})

router.post('/justify', function (req, res) {
    var thisToken = req.headers['token']
    console.log(req.body)
    if (!thisToken)
    {
        return res.status(403).send({
            success: false,
            message: 'No token'
        });
    }
    else {
        var currentDate = new Date()
        console.log(maxWords)
        if (maxWords[thisToken].date.getDate() != currentDate.getDate || maxWords[thisToken].date.getMonth() != currentDate.getMonth() || maxWords[thisToken].date.getFullYear() != currentDate.getFullYear())
            {
                maxWords[thisToken].date = new Date ()
                maxWords[thisToken].words = 0
            }
        if(maxWords[thisToken].words > 80000)
        {
            res.status(402).json({ success: false, message: '402 Payment Required.' });
        }
        else
        {
            var array = req.body.split(" ") 
            maxWords[thisToken].words += array.length
            var index = 0;
            var text = [""];
            array.forEach((str) => {
                if (text[index].length + str.length <= 80) {
                    text[index] += str + ' ';
                } else {
                    text[index] = text[index].substr(0, text[index].length - 1);
                    if (text[index].length !== 80) {
                        let fill = 80 - text[index].length;
                        const re = /\s/g;
                        let spaces = [];
                        while ((match = re.exec(text[index])) !== null) {
                            spaces.push(match.index);
                        }
                        spaces = spaces.reverse();
                        let i = 0;
                        while (fill > 0) {
                            text[index] = text[index].split('');
                            text[index].splice(spaces[i], 0, ' ');
                            text[index] = text[index].join('');
                            i++;
                            fill--;
                        }
                    }
                    index++;
                    text[index] = "";
                    text[index] += str + ' ';
                }
            });
            text[index] = text[index].substr(0, text[index].length - 1);
            text = text.join("\n");
            return res.send(text);
        }
        }

    })

    app.use('/api', router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})