import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
  name: String,
  link: String,
  price: {
    amount: Number,
    currency: String,
  },
});


export const SectionSchema = new Schema({
  name: String,
  pointStart: {
    name: String,
    coords: String,
    country: String,
  },
  pointEnd: {
    name: String,
    coords: String,
    country: String,
  },
  start: String,
  end: String,
  transport: String,
  carrier: {
    name: String,
    link: String,
  },
  status: String,
  tickets: [TicketSchema],
  notes: String,
});

export default model('Section', SectionSchema);
