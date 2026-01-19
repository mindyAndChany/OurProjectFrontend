import { useEffect } from 'react';
import Routing from './Routing.jsx';

function App() {
  useEffect(() => {
    console.log("URL:", import.meta.env.VITE_BACKEND_URL || 'https://ourprojectbackend-1.onrender.com');
  }, []);

  return <Routing />;

  }
export default App;
