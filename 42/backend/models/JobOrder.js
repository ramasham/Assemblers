import mongoose from 'mongoose';

const jobOrderSchema = new mongoose.Schema({
  jobOrderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productCode: {
    type: String,
    trim: true
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  completedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'delayed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  assignedTechnicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  }],
  serialNumbers: [{
    serialNumber: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician'
    },
    completedAt: Date,
    notes: String
  }],
  notes: {
    type: String,
    trim: true
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
jobOrderSchema.virtual('progressPercentage').get(function() {
  return this.totalQuantity > 0 ? (this.completedQuantity / this.totalQuantity * 100).toFixed(2) : 0;
});

// Virtual for delay status
jobOrderSchema.virtual('isDelayed').get(function() {
  return this.status !== 'completed' && new Date() > new Date(this.dueDate);
});

// Index for faster queries
jobOrderSchema.index({ jobOrderNumber: 1 });
jobOrderSchema.index({ status: 1, dueDate: 1 });
jobOrderSchema.index({ assignedTechnicians: 1 });

jobOrderSchema.set('toJSON', { virtuals: true });
jobOrderSchema.set('toObject', { virtuals: true });

export default mongoose.model('JobOrder', jobOrderSchema);
