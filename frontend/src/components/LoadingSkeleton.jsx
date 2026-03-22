import React from "react";

const LoadingSkeleton = () => (
  <div className="glass rounded-2xl p-4 animate-pulse">
    <div className="flex gap-4 items-center">
      <div className="h-16 w-16 rounded-2xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
