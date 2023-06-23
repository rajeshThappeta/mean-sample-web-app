//create express app
const exp = require("express");
const app = exp();
const path = require("path");
require("dotenv").config();

//connect angular buld with nodejs server
app.use(exp.static(path.join(__dirname, "./dist/samplewebapp")));

//get MongoClient
const mClient = require("mongodb").MongoClient;
//connect to DB server
mClient
  .connect("mongodb://localhost:27017/ca003db")
  .then((client) => {
    //get DB obj
    const ca003Db = client.db("ca003db");
    //get collection obj
    const usersCollection = ca003Db.collection("users");
    //get collection obj
    const productsCollection = ca003Db.collection("products");
    //share user collection obj
    app.set("usersCollection", usersCollection);
    //share user collection obj
    app.set("productsCollection", productsCollection);

    console.log("DB connection success");
  })
  .catch((err) => console.log("err in DB connect", err));

//import userApp
const userApp = require("./apis/userApi");
const productApp = require("./apis/productsApi");

//execute userApp when pasth starts with "user"
app.use("/user-api", userApp);
app.use("/product-api", productApp);

app.use("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./dist/samplewebapp/index.html"));
});

//invalid path
app.use((req, res, next) => {
  res.send({ message: ` ${req.url} is an Invalid path` });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.send({ message: "error occurred", error: err.message });
});

//assign port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}... `));
