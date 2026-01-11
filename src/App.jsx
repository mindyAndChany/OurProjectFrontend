import { useEffect } from 'react';
import Routing from './Routing.jsx';

function App() {
  useEffect(() => {
    console.log("URL:", process.env.REACT_APP_BACKEND_URL);
  }, []);

  return <Routing />;

  }
export default App;
