
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataDirectory = path.join(__dirname, "data");
const dataFile = path.join(dataDirectory, "resumes.json");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", "utf8");
}

function readResumes() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeResumes(resumes) {
  fs.writeFileSync(dataFile, JSON.stringify(resumes, null, 2), "utf8");
}

app.get("/api/resumes", (req, res) => {
  res.json(readResumes());
});

app.get("/api/resumes/:id", (req, res) => {
  const resume = readResumes().find((item) => item.id === req.params.id);

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  res.json(resume);
});

app.post("/api/resumes", (req, res) => {
  const resumes = readResumes();

  const resume = {
    ...req.body,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  resumes.push(resume);
  writeResumes(resumes);

  res.status(201).json(resume);
});

app.put("/api/resumes/:id", (req, res) => {
  const resumes = readResumes();
  const index = resumes.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Resume not found" });
  }

  resumes[index] = {
    ...resumes[index],
    ...req.body,
    id: resumes[index].id,
    updatedAt: new Date().toISOString(),
  };

  writeResumes(resumes);
  res.json(resumes[index]);
});

app.delete("/api/resumes/:id", (req, res) => {
  const resumes = readResumes();
  const updated = resumes.filter((item) => item.id !== req.params.id);

  if (updated.length === resumes.length) {
    return res.status(404).json({ message: "Resume not found" });
  }

  writeResumes(updated);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Resume API running at http://localhost:${PORT}`);
});
