import type { Dish, MenuLink, Order, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  name: "Dudu",
  email: "contato@cozinhadadudu.com",
  phone: "(11) 99999-0000",
  logoUrl: "/logo.svg",
  createdAt: "2026-01-10T10:00:00Z",
};

export const mockDishes: Dish[] = [
  {
    id: "d1",
    name: "Feijoada Completa",
    photoUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    intro: "Prato tradicional brasileiro preparado com ingredientes selecionados.",
    description: "Acompanha arroz branco, couve, farofa e laranja.",
    baseServings: 10,
    active: true,
    createdAt: "2026-02-01T10:00:00Z",
    ingredients: [
      { ingredientId: "i1", name: "Feijão Preto", quantity: 2, unit: "kg" },
      { ingredientId: "i2", name: "Carne Seca", quantity: 1, unit: "kg" },
      { ingredientId: "i3", name: "Linguiça", quantity: 0.5, unit: "kg" },
      { ingredientId: "i4", name: "Arroz", quantity: 1, unit: "kg" },
      { ingredientId: "i5", name: "Cebola", quantity: 0.5, unit: "kg" },
      { ingredientId: "i6", name: "Couve", quantity: 0.4, unit: "kg" },
    ],
  },
  {
    id: "d2",
    name: "Strogonoff de Frango",
    photoUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80",
    intro: "Cremoso, no ponto certo, do jeito que todo mundo gosta.",
    description: "Servido com arroz branco soltinho e batata palha crocante.",
    baseServings: 10,
    active: true,
    createdAt: "2026-02-02T10:00:00Z",
    ingredients: [
      { ingredientId: "i7", name: "Peito de Frango", quantity: 2, unit: "kg" },
      { ingredientId: "i8", name: "Creme de Leite", quantity: 0.8, unit: "l" },
      { ingredientId: "i9", name: "Champignon", quantity: 0.3, unit: "kg" },
      { ingredientId: "i5", name: "Cebola", quantity: 0.3, unit: "kg" },
      { ingredientId: "i4", name: "Arroz", quantity: 1, unit: "kg" },
      { ingredientId: "i10", name: "Batata Palha", quantity: 0.4, unit: "kg" },
    ],
  },
  {
    id: "d3",
    name: "Lasanha à Bolonhesa",
    photoUrl: "https://images.unsplash.com/photo-1619895092538-128341789043?w=800&q=80",
    intro: "Camadas generosas de massa, molho e muito queijo.",
    description: "Massa fresca, molho bolonhesa artesanal e queijo gratinado.",
    baseServings: 8,
    active: true,
    createdAt: "2026-02-03T10:00:00Z",
    ingredients: [
      { ingredientId: "i11", name: "Massa de Lasanha", quantity: 1, unit: "kg" },
      { ingredientId: "i12", name: "Carne Moída", quantity: 1.5, unit: "kg" },
      { ingredientId: "i13", name: "Molho de Tomate", quantity: 1, unit: "l" },
      { ingredientId: "i14", name: "Queijo Mussarela", quantity: 1, unit: "kg" },
      { ingredientId: "i5", name: "Cebola", quantity: 0.3, unit: "kg" },
    ],
  },
];

export const mockMenuLinks: MenuLink[] = [
  {
    id: "ml1",
    slug: "abc123",
    title: "Cardápio de Festas",
    welcomeMessage: "Seja bem-vindo(a)! Escolha seus pratos favoritos e a quantidade de pessoas.",
    dishIds: ["d1", "d2", "d3"],
    validityDays: 30,
    createdAt: "2026-05-20T10:00:00Z",
    expiresAt: "2026-06-19T10:00:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    menuLinkId: "ml1",
    customerName: "Maria Oliveira",
    customerPhone: "(11) 98888-1234",
    notes: "Entregar até as 11h.",
    laborCost: 350,
    status: "FINALIZADO",
    createdAt: "2026-05-25T14:00:00Z",
    dishes: [
      { dishId: "d1", dishName: "Feijoada Completa", servings: 50 },
      { dishId: "d2", dishName: "Strogonoff de Frango", servings: 30 },
    ],
    shoppingList: [
      { id: "s1", name: "Feijão Preto", quantity: 10, unit: "kg" },
      { id: "s2", name: "Carne Seca", quantity: 5, unit: "kg" },
      { id: "s3", name: "Cebola", quantity: 3.4, unit: "kg" },
      { id: "s4", name: "Arroz", quantity: 8, unit: "kg" },
    ],
  },
];
