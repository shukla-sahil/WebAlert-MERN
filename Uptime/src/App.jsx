import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      {/* <h1>My App</h1> */}
      <Outlet />
    </div>
  );
}

export default App;
