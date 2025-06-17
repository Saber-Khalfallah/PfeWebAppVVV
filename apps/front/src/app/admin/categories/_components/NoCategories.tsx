interface NoCategoriesProps {
  message: string;
}

const NoCategories = ({ message }: NoCategoriesProps) => {
  return (
    <div className="flex justify-center items-center py-10 bg-white rounded-lg shadow-md">
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default NoCategories;