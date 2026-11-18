import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'There are no records to display.', actionText, actionLink, onAction }) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 my-2">
      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
        <Inbox className="w-5 h-5 stroke-[1.8]" />
      </div>
      <h3 className="text-sm font-bold text-zinc-900 tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-transparent text-xs font-semibold rounded-lg shadow-xs text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-transparent text-xs font-semibold rounded-lg shadow-xs text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
