import { jsPDF } from "jspdf";
import type { Order } from "@/types";
import { mockUser } from "@/mock/data";
import { formatCurrency, formatDate, formatQty } from "./format";
import { totalServings } from "./calculations";

const SAGE = "#A8B8A0";
const GRAPHITE = "#2F3A3A";

export function generateOrderPdf(order: Order) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  let y = 50;

  // Header band
  doc.setFillColor(SAGE);
  doc.roundedRect(M, y - 30, W - M * 2, 70, 10, 10, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Cozinha da Dudu", M + 20, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(mockUser.phone ?? "", M + 20, y + 24);
  y += 70;

  doc.setTextColor(GRAPHITE);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Pedido", M, y); y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const info = [
    `Cliente: ${order.customerName}`,
    `Telefone: ${order.customerPhone}`,
    `Data: ${formatDate(order.createdAt)}`,
    `Total de pessoas: ${totalServings(order.dishes)}`,
  ];
  info.forEach((t) => { doc.text(t, M, y); y += 16; });
  if (order.notes) { y += 2; doc.text(`Observações: ${order.notes}`, M, y); y += 16; }
  y += 8;

  // Dishes
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("Pratos escolhidos", M, y); y += 18;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  order.dishes.forEach((d) => {
    doc.text(`• ${d.dishName} — ${d.servings} pessoas`, M + 6, y); y += 15;
  });
  y += 10;

  // Shopping list
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("Lista de compras", M, y); y += 8;
  doc.setDrawColor(SAGE); doc.line(M, y, W - M, y); y += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  order.shoppingList.forEach((it) => {
    if (y > 760) { doc.addPage(); y = 50; }
    doc.text(it.name, M + 6, y);
    doc.text(formatQty(it.quantity, it.unit), W - M - 6, y, { align: "right" });
    y += 15;
  });
  y += 16;

  // Totals
  doc.setDrawColor(SAGE); doc.line(M, y, W - M, y); y += 20;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  doc.text("Mão de obra:", M, y);
  doc.text(formatCurrency(order.laborCost), W - M - 6, y, { align: "right" }); y += 20;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("Valor total:", M, y);
  doc.text(formatCurrency(order.laborCost), W - M - 6, y, { align: "right" });

  doc.save(`pedido-${order.customerName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
