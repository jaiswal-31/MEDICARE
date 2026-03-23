// Quick test to verify ServiceAppointment can be created without validation errors
import 'dotenv/config';
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import ServiceAppointment from './models/serviceAppointment.js';
import Service from './models/Service.js';

await connectDB();

// Get one service to use as reference
const svc = await Service.findOne({}).lean();
if (!svc) {
  console.log('No services found in DB!');
  process.exit(1);
}
console.log('Found service:', svc._id, svc.name);

try {
  const test = await ServiceAppointment.create({
    serviceId: svc._id,
    serviceName: svc.name,
    serviceImage: { url: '', publicId: '' },
    patientName: 'Test Patient',
    mobile: '1234567890',
    age: 25,
    gender: 'Male',
    date: '2026-04-01',
    hour: 10,
    minute: 0,
    ampm: 'AM',
    fees: 100,
    createdBy: 'test_user_debug',
    notes: '',
    status: 'Confirmed',
    payment: {
      method: 'Online',
      status: 'Paid',         // ← after fix
      amount: 100,
      paidAt: new Date(),
    },
  });
  console.log('\n✅ Created successfully! _id:', test._id);
  
  // Now fetch it back
  const found = await ServiceAppointment.find({ createdBy: 'test_user_debug' }).lean();
  console.log('Found back:', found.length, 'records');
  
  // Clean up
  await ServiceAppointment.deleteOne({ _id: test._id });
  console.log('Cleaned up test record.');
} catch (err) {
  console.error('\n❌ VALIDATION/CREATE ERROR:', err.message);
  if (err.errors) console.error('Fields:', Object.keys(err.errors));
}

process.exit(0);
