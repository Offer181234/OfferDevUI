import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import CreateUser from "./CreateUser";
import UserManager from "./pages/UserManager";
import EditUserPage from "./pages/EditUserPage";
import AffiliatePage from "./pages/AffiliatePage";
import AdvertisersPage from "./pages/AdvertisersPage";

import './css/App.css';
 
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/user-manager" element={<UserManager />} />
        <Route path="/edit-user/:id" element={<EditUserPage />} />
        <Route path="/affiliates" element={<AffiliatePage />} />
        <Route path="/advertisers" element={<AdvertisersPage />} />
      </Routes>
    </div>
  );
}
 
export default App
 
 