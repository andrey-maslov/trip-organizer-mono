import { Router } from "express";
import tripController from "../controllers/TripController";

const tripRouter = Router();

tripRouter.get("/trips", tripController.getAll);

tripRouter.get("/trips/:id", tripController.getOne);

tripRouter.post("/trips", tripController.create);

tripRouter.put("/trips", tripController.update);

tripRouter.delete("/trips/:id", tripController.delete);

export default tripRouter;
