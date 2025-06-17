// lib/actions/user.actions.js (or wherever your frontend actions are)
import axios from "axios";

export const fetchUsers = async ({
  searchTerm = '',
  userType = 'All Users',
  accountStatus = 'All Status',
  createdAt = 'desc',
  page = 1,
  pageSize = 5,
}) => {
  try {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchTerm,
      userType,
      accountStatus,
      sortOrder: createdAt
      
    };
    
    // Construct the URL with query parameters
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:8000/api/user?${queryString}`;

    const res = await axios.get(
      url,
      {
        withCredentials: true,
      },
    );

    // Assuming your backend returns an object like: { users: [...], totalResults: X }
    return res.data;
  } catch (error) {
    console.error(`Error fetching users`, error);
    // You might want to throw the error or return a specific error object
    // instead of null, so the calling component can handle it.
    throw error; // Re-throwing the error to be caught by the frontend component
  }
};

export const toggleUserStatus = async (userId: any) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/user/${userId}/toggle-status`,
      {},
      {
        withCredentials: true,
      },
    );

    // Assuming the backend returns the updated user object
    return response.data;
  } catch (error) {
    console.error(`Error toggling user status for user ${userId}`, error);
    throw error; // Re-throwing the error to be caught by the frontend component
  }
}