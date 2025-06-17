// components/NoUsers.jsx
const NoUsers = ({ message = "No users found matching your criteria." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow-md text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
      <p className="text-lg font-semibold mb-2">{message}</p>
      <p className="text-sm">Try adjusting your filters or search terms.</p>
    </div>
  );
};

export default NoUsers;