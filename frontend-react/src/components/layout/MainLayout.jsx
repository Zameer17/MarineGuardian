import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0B132B] text-slate-100 font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
