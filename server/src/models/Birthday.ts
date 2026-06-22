import mongoose, { Document, Schema } from 'mongoose';

export interface IBirthday extends Document {
  name: string;
  birthDate: Date;
  note?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BirthdaySchema = new Schema<IBirthday>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    birthDate: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Compound index: filters birthdays by user, then sorts/ranges on date.
// Leftmost-prefix rule means queries on createdBy alone also use this index,
// so no separate single-field index on createdBy is needed.
BirthdaySchema.index({ createdBy: 1 });
BirthdaySchema.index({ createdBy: 1, birthDate: 1 });

export const Birthday = mongoose.model<IBirthday>('Birthday', BirthdaySchema);
