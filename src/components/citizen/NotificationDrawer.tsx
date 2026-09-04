import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Award, HardHat, Sparkles, X, ChevronRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIssue: (issueId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectIssue,
}) => {
  const { notifications, markNotificationsAsRead, t } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-navy-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t.notifications}</h3>
              <p className="text-[11px] text-slate-400">Updates on your reports & rewards</p>
            </div>
          </div>
          <button
            onClick={() => {
              markNotificationsAsRead();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-navy-800 transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.issueId) {
                    onSelectIssue(notif.issueId);
                    onClose();
                  }
                }}
                className={`pt-2.5 first:pt-0 flex items-start space-x-3 p-2 rounded-xl transition-colors ${
                  notif.issueId ? 'cursor-pointer hover:bg-slate-50' : ''
                } ${!notif.read ? 'bg-emerald-50/50' : ''}`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notif.type === 'xp'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'badge'
                      ? 'bg-emerald-100 text-emerald-700'
                      : notif.type === 'worker'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {notif.type === 'xp' ? (
                    <Sparkles className="w-4 h-4" />
                  ) : notif.type === 'badge' ? (
                    <Award className="w-4 h-4" />
                  ) : notif.type === 'worker' ? (
                    <HardHat className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.issueId && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 mt-1 hover:underline">
                      {t.viewTracking} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => {
              markNotificationsAsRead();
              onClose();
            }}
            className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors min-h-touch"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};
