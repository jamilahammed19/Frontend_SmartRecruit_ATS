import { useState, useEffect, useRef } from 'react';
import { getMyNotifications, markNotificationRead } from '../../services/notificationService';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch notifications on load
    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const data = await getMyNotifications();
                setNotifications(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        };
        fetchNotifs();

        // Close dropdown when clicking outside of it
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleMarkRead = async (id, isRead) => {
        if (isRead) return; // Don't do anything if already read
        try {
            await markNotificationRead(id);
            // Update UI instantly
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none rounded-full hover:bg-slate-100"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Red Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                            {unreadCount} New
                        </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center">
                                <span className="text-3xl mb-2">📭</span>
                                You have no notifications.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => handleMarkRead(notif.id, notif.is_read)}
                                    className={`p-4 cursor-pointer transition-colors ${!notif.is_read ? 'bg-blue-50/50 hover:bg-blue-50' : 'bg-white hover:bg-slate-50 opacity-80'}`}
                                >
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className={`text-sm pr-4 ${!notif.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                            {notif.title}
                                        </h4>
                                        {/* Blue dot for unread */}
                                        {!notif.is_read && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>}
                                    </div>
                                    <p className={`text-xs mb-2 leading-relaxed ${!notif.is_read ? 'text-slate-700' : 'text-slate-500'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                        {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}