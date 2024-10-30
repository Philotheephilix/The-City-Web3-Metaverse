import './App.css'
import { BrowserRouter as Router} from 'react-router-dom';
import { AnonAadhaarProvider } from '@anon-aadhaar/react'
import AppRoutes from './AppRoutes'
function App() {

  return (
    <AnonAadhaarProvider>
      <Router>
        <AppRoutes /> 
      </Router>
    </AnonAadhaarProvider>
  )
}

export default App
