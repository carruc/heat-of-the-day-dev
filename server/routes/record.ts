import express from "express";
import Record from "../models/Record.ts";

// This will help us connect to the database
// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  try {
    const results = await Record.find({});
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Error fetching records");
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  try {
    const result = await Record.findById(req.params.id);
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error fetching record");
  }
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    const newRecord = new Record({
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    });
    await newRecord.save();
    res.status(201).send(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const result = await Record.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
      { new: true }
    );
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const result = await Record.findByIdAndDelete(req.params.id);
    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
