import React from 'react';
import { Trash2, AlertCircle, Ban, X, Users, User } from 'lucide-react';

export function DeleteMessageModal({ isOpen, onClose, onConfirmDelete, message, isMe }) {
  if (!isOpen || !message) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl p-5 shadow-2xl border transition-all transform scale-100 animate-slideUp bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-500 font-extrabold text-sm font-heading">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Delete Message?</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-h-24 overflow-hidden truncate">
            <p className="font-mono text-[10px] text-slate-400 mb-1">
              {isMe ? 'You' : (message.senderName || 'Sender')}:
            </p>
            <p className="italic line-clamp-2">
              "{message.content || 'Attachment / Voice note'}"
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isMe 
              ? 'You can delete this message for everyone in this chat or only delete it from your device.'
              : 'Delete this message from your chat history? Other participants will still be able to see it.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {/* Delete for everyone (Sender Only) */}
          {isMe && (
            <button
              type="button"
              onClick={() => onConfirmDelete('forEveryone')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Delete for everyone</span>
            </button>
          )}

          {/* Delete for me (Everyone) */}
          <button
            type="button"
            onClick={() => onConfirmDelete('forMe')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
              isMe
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Delete for me</span>
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
