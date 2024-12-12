import React from 'react';
import { Card, CardContent } from "./ui/card";

const CardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="w-full max-w-sm mx-auto bg-indigo-700 animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-indigo-600 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-indigo-600 rounded w-1/2 mb-4"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-indigo-600 rounded w-1/4"></div>
              <div className="h-4 bg-indigo-600 rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardSkeleton;