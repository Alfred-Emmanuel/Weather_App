import React, { useState, useEffect } from 'react';
import './App.css';
import { WeatherProvider } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import Location from './screens/Location'; 

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('weather');
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'weather':
        return <Dashboard />;
      case 'location':
        return <Location />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSelect= (screen: string) => {
    setActiveScreen(screen)
    toggleSidebar()
  }

  useEffect(() => {
    if (isSidebarVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarVisible]);

  return (
    <ThemeProvider>      
      <WeatherProvider>
        <main className={`flex flex-col lg:flex-row lg:items-center lg:justify-center lg:overflow-hidden font-roboto `}>
          <section className='lg:hidden h-full py-3 mb-3 flex items-center justify-between px-3'>
            <div></div>
            <button onClick={toggleSidebar}> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-slate-300">
                  <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
          </section>
          <div className={`sidebar w-full lg:w-[12%] ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <Sidebar onSelect={handleSelect} activeScreen={activeScreen} toggleSidebar={toggleSidebar} />
          </div>
          {renderScreen()}
        </main>
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default App;
