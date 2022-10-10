const express = require("express");
const router = express.Router();
const ctrl = require('../controllers/login.ctrl');


router.get('/', ctrl.page.goLogin);

router.post('/', ctrl.user.checkUserInfo);

module.exports = router;