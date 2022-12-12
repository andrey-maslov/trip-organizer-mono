import { Schema, model } from 'mongoose';

export const SectionSchema = new Schema({
  name: String,
  type: String,
  points: [
    {
      name: String,
      coords: String,
      country: String,
    },
  ],
  dateTimeStart: String,
  dateTimeEnd: String,
  transportType: String,
  placementType: String,
  serviceProvider: {
    name: String,
    link: String,
  },
  status: String,
  payments: [
    {
      name: String,
      link: String,
      price: {
        amount: Number,
        currency: String,
      },
    },
  ],
  notes: String,
});

export default model('Section', SectionSchema);
