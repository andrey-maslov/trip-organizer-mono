import Trip from '../schemas/Trip'

class TripService {

  async create(trip) {
    return Trip.create(trip)
  }

  async getOne(id) {
    if (!id) {
      throw new Error('No id')
    }
    return Trip.findById(id);
  }

  async getAll() {
    return Trip.find();
  }

  async update(trip) {
    if (!trip._id) {
      throw new Error('No id')
    }
    return Trip.findByIdAndUpdate(trip._id, trip, { new: true })
  }

  async delete(id) {
    if (!id) {
      throw new Error('No id');
    }
    return Trip.findByIdAndDelete(id);
  }

}

export default new TripService();
