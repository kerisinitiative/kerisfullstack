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

// Get all records
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

// Get a single record by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("scholar_table");
    const record = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!record) return res.status(404).send("Not found");
    
    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving record");
  }
});

// Create a new record (with optional image upload)
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

// Update a record by ID (with optional image upload)
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

    if (result.modifiedCount === 0) return res.status(404).send("No changes made or record not found");

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating record");
  }
});

// Delete a record by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("scholar_table");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) return res.status(404).send("Record not found");

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting record");
  }
});

export default router;
