import tripService from '../services/TripsService'

class TripController {
  async create(req, res) {
    try {
      const trip = await tripService.create(req.body);
      res.status(201).json(trip);
    } catch (e) {
      console.log(e)
      res.status(500).json(e);
    }
  }

  async getOne(req, res) {
    try {
      const trip = await tripService.getOne(req.params.id);
      res.json(trip);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    try {
      const trips = await tripService.getAll();
      res.json(trips);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const updatedTrip = await tripService.update(req.body)
      res.json(updatedTrip);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async delete(req, res) {
    try {
      const trip = await tripService.delete(req.params.id);
      res.json(trip);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new TripController()
