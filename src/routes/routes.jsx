import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FullLayouts from "../layouts/FullLayouts";

import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Logout from "../components/Auth/Logout";

import UserList from "../components/Users/UserList";
import Not_Found from "../components/Not_Found/Not_Found";
import AddUser from "../components/Users/AddUser";
import EditUser from "../components/Users/EditUser";

const Routing = () => {
  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token"); // Check for the JWT token

    if (!token) {
      return <Navigate to="/login" replace />; // Redirect to login if token is not found
    }

    return children; // Render the children if token is present
  };

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<FullLayouts />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/addUser"
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/editUser/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Not_Found />} />
      </Routes>
    </AnimatePresence>
  );
};

export default Routing;
