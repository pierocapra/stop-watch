import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./Auth.js"
import Login from './Login.js';
import Main from './main';
import PrivateRoute from "./PrivateRoute.js"

// CSS
import './App.css';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<PrivateRoute><Main /></PrivateRoute>}>
          </Route>
          <Route exact path='/login' element={<Login />} />
          {/* <Route path='/signup' element={<Auth />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
