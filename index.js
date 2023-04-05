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
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Api is created!! at ", port);
});
