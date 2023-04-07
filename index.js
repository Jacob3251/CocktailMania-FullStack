const express = require("express");
const cors = require("cors");
const axios = require("axios");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

async function run() {
  try {
    // drinks according to Categories API
    app.get("/categoriesDrinks", async (req, res) => {
      const categoryName = req.query.catName;
      const dt = await axios
        .get(
          `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoryName}`
        )
        .then((res) => {
          return res.data;
        });

      res.send(dt.drinks);
    });

    // Searching details with names
    app.get("/drinksByNameDetails", async (req, res) => {
      const drinkNameSpace = req.query.drinksByName;
      const drinkNameWithoutSpace = drinkNameSpace.split(" ");
      let drinkNamewithPercent = drinkNameWithoutSpace.join("%");
      const dt = await axios
        .get(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkNamewithPercent}`
        )
        .then((res) => {
          return res.data;
        });
      if (dt.drinks === null) {
        res.send({ drinks: [] });
      } else {
        res.send(dt);
      }
    });
    // Drinks Categories
    app.get("/categories", async (req, res) => {
      const dt = await axios
        .get("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
        .then((res) => {
          return res.data;
        });

      res.send(dt.drinks);
    });
    // Making pagination
    // Step 1: making an api that will send the total length of data to be displayed
    app.get("/pageCount", async (req, res) => {
      const catName = req.query.catname;
      const dt = await axios
        .get(
          `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${catName}`
        )
        .then((res) => {
          return res.data;
        });
      const count = dt.drinks.length;
      res.send({ count });
    });
    // getting products according to pagination number
    app.get("/paged", async (req, res) => {
      const page = parseInt(req.query.page);
      const type = req.query.type;
      console.log("Page: ", page, "Type", type);
      const dt = await axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${type}`)
        .then((res) => {
          return res.data.drinks;
        });
      let drinks;
      // if (page && type) {
      //   drinks = dt.limit(15);
      // }
      const skip = dt.slice(page * 15, page * 15 + 10);
      res.send(skip);
      // res.send({ drinks });
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Api is created!! at ", port);
});
