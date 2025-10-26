import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['technician', 'supervisor', 'planner', 'admin'],
    default: 'technician'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  shiftTiming: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    default: 'morning'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  performanceMetrics: {
    totalTasksCompleted: {
      type: Number,
      default: 0
    },
    averageProductivity: {
      type: Number,
      default: 0
    },
    averageEfficiency: {
      type: Number,
      default: 0
    },
    utilizationRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
technicianSchema.index({ employeeId: 1 });
technicianSchema.index({ email: 1 });
technicianSchema.index({ role: 1, isActive: 1 });

export default mongoose.model('Technician', technicianSchema);
