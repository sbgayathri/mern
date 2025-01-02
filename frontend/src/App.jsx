

import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Signup from './pages/signup';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" exact element={<Home/>}/>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="/signup" exact element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;
