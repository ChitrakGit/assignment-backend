const express =  require("express");
const { userInfo, addUserInfo,pdfInfo, viewPDF, deleteUser, editUser } = require("../controllers/user.controller");

const router = express.Router();

router.route("/info").get(userInfo);
router.route("/add-info").post(addUserInfo);
router.route("/edit-info").post(editUser);
router.route("/pdf").get(pdfInfo);
router.route("/view-pdf").get(viewPDF);
router.route("/delete").delete(deleteUser);



module.exports = router;