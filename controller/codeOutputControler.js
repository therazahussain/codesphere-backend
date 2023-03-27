const axios = require("axios");

const postOutput = (req, res) => {

    const { editorCode, language } = req.body;

    try {
        var data = {
            code: `${editorCode}`,
            language:`${language}`,
        };
        var config = {
            method: 'post',
            url: process.env.CODEX_URL,
            headers: {
                'content-type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                res.json((response.data));
            })
            .catch(function (error) {
                res.json(error);
            });
    } catch (error) {
        res.status(500).json({message: error.message});
    }



}


module.exports = { postOutput }