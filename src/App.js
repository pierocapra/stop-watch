import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./Auth.js"
import Login from './Login';
import Signup from './Signup';
import Main from './main';
import PrivateRoute from "./PrivateRoute.js"
import ForgotPassword from './ForgotPassword.js';
import Header from './components/Header';

// CSS
import './App.css';

function App() {

  return (
    <main className="app">
      <Router>
        <AuthProvider>
        <Header />
          <Routes>
            <Route exact path='/' element={<PrivateRoute><Main /></PrivateRoute>}>
            </Route>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/signup' element={<Signup />} />
            <Route exact path='/forgot-password' element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </Router>
    </main>
  );
}

export default App;
