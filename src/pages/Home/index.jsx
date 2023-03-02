import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  navigate("/signin");
  return (
    <>
      
    </>
  );
}

export default Home;
