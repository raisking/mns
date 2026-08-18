interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-lg text-ink mb-2">{title}</h3>
      <p className="text-ink-soft max-w-sm">{message}</p>
    </div>
  );
}
