import { ServiceCategory } from "../types/modelTypes";

// Base API URL - adjust this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch all service categories
 */
export async function fetchCategories(): Promise<ServiceCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/service-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const categories: ServiceCategory[] = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
