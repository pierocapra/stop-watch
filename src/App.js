import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './Auth.js';
import Main from './main';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/main' element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
