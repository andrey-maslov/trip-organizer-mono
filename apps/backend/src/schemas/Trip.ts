import { Schema, model } from 'mongoose';
import { SectionSchema } from "./Section";

const TripSchema = new Schema({
  name: { type: String, required: true },
  dateStart: String,
  dateEnd: String,
  description: String,
  sections: [SectionSchema],
});

export default model('Trip', TripSchema, 'trips');
