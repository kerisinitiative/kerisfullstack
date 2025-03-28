import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// AWS S3 Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const s3 = new AWS.S3();

// Multer Storage (Handles file upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Scholars Table
 */
// Get all scholars
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("scholar_table");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving records");
  }
});

/**
 * Sponsors Table
 */
// Get all sponsors *** DIS MUST COME BEFORE GETTING SCHOLAR BY ID OR ELSE AN ERROR WILL BE THROWN!!!!
router.get("/sponsors", async (req, res) => {
  try {
    const collection = await db.collection("sponsor_table");
    const sponsors = await collection.find({}).toArray();
    res.status(200).json(sponsors);
  } catch (error) {
    console.error("Error retrieving sponsors:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single sponsor by ID
router.get("/sponsors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const collection = await db.collection("sponsor_table");
    const sponsor = await collection.findOne({ _id: new ObjectId(id) });

    if (!sponsor) return res.status(404).send("Sponsor not found");

    res.status(200).json(sponsor);
  } catch (error) {
    console.error("Error retrieving sponsor:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single scholar by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const collection = await db.collection("scholar_table");
    const record = await collection.findOne({ _id: new ObjectId(id) });

    if (!record) return res.status(404).send("Not found");

    res.status(200).json(record);
  } catch (error) {
    console.error("Error retrieving record:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new scholars (with optional image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      imageUrl = uploadResult.Location;
    }

    const newRecord = {
      name: req.body.name,
      email: req.body.email,
      ig_acc: req.body.ig_acc,
      about: req.body.about,
      sponsor: req.body.sponsor,
      major: req.body.major,
      institution: req.body.institution,
      image: imageUrl, // Store image URL in MongoDB
    };

    const collection = await db.collection("scholar_table");
    const result = await collection.insertOne(newRecord);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding record");
  }
});

// Update a scholars by ID (with optional image upload)
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = req.body.image; // Retain existing image unless a new one is uploaded

    if (req.file) {
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      imageUrl = uploadResult.Location;
    }

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
        image: imageUrl,
      },
    };

    const collection = await db.collection("scholar_table");
    const result = await collection.updateOne(query, updates);

    if (result.modifiedCount === 0)
      return res.status(404).send("No changes made or record not found");

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating record");
  }
});

// Delete a scholars by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("scholar_table");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0)
      return res.status(404).send("Record not found");

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting record");
  }
});

export default router;
