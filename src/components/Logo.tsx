export default function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="Cozinha da Dudu" width={size} height={size} className="rounded-full shadow-soft" />
      {withText && (
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold text-graphite">Cozinha da Dudu</p>
          <p className="text-[11px] text-graphite-light/70 -mt-0.5">feito com carinho</p>
        </div>
      )}
    </div>
  );
}
