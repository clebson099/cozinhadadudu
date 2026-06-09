-- ============================================================
--  SEED opcional — popula o banco com dados de exemplo.
--  Rode DEPOIS do schema.sql, no SQL Editor. Pode pular se quiser começar vazio.
-- ============================================================
do $$
declare
  u_id uuid;
  d1 uuid; d2 uuid; d3 uuid;
  ml uuid;
begin
  insert into public.users (name, email, phone, logo_url)
    values ('Dudu', 'contato@cozinhadadudu.com', '(11) 99999-0000', '/logo.svg')
    on conflict (email) do nothing;
  select id into u_id from public.users where email = 'contato@cozinhadadudu.com';

  insert into public.dishes (user_id, name, photo_url, intro, description, base_servings)
    values (u_id, 'Feijoada Completa',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      'Prato tradicional brasileiro preparado com ingredientes selecionados.',
      'Acompanha arroz branco, couve, farofa e laranja.', 10)
    returning id into d1;
  insert into public.dish_ingredients (dish_id, name, quantity, unit) values
    (d1,'Feijão Preto',2,'kg'),(d1,'Carne Seca',1,'kg'),(d1,'Linguiça',0.5,'kg'),
    (d1,'Arroz',1,'kg'),(d1,'Cebola',0.5,'kg'),(d1,'Couve',0.4,'kg');

  insert into public.dishes (user_id, name, photo_url, intro, description, base_servings)
    values (u_id, 'Strogonoff de Frango',
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80',
      'Cremoso, no ponto certo, do jeito que todo mundo gosta.',
      'Servido com arroz branco soltinho e batata palha crocante.', 10)
    returning id into d2;
  insert into public.dish_ingredients (dish_id, name, quantity, unit) values
    (d2,'Peito de Frango',2,'kg'),(d2,'Creme de Leite',0.8,'l'),(d2,'Champignon',0.3,'kg'),
    (d2,'Cebola',0.3,'kg'),(d2,'Arroz',1,'kg'),(d2,'Batata Palha',0.4,'kg');

  insert into public.dishes (user_id, name, photo_url, intro, description, base_servings)
    values (u_id, 'Lasanha à Bolonhesa',
      'https://images.unsplash.com/photo-1619895092538-128341789043?w=800&q=80',
      'Camadas generosas de massa, molho e muito queijo.',
      'Massa fresca, molho bolonhesa artesanal e queijo gratinado.', 8)
    returning id into d3;
  insert into public.dish_ingredients (dish_id, name, quantity, unit) values
    (d3,'Massa de Lasanha',1,'kg'),(d3,'Carne Moída',1.5,'kg'),(d3,'Molho de Tomate',1,'l'),
    (d3,'Queijo Mussarela',1,'kg'),(d3,'Cebola',0.3,'kg');

  insert into public.menu_links (user_id, slug, title, welcome_message, validity_days, expires_at)
    values (u_id, 'abc123', 'Cardápio de Festas',
      'Seja bem-vindo(a)! Escolha seus pratos favoritos e a quantidade de pessoas.',
      30, now() + interval '30 days')
    returning id into ml;
  insert into public.menu_link_dishes (menu_link_id, dish_id) values (ml,d1),(ml,d2),(ml,d3);
end $$;
