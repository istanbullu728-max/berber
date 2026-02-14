import fs from 'fs';
import path from 'path';
import { Appointment, Settings, ManualBlock } from './store';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Interface for the whole DB
interface Database {
    appointments: Appointment[];
    settings: Settings;
    blocks: ManualBlock[];
}

// Default Data
const DEFAULT_DB: Database = {
    appointments: [],
    settings: {
        shopName: 'Randevum Barber',
        smsHeader: 'RNDVMBRBR',
        workingHours: [
            { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isDayOff: true },
            { dayOfWeek: 1, startTime: '09:00', endTime: '21:00', isDayOff: false },
            { dayOfWeek: 2, startTime: '09:00', endTime: '21:00', isDayOff: false },
            { dayOfWeek: 3, startTime: '09:00', endTime: '21:00', isDayOff: false },
            { dayOfWeek: 4, startTime: '09:00', endTime: '21:00', isDayOff: false },
            { dayOfWeek: 5, startTime: '09:00', endTime: '21:00', isDayOff: false },
            { dayOfWeek: 6, startTime: '09:00', endTime: '20:00', isDayOff: false },
        ],
    },
    blocks: []
};

// Global in-memory fallback for Vercel/Read-only environments
declare global {
    var _db: Database | undefined;
}

if (!global._db) {
    global._db = { ...DEFAULT_DB };
}

// Ensure DB exists (local only)
function ensureDB() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
        }
    } catch (error) {
        // Silently fail on read-only FS
    }
}

// Read DB
export function readDB(): Database {
    try {
        ensureDB();
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            const fileDB = JSON.parse(data);
            // Sync in-memory with file if file exists (for hybrid envs)
            global._db = fileDB;
            return fileDB;
        }
    } catch (error) {
        // Fallback to memory
    }
    return global._db || DEFAULT_DB;
}

// Write DB
export function writeDB(data: Database) {
    // Always update memory first
    global._db = data;

    try {
        ensureDB();
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Write to disk failed (expected on Vercel), using in-memory store.');
    }
}
