import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-6 h-6 text-zinc-900 animate-spin" />
      <p className="text-xs font-mono text-zinc-400">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
