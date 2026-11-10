import React from 'react'

interface Tab {
  key: string
  label: string
}

interface TabbedPanelProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
}

export const TabbedPanel: React.FC<TabbedPanelProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${activeTab === tab.key ? 'tab--active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
