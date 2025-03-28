import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`glow-effect glass-effect rounded-xl p-8 hover-glow transition-all duration-300 ${className}`}>
      <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6'>{title}</h2>
      {children}
    </div>
  );
};

export default DashboardCard;
