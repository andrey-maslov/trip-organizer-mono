import TripSchema from '../schemas/Trip';
import { getTripSummaryValues } from './TripSummaryService';
import { Trip } from '@/shared/models';

class TripService {
  async create(trip) {
    return TripSchema.create(trip);
  }

  async getOne(id) {
    if (!id) {
      throw new Error('No id');
    }
    const trip: Trip = await TripSchema.findById(id).lean();
    const summary = await getTripSummaryValues(trip, 'EUR');
    return { ...trip, summary };
  }

  async getAll() {
    return TripSchema.find().lean();
  }

  async update(trip) {
    if (!trip._id) {
      throw new Error('No id');
    }
    return TripSchema.findByIdAndUpdate(trip._id, trip, { new: true });
  }

  async delete(id) {
    if (!id) {
      throw new Error('No id');
    }
    return TripSchema.findByIdAndDelete(id);
  }
}

export default new TripService();
