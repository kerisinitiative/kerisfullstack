import express from "express";

// connect to the database
import db from "../db/connection.js";
// convert id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// will be used to define our routes
const router = express.Router();

/* NEW CODE BUT IDK WHAT I WROTE

    // Obtain a list of all scholars with joined data
    router.get("/", async (req, res) => {
        try {
        let collection = await db.collection("scholar");
    
        // Aggregation pipeline to join scholar, sponsor, institution, and major collections
        const pipeline = [
            {
            $lookup: {
                from: "scholar_sponsor_program", // Join with the sponsor collection
                localField: "_id", // Field in the scholar collection
                foreignField: "scholar_id", // Field in the sponsor collection
                as: "sponsor_id", // Output array field
            },
            },
            {
            $lookup: {
                from: "scholar_institution", // Join with the institution collection
                localField: "_id", // Field in the scholar collection
                foreignField: "scholar_id", // Field in the institution collection
                as: "institution_id", // Output array field
            },
            },
            {
            $lookup: {
                from: "major", // Join with the major collection
                localField: "major_id", // Field in the scholar collection
                foreignField: "_id", // Field in the major collection
                as: "major", // Output array field
            },
            },
            {
            $unwind: "$sponsor", // Convert the sponsor array to an object
            },
            {
            $unwind: "$institution", // Convert the institution array to an object
            },
            {
            $unwind: "$major", // Convert the major array to an object
            },
            {
            $project: {
                // Include only the necessary fields
                _id: 1,
                name: 1,
                email: 1,
                ig_acc: 1,
                about: 1,
                sponsor: "$sponsor.sponsor", // Extract the sponsor name
                institution: "$institution.institution", // Extract the institution name
                major: "$major.major", // Extract the major name
            },
            },
        ];
    
        // Execute the aggregation pipeline
        let results = await collection.aggregate(pipeline).toArray();
    
        // Send the results to the frontend
        res.status(200).send(results);
        } catch (e) {
        console.error(e);
        res.status(500).send("Error fetching records");
        }
    });

    // Helper function to handle collection-specific routes
    const handleCollection = (collectionName) => {
        // Obtain a list of all documents in the collection
        router.get(`/${collectionName}`, async (req, res) => {
            try {
                let collection = await db.collection(collectionName);
                let results = await collection.find({}).toArray();
                res.status(200).send(results);
            } catch (e) {
                console.error(e);
                res.status(500).send(`Error fetching ${collectionName}`);
            }
        });

        // Obtain a single document by id
        router.get(`/${collectionName}/:id`, async (req, res) => {
            try {
                let collection = await db.collection(collectionName);
                let query = { _id: new ObjectId(req.params.id) };
                let result = await collection.findOne(query);

                if (!result) {
                    res.status(404).send("Not found");
                } else {
                    res.status(200).send(result);
                }
            } catch (e) {
                console.error(e);
                res.status(500).send(`Error fetching ${collectionName}`);
            }
        });

        // Create a new document in the collection
        router.post(`/${collectionName}`, async (req, res) => {
            try {
                let newDocument = req.body; // Assume the body contains the correct fields
                let collection = await db.collection(collectionName);
                let result = await collection.insertOne(newDocument);
                res.status(201).send(result);
            } catch (e) {
                console.error(e);
                res.status(500).send(`Error adding to ${collectionName}`);
            }
        });

        // Update a document by id
        router.patch(`/${collectionName}/:id`, async (req, res) => {
            try {
                const query = { _id: new ObjectId(req.params.id) };
                const updates = { $set: req.body }; // Assume the body contains the fields to update

                let collection = await db.collection(collectionName);
                let result = await collection.updateOne(query, updates);
                res.status(200).send(result);
            } catch (e) {
                console.error(e);
                res.status(500).send(`Error updating ${collectionName}`);
            }
        });

        // Delete a document by id
        router.delete(`/${collectionName}/:id`, async (req, res) => {
            try {
                const query = { _id: new ObjectId(req.params.id) };
                let collection = await db.collection(collectionName);
                let result = await collection.deleteOne(query);
                res.status(200).send(result);
            } catch (e) {
                console.error(e);
                res.status(500).send(`Error deleting from ${collectionName}`);
            }
        });
    };

    // Define routes for each collection
    const collections = [
        "institution",
        "major",
        "scholar",
        "scholar_institution",
        "scholar_sponsor_program",
        "sponsor",
        "sponsor_program",
    ];

    // Set up routes for each collection
    collections.forEach((collection) => handleCollection(collection));

*/

// obtain a list of all records
router.get("/", async (req, res) => {
  let collection = await db.collection("scholar_table");
  let results = await collection.find({}).toArray();
  // display the records
  res.send(results).status(200);
});

// obtain a single record by id
router.get("/", async (req, res) => {
  let collection = await db.collection("scholar_table");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  // if no record is found
  if (!result) res.send("Not found").status(404);
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
        ig_acc: req.body.ig_acc,
        about: req.body.about,
        sponsor: req.body.sponsor,
        major: req.body.major,
        institution: req.body.institution,
    };
    let collection = await db.collection("scholar_table");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding record");
  }
});

// update a record by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        ig_acc: req.body.ig_acc,
        about: req.body.about,
        sponsor: req.body.sponsor,
        major: req.body.major,
        institution: req.body.institution,
      },
    };

    let collection = await db.collection("scholar_table");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating record");
  }
});

// delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("scholar_table");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting record");
  }
});

export default router;
