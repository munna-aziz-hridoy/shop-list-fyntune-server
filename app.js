const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const client = require("./db/dbClient");

const app = express();

app.use(express.json());
const corsConfig = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.get("/", (req, res) => {
  res.send({ message: "server is connected" });
});

const shopCollection = client.db("shopList").collection("shops");

const run = async () => {
  await client.connect();
  try {
    // add shop details to database

    app.post("/addShop", async (req, res) => {
      const shopData = req.body;
      const result = await shopCollection.insertOne(shopData);
      res.send({ success: true, result });
    });

    app.delete("/deleteShop", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const result = await shopCollection.deleteOne(filter);
      res.send(result);
    });

    // get shop data from datebase
    app.get("/getShop", async (req, res) => {
      const area = req.query.area;
      const category = req.query.category;

      let shops;

      if (area !== "undefined" && category === "undefined") {
        shops = await shopCollection.find({ area }).toArray();
        return res.send(shops);
      }
      if (category !== "undefined" && area === "undefined") {
        shops = await shopCollection.find({ category }).toArray();
        return res.send(shops);
      }
      if (area !== "undefined" && category !== "undefined") {
        shops = await shopCollection.find({ area, category }).toArray();
        return res.send(shops);
      }
      if (area !== "undefined" && category !== "undefined") {
        shops = await shopCollection.find({ area, category }).toArray();
        return res.send(shops);
      }
      if (area === "undefined" && category === "undefined") {
        shops = await shopCollection.find({}).toArray();
        return res.send(shops);
      }
    });
  } finally {
  }
};
run().catch(console.dir);

module.exports = app;
