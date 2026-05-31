import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Dishes from "./pages/Dishes";
import DishForm from "./pages/DishForm";
import Links from "./pages/Links";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import PublicMenu from "./pages/PublicMenu";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public sharable menu */}
      <Route path="/cardapio/:slug" element={<PublicMenu />} />

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pratos" element={<Dishes />} />
        <Route path="/pratos/novo" element={<DishForm />} />
        <Route path="/pratos/:id/editar" element={<DishForm />} />
        <Route path="/links" element={<Links />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/pedidos/:id" element={<OrderDetail />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
