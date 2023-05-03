import tripService from '../services/TripsService';

class TripController {
  async create(req, res) {
    try {
      const trip = await tripService.create(req.body);
      res.status(201).send(trip);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getOne(req, res) {
    try {
      const trip = await tripService.getOne(req.params.id, req.query);
      res.send(trip);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getAll(req, res) {
    console.log('TRIPS')
    try {
      const trips = await tripService.getAll();
      return res.send(trips);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async update(req, res) {
    try {
      const updatedTrip = await tripService.update(req.body);
      res.send(updatedTrip);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async delete(req, res) {
    try {
      const trip = await tripService.delete(req.params.id);
      res.send(trip);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}

export default new TripController();
