const router = require("express").Router();
let product = require("../models/product.model");

router.route("/").get((req, res) => {
  product
    .find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const productname = req.body.productname;
  const description = req.body.description;
  const price = req.body.price;
  const image = req.body.image;

  const newproduct = new product({ productname, description, price, image });

  newproduct
    .save()
    .then(() => res.json("product added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  product
    .findById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json("Product not found");
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
