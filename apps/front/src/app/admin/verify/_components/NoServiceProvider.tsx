interface NoServiceProviderProps {
  message: string;
}

const NoServiceProvider = ({ message }: NoServiceProviderProps) => {
  return (
    <div className="text-center py-10">
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default NoServiceProvider;