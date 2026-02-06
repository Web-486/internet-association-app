import React, { useState, useEffect } from 'react';
import { api, Event } from '../src/services/api';

const Events: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.getEvents({ page: 1, page_size: 10 });
      if (response.success && response.data) {
        setEvents(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const featuredEvent = events.length > 0 ? events[0] : null;
  const listEvents = events.length > 0 ? events.slice(1) : [];

  return (
    <div className="bg-bg-light dark:bg-bg-dark min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="flex flex-col z-20 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md sticky top-0 transition-all">
        <div className="flex items-center justify-between p-4 pb-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">校园活动</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${showSearch ? 'bg-slate-900 text-white' : 'bg-gray-100 dark:bg-white/10 text-slate-900 dark:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${showCalendar ? 'bg-slate-900 text-white' : 'bg-gray-100 dark:bg-white/10 text-slate-900 dark:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </button>
          </div>
        </div>

        {/* Search Bar Expansion */}
        {showSearch && (
          <div className="px-4 pb-3 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
              <input
                type="text"
                placeholder="搜索活动..."
                className="w-full h-10 bg-gray-100 dark:bg-white/5 rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:text-white placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Calendar Overlay/Dropdown */}
      {showCalendar && (
        <div className="px-4 pb-4 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md sticky top-[60px] z-10 border-b border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{new Date().getFullYear()}年 {new Date().getMonth() + 1}月</h3>
              <div className="flex gap-2">
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <span key={d} className="text-xs text-gray-400 font-medium">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Padding for Sat start - Logic simplified for demo */}
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}

              {/* Days */}
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
                const hasEvent = [5, 12, 20].includes(day); // Mock highlight
                return (
                  <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative cursor-pointer transition-colors ${hasEvent ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {day}
                    {hasEvent && <span className="absolute bottom-1.5 w-1 h-1 bg-white dark:bg-slate-900 rounded-full"></span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 py-3 z-10 sticky top-[60px] bg-bg-light dark:bg-bg-dark pt-0">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          <FilterChip label="全部" active />
          <FilterChip label="学术讲座" />
          <FilterChip label="竞赛/考证" />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="px-4 py-1">

          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-gray-400 text-3xl">refresh</span>
            </div>
          ) : (
            <>
              {/* Featured Event */}
              {featuredEvent && (
                <div className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-black shadow-lg aspect-[16/9] w-full mb-6 cursor-pointer">
                  <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${featuredEvent.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}')` }}></div>
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  <div className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 {featuredEvent.status === 'upcoming' ? '热门报名中' : '进行中'}
                  </div>

                  <div className="relative z-20 p-5 flex flex-col gap-1">
                    <span className="text-purple-300 font-bold text-xs tracking-wider uppercase mb-1">{featuredEvent.category}</span>
                    <h2 className="text-2xl font-black leading-tight text-white drop-shadow-sm">{featuredEvent.title}</h2>
                    <p className="text-sm text-gray-300 line-clamp-1 mb-2">{featuredEvent.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-300 font-medium mt-1">
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_clock</span> {new Date(featuredEvent.start_time).toLocaleDateString()} {new Date(featuredEvent.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {featuredEvent.location}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">本周活动</h3>
              </div>

              <div className="flex flex-col gap-4">
                {listEvents.map(event => (
                  <EventCard
                    key={event.id}
                    image={event.image_url || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=60"}
                    title={event.title}
                    tags={event.tags || []}
                    desc={event.description}
                    date={`${new Date(event.start_time).toLocaleDateString()}`}
                    location={event.location}
                    status={event.status === 'upcoming' ? '报名中' : '已结束'}
                    statusColor={event.status === 'upcoming' ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-gray-500 bg-gray-100"}
                  />
                ))}
                {listEvents.length === 0 && !featuredEvent && (
                  <div className="text-center py-10 text-gray-400">
                    <p>暂无活动</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

const FilterChip = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50'}`}>
    {label}
  </button>
);

const EventCard = ({ image, title, tags, desc, date, location, status, statusColor }: any) => (
  <div className="flex bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer">
    <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }}></div>
    <div className="flex-1 ml-3 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 mb-1 text-[15px]">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{desc}</p>
        <div className="flex gap-1 mb-2">
          {tags.map((t: string) => (
            <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-gray-500 font-medium flex flex-col gap-0.5">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {date}</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">location_on</span> {location}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  </div>
);

export default Events;