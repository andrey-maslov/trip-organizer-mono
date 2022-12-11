import axios from 'axios';
import { API } from './api.constants';
import {Section, TripType} from '../../../../libs/models/models';

export type Params = {
  name?: number;
  _id?: number;
};

// TODO add serialization for params and handle them on BE
export const fetchTrips = async (params: Params): Promise<TripType[]> => {
  return axios.get(API.TRIPS).then((res) => res.data);
};

export const fetchOneTrip = async (id: string): Promise<TripType> => {
  return axios.get(`${API.TRIPS}/${id}`).then((res) => res.data);
};

export const createTrip = async (newTrip: TripType): Promise<TripType> => {
  return axios.post(API.TRIPS, newTrip).then((res) => res.data);
}

export const updateTrip = async (newTrip: TripType): Promise<TripType> => {
  return axios.put(API.TRIPS, newTrip).then((res) => res.data);
}

export const removeTrip = async (id: string): Promise<TripType> => {
  return axios.delete(`${API.TRIPS}/${id}`).then((res) => res.data);
}

export const addTripSection = async (tripId: string, sectionData: Section): Promise<TripType> => {
  return axios.put(`${API.TRIPS}/${tripId}`, sectionData).then((res) => res.data);
}
