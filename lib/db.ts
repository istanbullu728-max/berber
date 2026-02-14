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

// Ensure DB exists
function ensureDB() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
        }
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// Read DB
export function readDB(): Database {
    try {
        ensureDB();
        if (!fs.existsSync(DB_PATH)) return DEFAULT_DB;
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return DEFAULT_DB;
    }
}

// Write DB
export function writeDB(data: Database) {
    ensureDB();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
