import mongoose from 'mongoose';
import Appointment from './models/Appointment.js';
import ServiceAppointment from './models/serviceAppointment.js';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/medicare';

async function checkDb() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to DB');

    const appts = await Appointment.find({}).limit(5);
    console.log('--- Doctor Appointments (last 5) ---');
    appts.forEach(a => console.log(`ID: ${a._id}, CreatedBy: ${a.createdBy}, Patient: ${a.patientName}, Date: ${a.date}`));

    const sAppts = await ServiceAppointment.find({}).limit(5);
    console.log('\n--- Service Appointments (last 5) ---');
    sAppts.forEach(a => console.log(`ID: ${a._id}, CreatedBy: ${a.createdBy}, Patient: ${a.patientName}, Date: ${a.date}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkDb();
