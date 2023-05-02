const { conection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("Node app started");

conection();

const app = express();
const port = 3900;

app.use(cors()).use(express.json()).use(express.urlencoded());


const article_routes = require("./routes/ArticleRoutes");

app.use("/api/v1", article_routes);

app.listen(port, () => {
    console.log("Server running in "+ port +" port")
});