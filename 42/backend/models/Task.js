import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  },
  jobOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOrder',
    required: true
  },
  taskDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  unitsCompleted: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  serialNumbersCompleted: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paused', 'cancelled'],
    default: 'in-progress'
  },
  productivity: {
    type: Number,
    default: 0,
    min: 0
  },
  efficiency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true
  },
  issues: [{
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Calculate duration in hours
taskSchema.virtual('durationHours').get(function() {
  if (this.endTime && this.startTime) {
    const diff = this.endTime - this.startTime;
    return (diff / (1000 * 60 * 60)).toFixed(2);
  }
  return 0;
});

// Calculate productivity (units per hour)
taskSchema.methods.calculateProductivity = function() {
  const hours = this.durationHours;
  if (hours > 0) {
    this.productivity = (this.unitsCompleted / hours).toFixed(2);
  }
  return this.productivity;
};

// Index for faster queries
taskSchema.index({ technician: 1, taskDate: -1 });
taskSchema.index({ jobOrder: 1, status: 1 });
taskSchema.index({ taskDate: -1 });

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

export default mongoose.model('Task', taskSchema);
