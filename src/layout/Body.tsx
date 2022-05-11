import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Leaders from "../pages/Leaders";
import Participants from "../pages/Participants";
import Schedules from "../pages/Schedules";
import Competences from "../pages/Competences";

//Route to any page in app

function Body() {
  return (
    <div className="myBody">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Schedules />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/competences" element={<Competences />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Body;
