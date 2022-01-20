import React from "react";
import { useState } from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
import Visualizer from "./pages/Visualizer"
import Render from "./pages/Render"

function App() {
  const [user, setUser] = useState([]);

  const userFromRedirect = (user) => {
    console.log(user);
    setUser(user);
  }

  return (
    <BrowserRouter>
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} exact={true} />
          <Route path="/redirect/*" element={<Redirect updateUser={userFromRedirect} />} />
          <Route path="/visualizer" element={<Render user={user}/>} />
          {/* //Canvas => Visualizer */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
