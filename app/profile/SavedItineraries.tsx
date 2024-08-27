// app/profile/SavedItineraries.tsx
import React from 'react';
import { Itinerary } from './ProfileTabs';
import CommonCard from '@/components/CommonCard';

interface SavedItinerariesProps {
  initialItineraries: Itinerary[];
}

const SavedItineraries: React.FC<SavedItinerariesProps> = ({ initialItineraries }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Saved Itineraries</h2>
      {initialItineraries.length === 0 ? (
        <p>You have no saved itineraries.</p>
      ) : (
        <ul className="space-y-4">
          {initialItineraries.map((itinerary) => (
            <li key={itinerary.id}>
              <CommonCard
                title={itinerary.name}
                details={[
                  { label: "Start Date", value: new Date(itinerary.startDate).toLocaleDateString() },
                  { label: "End Date", value: new Date(itinerary.endDate).toLocaleDateString() }
                ]}
                actionLabel="View Itinerary"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedItineraries;