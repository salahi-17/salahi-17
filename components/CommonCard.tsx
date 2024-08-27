// components/CommonCard.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CommonCardProps {
  title: string;
  subtitle?: string;
  details: { label: string; value: string }[];
  status?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

const CommonCard: React.FC<CommonCardProps> = ({ 
  title, 
  subtitle, 
  details, 
  status, 
  onActionClick, 
  actionLabel 
}) => {
  return (
    <div className="border p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {status && (
          <Badge className={`${status.toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
            {status}
          </Badge>
        )}
      </div>
      {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}
      {details.map((detail, index) => (
        <p key={index} className="text-sm">
          <span className="font-medium">{detail.label}:</span> {detail.value}
        </p>
      ))}
      {onActionClick && actionLabel && (
        <div className="mt-4">
          <Button onClick={onActionClick}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default CommonCard;