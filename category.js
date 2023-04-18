const category = require("../models/category");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id)
    .then((category) => {
      (req.category = category), next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Category not found in DB",
        });
      }
    });

  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category
    .save()
    .then((res) => res.json({ category }))
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Not Able to save Category in DB",
        });
      }
    });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  category
    .find()
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "No Categories found in DB",
        });
      }
    });
};

exports.updateCategory = (req, res) => {
  const category = req.category; //this category we are able to access from getCategoryById line 7
  category.name = req.body.name; //this category.name will get frontend and req.body.name from postman
  category
    .save()
    .then((updatedCategory) => {
      res.json(updatedCategory);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to update category in DB",
        });
      }
    });
};

exports.removecategory = (req, res) => {
  const category = req.category;
  category
    .remove()
    .then((res) =>
      res.json({
        message: `Successfully deleted this ${category}`,
      })
    )
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete this category ",
        });
      }
    });
};
