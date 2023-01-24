import axios from 'axios';
import { API } from './api.constants';
import { Section, Trip } from '../models/models';

export type Params = {
  name?: number;
  _id?: number;
};

// TODO add serialization for params and handle them on BE
export const fetchTrips = async (params: Params): Promise<Trip[]> => {
  return axios.get(API.TRIPS).then((res) => res.data);
};

export const fetchOneTrip = async (id: string): Promise<Trip> => {
  return axios.get(`${API.TRIPS}/${id}`).then((res) => res.data);
};

export const createTrip = async (newTrip: Trip): Promise<Trip> => {
  return axios.post(API.TRIPS, newTrip).then((res) => res.data);
};

export const updateTrip = async (newTrip: Trip): Promise<Trip> => {
  return axios.put(API.TRIPS, newTrip).then((res) => res.data);
};

export const removeTrip = async (id: string): Promise<Trip> => {
  return axios.delete(`${API.TRIPS}/${id}`).then((res) => res.data);
};

export const addTripSection = async (
  tripId: string,
  sectionData: Section
): Promise<Trip> => {
  return axios
    .put(`${API.TRIPS}/${tripId}`, sectionData)
    .then((res) => res.data);
};

// API health check
export const checkAPIHealth = async (): Promise<string> => {
  return axios.get(API.HEALTH).then((res) => res.data);
};

// API variables check
export const checkAPIVars = async (): Promise<{
  port: number | undefined;
  env: string | undefined;
  dbUri: string | undefined;
  dbConnectionState: number | undefined;
}> => {
  return axios.get(API.VARS).then((res) => res.data);
};
