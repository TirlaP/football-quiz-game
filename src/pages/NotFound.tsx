import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-white-100">
      <div className="max-w-md w-full bg-white-100 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-6xl font-extrabold text-green-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Looks like you've wandered offside! The page you're looking for doesn't exist.
        </p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          className="flex items-center justify-center mx-auto"
        >
          <Home size={20} className="mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;