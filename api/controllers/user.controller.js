const fs = require('fs');
const path = require('path');
const dbClient = require("../config/db");
const { doesPdfExistForUser, generatePdf } = require("../util/pdfGenerator");


module.exports.userInfo = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const query = req.query || {};
        const users = await db.collection('users').find(query).toArray();
        return res.status(200).send({ text: "done", users,success:true })
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}

module.exports.addUserInfo = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const payload = req.body;
        console.log("paylod", payload)

        const user = await db.collection('users').findOne({ phoneNumber: payload.phoneNumber });
        if (user) {
            return res.send({ text: "failed", success: false })
        }
        await db.collection('users').insertOne(payload)

        return res.status(200).send({ text: "success", success: true })
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}

module.exports.editUser = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const payload = req.body;
        console.log("paylod", payload)

        const user = await db.collection('users').findOne({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return res.send({ text: "not found", success: false })
        }
        await db.collection('users').findOneAndUpdate({phoneNumber:payload.phoneNumber},{$set:payload})

        return res.status(200).send({ text: "success", success: true })
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}

module.exports.pdfInfo = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const payload = req.query;

        const user = await db.collection('users').findOne({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return res.send({ text: "user not found", success: false })
        }
        const phoneNumber = payload.phoneNumber;
        if (doesPdfExistForUser(phoneNumber)) {

            let filePath = path.join(process.cwd(), 'uploads', `${phoneNumber}.pdf`);
            console.log(`PDF exists for user ID: ${phoneNumber}`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${phoneNumber}.pdf`);
            fs.createReadStream(filePath).pipe(res);
        } else {
            await generatePdf(user);

            let filePath = path.join(process.cwd(), 'uploads', `${phoneNumber}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${phoneNumber}.pdf`);
            fs.createReadStream(filePath).pipe(res);
            // console.log(`No PDF found for user ID: ${phoneNumber}`);
        }

        
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}
module.exports.viewPDF = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const payload = req.query;

        const user = await db.collection('users').findOne({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return res.send({ text: "user not found", success: false })
        }
        const phoneNumber = payload.phoneNumber;
        if (doesPdfExistForUser(phoneNumber)) {

            let filePath = path.join(process.cwd(), 'uploads', `${phoneNumber}.pdf`);
            return res.sendFile(filePath)
        } else {
            await generatePdf(user);

            let filePath = path.join(process.cwd(), 'uploads', `${phoneNumber}.pdf`);
            return res.sendFile(filePath)
            // console.log(`No PDF found for user ID: ${phoneNumber}`);
        }

        
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const db = await dbClient.getClient();
        const payload = req.query;

        const user = await db.collection('users').deleteOne({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return res.send({ text: "user not found", success: false })
        }
        return res.send({ text:"deleted",success:true })

        
    }
    catch (error) {
        console.log(error.message, error)
        return res.status(400).send({ message: error.message })
    }
}