import React from 'react';
import { ViewType } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const NavIcon: React.FC<{ path: string }> = ({ path }) => (
    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-card p-4 flex flex-col border-r border-border">
      <div className="flex items-center mb-8 pl-2">
         <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center font-bold text-xl text-primary">
            E
        </div>
        <h1 className="text-xl font-bold ml-3">EthixxTradeBot</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <NavIcon path={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto text-center text-muted-foreground text-xs">
          <p>Orchestrator v2.0.0</p>
          <p>&copy; 2024 Ethixx</p>
      </div>
    </aside>
  );
};