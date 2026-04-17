import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'careerpath.json');

let db = {
  careers: [],
  quizQuestions: [],
  scoringWeights: []
};

export function getDb() {
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    db = JSON.parse(data);
  }
  return db;
}

export function saveDb(newDb) {
  db = newDb;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
