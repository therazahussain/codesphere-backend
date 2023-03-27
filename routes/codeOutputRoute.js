const express = require('express');
const { postOutput } = require('../controller/codeOutputControler');

const router = express.Router();


router.post("/code-output", postOutput);


module.exports = router;