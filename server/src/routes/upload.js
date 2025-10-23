import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFParse } from 'pdf-parse';

const router = express.Router()
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");

        const dataBuffer = fs.readFileSync(req.file.path);
        const uint8Array = new Uint8Array(dataBuffer);
        const parser = new PDFParse(uint8Array);
        const result = await parser.getText();
        await parser.destroy();
        fs.unlinkSync(req.file.path);

        res.json({ text: result.text });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error parsing PDF");
    }
})

export default router;

