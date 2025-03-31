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
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Multer Storage (Handles file upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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

// Get all sponsors
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

/**
 * SCHOLAR SERVER ACTIONS
 */

// Add new scholar (with optional image upload)
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

    // Parse array fields
    const majors = Array.isArray(req.body.major) ? req.body.major : [req.body.major].filter(Boolean);
    const institutions = Array.isArray(req.body.institution) ? req.body.institution : [req.body.institution].filter(Boolean);

    // Handle availability - FormData sends it as string 'true' or 'false'
    const availability = req.body.availability === 'true';

    const newRecord = {
      name: req.body.name,
      email: req.body.email,
      ig_acc: req.body.ig_acc,
      about: req.body.about,
      sponsor: req.body.sponsor,
      major: majors,
      institution: institutions,
      availability: availability, // This is now properly converted to boolean
      image: imageUrl,
    };

    console.log('Creating new record:', newRecord); // Debug log

    const collection = await db.collection("scholar_table");
    const result = await collection.insertOne(newRecord);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(500).send("Error adding record");
  }
});

// Update a scholar by ID (with optional image upload)
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("scholar_table");
    const currentRecord = await collection.findOne(query);

    if (!currentRecord) {
      return res.status(404).send("Record not found");
    }

    const updates = { $set: {} };
    let hasUpdates = false;

    // Handle availability
    if (req.body.availability !== undefined) {
      updates.$set.availability = req.body.availability === 'true';
      hasUpdates = true;
    }

    // Handle other fields
    const fieldsToUpdate = [
      'name', 'email', 'ig_acc', 'about', 'sponsor', 'major', 'institution'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.$set[field] = req.body[field];
        hasUpdates = true;
      }
    });

    // Handle array fields
    if (req.body.major) {
      updates.$set.major = Array.isArray(req.body.major) 
        ? req.body.major 
        : [req.body.major];
      hasUpdates = true;
    }

    if (req.body.institution) {
      updates.$set.institution = Array.isArray(req.body.institution) 
        ? req.body.institution 
        : [req.body.institution];
      hasUpdates = true;
    }

    // Handle image update
    if (req.file) {
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      updates.$set.image = uploadResult.Location;
      hasUpdates = true;

      // Delete old image if it exists
      if (currentRecord.image) {
        try {
          const oldImageKey = currentRecord.image.split('/').pop();
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${oldImageKey}`,
          }).promise();
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    } else if (req.body.imageAction === "remove") {
      updates.$set.image = null;
      hasUpdates = true;
      
      if (currentRecord.image) {
        try {
          const oldImageKey = currentRecord.image.split('/').pop();
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${oldImageKey}`,
          }).promise();
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const result = await collection.updateOne(query, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating record");
  }
});

// Delete a scholar by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("scholar_table");
    
    // First get the record to check if it has an image
    const currentRecord = await collection.findOne(query);
    
    if (!currentRecord) {
      return res.status(404).send("Record not found");
    }

    // Delete the record from MongoDB
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("Record not found");
    }

    // If the record had an image, delete it from S3
    if (currentRecord.image) {
      try {
        const oldImageKey = currentRecord.image.split('/').pop();
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `uploads/${oldImageKey}`,
        }).promise();
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // We still proceed even if image deletion fails
      }
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting record");
  }
});

/**
 * SPONSOR SERVER ACTIONS
 */

// Add new sponsor (with optional image upload)
router.post("/sponsors", upload.single("image"), async (req, res) => {
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

    // Safely parse array fields
    const majors_offered = typeof req.body.majors_offered === 'string' 
      ? req.body.majors_offered.split(',').map(item => item.trim()).filter(Boolean)
      : Array.isArray(req.body.majors_offered)
        ? req.body.majors_offered.map(item => String(item).trim()).filter(Boolean)
        : [];
    
    const programs = typeof req.body.programs === 'string'
      ? req.body.programs.split(',').map(item => item.trim()).filter(Boolean)
      : Array.isArray(req.body.programs)
        ? req.body.programs.map(item => String(item).trim()).filter(Boolean)
        : [];

    // Handle status
    const status = req.body.status === 'true';

    const newSponsor = {
      sponsor: req.body.sponsor,
      status: status,
      time_start: new Date(req.body.time_start),
      time_end: new Date(req.body.time_end),
      image: imageUrl,
      programs: programs,
      majors_offered: majors_offered,
      link: req.body.link,
      about: req.body.about
    };

    console.log('Creating new sponsor:', newSponsor);

    const collection = await db.collection("sponsor_table");
    const result = await collection.insertOne(newSponsor);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding sponsor:", error);
    res.status(500).send("Error adding sponsor");
  }
});

// Update a sponsor by ID (with optional image upload)
router.patch("/sponsors/:id", upload.single("image"), async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("sponsor_table");
    const currentSponsor = await collection.findOne(query);

    if (!currentSponsor) {
      return res.status(404).send("Sponsor not found");
    }

    const updates = { $set: {} };
    let hasUpdates = false;

    // Handle status
    if (req.body.status !== undefined) {
      updates.$set.status = req.body.status === 'true';
      hasUpdates = true;
    }

    // Handle other fields
    const fieldsToUpdate = [
      'sponsor', 'time_start', 'time_end', 'link', 'about'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.$set[field] = field.includes('time_') ? new Date(req.body[field]) : req.body[field];
        hasUpdates = true;
      }
    });

    // Handle array fields - more robust handling
    if (req.body.majors_offered !== undefined) {
      let majorsArray;
      if (typeof req.body.majors_offered === 'string') {
        majorsArray = req.body.majors_offered.split(',').map(item => item.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.majors_offered)) {
        majorsArray = req.body.majors_offered.map(item => String(item).trim()).filter(Boolean);
      } else {
        majorsArray = [];
      }
      updates.$set.majors_offered = majorsArray;
      hasUpdates = true;
    }

    if (req.body.programs !== undefined) {
      let programsArray;
      if (typeof req.body.programs === 'string') {
        programsArray = req.body.programs.split(',').map(item => item.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.programs)) {
        programsArray = req.body.programs.map(item => String(item).trim()).filter(Boolean);
      } else {
        programsArray = [];
      }
      updates.$set.programs = programsArray;
      hasUpdates = true;
    }

    // Handle image update
    if (req.file) {
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      updates.$set.image = uploadResult.Location;
      hasUpdates = true;

      // Delete old image if it exists
      if (currentSponsor.image) {
        try {
          const oldImageKey = currentSponsor.image.split('/').pop();
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${oldImageKey}`,
          }).promise();
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    } else if (req.body.imageAction === "remove") {
      updates.$set.image = null;
      hasUpdates = true;
      
      if (currentSponsor.image) {
        try {
          const oldImageKey = currentSponsor.image.split('/').pop();
          await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${oldImageKey}`,
          }).promise();
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const result = await collection.updateOne(query, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    res.status(500).send("Error updating sponsor");
  }
});
// Delete a sponsor by ID
router.delete("/sponsors/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("sponsor_table");
    const sponsor = await collection.findOne(query);

    if (!sponsor) {
      return res.status(404).send("Sponsor not found");
    }

    // Delete associated image if it exists
    if (sponsor.image) {
      try {
        const imageKey = sponsor.image.split('/').pop();
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `uploads/${imageKey}`,
        }).promise();
      } catch (deleteError) {
        console.error("Error deleting sponsor image:", deleteError);
      }
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("Sponsor not found");
    }

    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).send("Error deleting sponsor");
  }
});

export default router;