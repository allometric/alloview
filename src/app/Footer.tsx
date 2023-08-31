import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center mt-36 w-full lg:w-1/2 xl:w-1/2 mb-12 mx-auto shadow-md rounded-none md:rounded-none lg:rounded-lg">
      <p className="text-sm opacity-60">Courtesy Enterprises © {new Date().getFullYear()}</p>
      <p className="text-xs opacity-40">Courtesy Fav Rate Leaderboards</p>
    </footer>
  );
};

export default Footer;