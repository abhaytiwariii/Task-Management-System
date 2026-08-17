"use client";

import React from "react";

export const BoardSkeleton = () => {
  return (
    <div className="flex space-x-5 overflow-x-auto pb-4 h-[calc(100vh-180px)] items-start">
      {[1, 2, 3, 4].map((colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col w-[340px] shrink-0 rounded-[10px] border border-border bg-muted/30 px-2.5 py-3.5 space-y-3"
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between px-2.5 pb-2">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-muted animate-pulse" />
              <div className="h-5 w-24 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-5 w-10 rounded bg-muted animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          {[1, 2, 3].map((cardIndex) => (
            <div
              key={cardIndex}
              className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs"
            >
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = () => {
  return (
    <div className="flex flex-col w-full space-y-6 pr-2 pb-4">
      {[1, 2, 3].map((groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {/* Group Header Skeleton */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-5 w-28 rounded bg-muted animate-pulse" />
          </div>

          <div className="border border-border rounded-xl bg-card overflow-hidden">
            {/* Header Row */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-muted/40">
              <div className="h-4 w-24 bg-muted rounded animate-pulse flex-1" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse w-28 shrink-0" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse w-24 shrink-0" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse w-28 shrink-0" />
            </div>

            {/* List Rows */}
            {[1, 2, 3].map((rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-4 px-4 py-3 border-b border-border/50"
              >
                <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
                <div className="h-6 w-6 rounded-full bg-muted animate-pulse w-24 shrink-0" />
                <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProjectsTableSkeleton = () => {
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-2xs">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/40">
        <div className="h-4 bg-muted rounded animate-pulse flex-1" />
        <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
        <div className="h-4 bg-muted rounded animate-pulse w-24 shrink-0" />
        <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
        <div className="h-4 bg-muted rounded animate-pulse w-12 shrink-0" />
      </div>

      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-4 bg-muted rounded animate-pulse flex-1" />
            <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
            <div className="h-6 w-6 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 bg-muted rounded animate-pulse w-28 shrink-0" />
            <div className="h-4 bg-muted rounded animate-pulse w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
