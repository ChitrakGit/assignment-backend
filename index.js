require('dotenv').config();

const express = require("express");
const sequelize = require('./api/config/db');

const app = express();


app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Expose-Headers", "auth_token, secret_token");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth_token, secret_token");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization, user-key, auth_token, secret_token"
		);
		return res.status(200).json({});
	}
	next();
});


app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.get("/", (req, res) => {
	return res.send("hello world from node express js");
});

app.get("/ping", (req, res) => {
	return res.send("ping from home backend");
});
app.use("/api", require("./api/routes") );
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server stared:-> localhost:${PORT}`)
})