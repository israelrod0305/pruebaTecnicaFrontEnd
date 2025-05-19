import './App.css';


import MainRoute from './routes/mainRoute';
import { AuthProvider } from './services/AuthProvider';
import './App.css'

function App() {

  
  return (
    <>
      <AuthProvider>
        <MainRoute />
      </AuthProvider>
    </>
  )
}

export default App
