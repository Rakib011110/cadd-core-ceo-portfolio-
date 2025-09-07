import React from "react";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex justify-center mb-12">
    <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${activeTab === tab.id ? "" : "hover:bg-white/60 dark:hover:bg-white/10"} relative rounded-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 transition focus-visible:outline-2`}
          style={{ WebkitTapHighlightColor: "transparent" }}>
          {activeTab === tab.id && (
            <span className="absolute inset-0 z-10 bg-white dark:bg-gray-900 shadow-md" style={{ borderRadius: 9999 }} />
          )}
          <span className="relative z-20 flex items-center">
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default Tabs;
