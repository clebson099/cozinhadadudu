import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Logo size={64} withText={false} />
      <h1 className="font-display text-3xl text-graphite mt-6">Página não encontrada</h1>
      <p className="text-graphite-light/80 mt-2">O endereço que você acessou não existe.</p>
      <Link to="/" className="btn-primary mt-6">Voltar ao início</Link>
    </div>
  );
}
