import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { todaysTasks } from '../../mockData';

const TodaysTasks = () => {
  const [showAll, setShowAll] = useState(false);
  const displayTasks = showAll ? todaysTasks : todaysTasks.slice(0, 3);

  return (
    <div className='dashboard-card'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold'>Today&apos;s Appointment</h2>
        <button onClick={() => setShowAll(!showAll)} className='px-4 py-2 bg-indigo-500/10 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition-colors'>
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className='space-y-4'>
        {displayTasks.map(task => (
          <div key={task.id} className='flex items-center justify-between p-4 rounded-lg glass-effect border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300'>
            <div className='flex items-center gap-4'>
              <img src={task.avatar} alt={task.patientName} className='w-10 h-10 rounded-full ring-2 ring-indigo-500/20' />
              <div>
                <p className='font-medium text-gray-200'>{task.patientName}</p>
                <p className='text-sm text-gray-400'>{task.task}</p>
              </div>
            </div>
            <ChevronRight className='w-5 h-5 text-gray-400' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysTasks;
