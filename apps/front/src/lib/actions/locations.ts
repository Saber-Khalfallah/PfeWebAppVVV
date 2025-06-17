import axios from "axios";
import { string } from "zod";


export interface DelegationData {
  governorate: string;
  governorateAr : string;
  delegation: string;   
  delegationAr : string;       // unique identifier
  NameAr: string;
  Value: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
export async function getDelegations(): Promise<DelegationData[]> {
  try {
    const response = await api.get('api/location/delegations');
    return response.data;
  } catch (error) {
    console.error('Error fetching delegations:', error);
    throw new Error('Failed to fetch delegations');
  }
}

export async function getDelegationByPostalCode(postalCode: string): Promise<DelegationData | null> {
  try {
    const response = await api.get(`api/location/delegations/${postalCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching delegation for postal code ${postalCode}:`, error);
    return null;
  }
}