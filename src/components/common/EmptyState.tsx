interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}

export default function EmptyState({ title, message, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4" role="img" aria-hidden="true">{icon}</span>
      <h3 className="text-lg text-ink mb-2">{title}</h3>
      <p className="text-ink-soft max-w-sm">{message}</p>
    </div>
  );
}
