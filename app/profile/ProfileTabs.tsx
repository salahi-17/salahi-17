// app/profile/ProfileTabs.tsx
"use client";

import { useState } from "react";
import SavedItineraries from "./SavedItineraries";
import PendingOrders from "@/components/PendingOrders";
import MyOrders from "@/components/MyOrders";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      active ? "text-primary border-b-2 border-primary" : "text-gray-600"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export interface Itinerary {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface ProfileTabsProps {
  initialItineraries: Itinerary[];
}

export default function ProfileTabs({ initialItineraries }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"saved" | "pending" | "orders">("saved");

  return (
    <div>
      <div className="mb-4">
        <TabButton active={activeTab === "saved"} onClick={() => setActiveTab("saved")}>
          Saved Itineraries
        </TabButton>
        <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
          Pending Orders
        </TabButton>
        <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
          My Orders
        </TabButton>
      </div>

      {activeTab === "saved" && <SavedItineraries initialItineraries={initialItineraries} />}
      {activeTab === "pending" && <PendingOrders />}
      {activeTab === "orders" && <MyOrders />}
    </div>
  );
}