import React from 'react';
import { Link } from 'react-router-dom';

const Publications: React.FC = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
}

export default Publications;