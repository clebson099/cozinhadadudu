import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, Link2, ClipboardList } from "lucide-react";
import Logo from "@/components/Logo";

const nav = [
  { to: "/", label: "Início", icon: LayoutDashboard, end: true },
  { to: "/pratos", label: "Pratos", icon: UtensilsCrossed },
  { to: "/links", label: "Links", icon: Link2 },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-64 shrink-0 bg-white border-r border-cream-dark/60 p-5">
        <button onClick={() => navigate("/")} className="text-left mb-8">
          <Logo />
        </button>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition ${
                  isActive ? "bg-sage/20 text-sage-dark" : "text-graphite-light hover:bg-cream-dark/50"
                }`}>
              <n.icon size={20} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto text-xs text-graphite-light/50 pt-6">
          v1.0 • dados locais
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-cream-dark/50 px-4 py-3">
        <Logo size={34} />
      </header>

      <main className="flex-1 px-4 sm:px-8 py-6 pb-28 sm:pb-10 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-cream-dark/60 px-2 py-2 flex justify-around">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[11px] font-semibold transition ${
                isActive ? "text-sage-dark" : "text-graphite-light/70"
              }`}>
            {({ isActive }) => (
              <>
                <span className={`p-1.5 rounded-xl ${isActive ? "bg-sage/20" : ""}`}><n.icon size={20} /></span>
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
