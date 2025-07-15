const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const qcController = require('../controllers/qcController');

const upload = multer({ dest: 'uploads/' });

router.post('/analyze',  upload.any(), qcController.evaluateChecklist);

module.exports = router;
