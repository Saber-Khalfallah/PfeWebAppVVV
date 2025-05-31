// lib/actions/userAction.ts
import axios from "axios";

export const fetchServiceProviderById = async (id: string) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/service-providers/${id}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};
