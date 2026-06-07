export function Spinner() {
  return (
    <div className="flex items-center gap-3 text-sm text-forest">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-forest/25 border-t-forest" />
      Carregando...
    </div>
  );
}
