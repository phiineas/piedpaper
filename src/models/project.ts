import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  lastUpdated: Date;
  starred: boolean;
  _id: string;
}

const ProjectSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'please provide a project name'],
    trim: true
  },
  description: { 
    type: String, 
    default: ''
  },
  content: { 
    type: String, 
    default: '# new project\n\nayoo !'
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now
  },
  starred: { 
    type: Boolean, 
    default: false
  }
});

// prevent mongoose error when model is already defined
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
