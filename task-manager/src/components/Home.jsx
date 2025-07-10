import React from "react";

const Home = ({ onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Home;
