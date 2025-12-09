'use client';

import { useState, useEffect, useRef } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actions/notifications';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetch = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const handleRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
    await markAsRead(id);
    fetch();
  };

  const handleReadAll = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
    await markAllAsRead();
    fetch();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="w-5 h-5 text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h4 className="font-semibold text-white text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <button className="text-xs text-blue-400 hover:text-blue-300" onClick={handleReadAll}>
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/40">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.readAt ? 'bg-white/[0.02]' : ''}`}
                  onClick={() => !n.readAt && handleRead(n.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h5 className={`text-sm ${!n.readAt ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>
                      {n.title}
                    </h5>
                    {!n.readAt && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                  </div>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{n.body}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-white/30">{new Date(n.createdAt).toLocaleDateString()}</span>
                    {n.actionUrl && (
                      <Link href={n.actionUrl} className="text-[10px] text-blue-400 hover:underline" onClick={() => setOpen(false)}>
                        View Action
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
