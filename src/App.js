import logo from './logo.svg';
import './App.css';

import Home from './pages/home';
import AuthProvider from './context/authContext';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SearchProvider from './context/searchContext';
import Result from './pages/result';
import Login from './components/login/login'
import History from './pages/history/index'
import Profile from './pages/profile/index'
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
            <Routes>
              <Route path="/" element={<PrivateRoute Component={Home} />} />
              <Route path='/login' element={<Login />} />
              <Route path='/search/result' element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
