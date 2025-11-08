interface LogEntry {
  timestamp: string;
  message: string;
  highlight?: string;
}

interface ActivityLogProps {
  entries: LogEntry[];
}

export const ActivityLog = ({ entries }: ActivityLogProps) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '');
    } catch {
      return timestamp;
    }
  };

  const renderMessage = (message: string, highlight?: string) => {
    if (!highlight) return message;
    
    const parts = message.split(highlight);
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="text-primary font-bold">{highlight}</span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="card-tactical rounded p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
        ACTIVITY LOG
      </h2>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-3 text-sm">
            <div className="accent-border-left pl-3">
              <span className="text-muted-foreground text-xs block mb-1">
                {formatTimestamp(entry.timestamp)}
              </span>
              <p className="text-foreground">
                {renderMessage(entry.message, entry.highlight)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
