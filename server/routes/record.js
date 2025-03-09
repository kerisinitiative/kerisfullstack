import express from "express";

// connect to the database
import db from "../db/connection.js";
// convert id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// will be used to define our routes
const router = express.Router();

// obtain a list of all records
router.get("/", async (req, res) => {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    // display the records
    res.send(results).status(200);
});

// obtain a single record by id
router.get("/", async (req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    // if no record is found
    if(!result) res.send("Not found").status(404);
    // if a record is found, display query
    else res.send(result).status(200);
});

// create a new record
router.post("/", async (req, res) => {
    try {
        let newDocument = {
            // review atributes later
            name: req.body.name,
            email: req.body.email,
            sponsor: req.body.sponsor,
            major: req.body.major,
            institution: req.body.institution,
        };
        let collection = await db.collection("records");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    }
    catch(e){
        console.error(e);
        res.status(500).send("Error adding record");
    }
});

// update a record by id
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)};
        const updates = {
            $set: {
                name: req.body.name,
                email: req.body.email,
                sponsor: req.body.sponsor,
                major: req.body.major,
                institution: req.body.institution,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    }
    catch(e){
        console.error(e);
        res.status(500).send("Error updating record");    
    }
});

// delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)};

        const collection = db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Error deleting record");
    }
});

export default router;

