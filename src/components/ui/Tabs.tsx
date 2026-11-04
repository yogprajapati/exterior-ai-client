interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  onAdd?: () => void;
  addLabel?: string;
}

export function Tabs({ tabs, activeId, onChange, onAdd, addLabel = "+ Add" }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" className="tab" aria-selected={tab.id === activeId} onClick={() => onChange(tab.id)}>
          {tab.label}
        </button>
      ))}
      {onAdd && (
        <button type="button" className="tab tab--add" onClick={onAdd}>
          {addLabel}
        </button>
      )}
    </div>
  );
}
