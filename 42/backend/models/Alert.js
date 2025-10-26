import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['delay', 'deadline', 'low-performance', 'quality-issue', 'system'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedJobOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOrder'
  },
  relatedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  relatedTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  targetRoles: [{
    type: String,
    enum: ['technician', 'supervisor', 'planner', 'admin']
  }]
}, {
  timestamps: true
});

// Index for faster queries
alertSchema.index({ isRead: 1, severity: -1, createdAt: -1 });
alertSchema.index({ targetRoles: 1, isRead: 1 });
alertSchema.index({ relatedJobOrder: 1 });
alertSchema.index({ relatedTechnician: 1 });

export default mongoose.model('Alert', alertSchema);
