// The recipe catalogue: 10 chef ranks, 6 base recipes each, and variation
// trees hanging off some of them. Pure data, no React Native imports, so the
// game rules can be unit-tested in Node.

export type PhotoKey =
  | 'eggs' | 'grilledcheese' | 'quesadilla' | 'ramen' | 'penne' | 'pancakes'
  | 'friedrice' | 'wrap' | 'tacos' | 'bowl' | 'meatballs' | 'shrimp'
  | 'ramen-egg' | 'ramen-budae' | 'ramen-cheese' | 'ramen-brisket' | 'ramen-tonkotsu'
  | 'noodles-fried' | 'bibimbap' | 'burger' | 'katsu' | 'porkchop' | 'salmon' | 'grainbowl';

export type Recipe = {
  id: string;
  name: string;
  /** Chef rank index, 0 (High school chump) to 9 (Grandmaster chef). */
  rank: number;
  /** 1 to 5. Multiplies every cook in the mastery points. */
  difficulty: number;
  /** Set on variations: the recipe whose tier opens this one. */
  parentId?: string;
  time: string;
  ingredients: string[];
  steps: string[];
  cover?: PhotoKey;
};

export const RANKS = [
  'High school chump',
  'College dormer',
  'Meal prepper',
  'Hobbyist',
  'Date night',
  'Junior chef',
  'Real chef',
  'Expert chef',
  'Master chef',
  'Grandmaster chef',
] as const;

type Spec = [id: string, name: string, difficulty: number, time: string, ingredients: string, steps: string, cover?: PhotoKey];

// Ingredients are separated by ";", steps by "|".
const BASE: Spec[][] = [
  [
    ['eggs-toast', 'Eggs on toast', 1, '8 min', '2 eggs; 1 slice bread; 1 tbsp butter; salt; pepper; chili flakes', 'Toast the bread.|Melt the butter in a pan over medium-low heat.|Crack in the eggs and cook until the whites set, about 3 minutes.|Slide onto the toast, season, finish with chili flakes.', 'eggs'],
    ['instant-ramen', 'Instant ramen, upgraded', 1, '12 min', '1 pack instant ramen; 1 egg; 1 scallion; 1 tsp soy sauce; 1 tsp chili crisp; handful of spinach', 'Boil 500 ml water and add the seasoning packet.|Add the noodles and cook 2 minutes.|Crack in the egg and add the spinach; cook 1 more minute.|Top with sliced scallion, soy sauce and chili crisp.', 'ramen'],
    ['grilled-cheese', 'Grilled cheese', 1, '10 min', '2 slices bread; 2 slices cheddar; 1 tbsp butter', 'Butter the outside of both slices.|Put the cheese between them, butter facing out.|Cook in a pan over medium-low heat, 3 to 4 minutes a side, until golden and melted.', 'grilledcheese'],
    ['quesadilla', 'Quesadilla', 1, '10 min', '2 flour tortillas; 1 cup shredded cheese; 1/2 cup black beans; salsa; sour cream', 'Scatter cheese and beans over one tortilla and top with the other.|Cook in a dry pan over medium heat, 2 to 3 minutes a side.|Cut into wedges and serve with salsa and sour cream.', 'quesadilla'],
    ['tomato-penne', 'Tomato penne', 1, '20 min', '200 g penne; 1 can crushed tomatoes; 2 garlic cloves; 2 tbsp olive oil; parmesan; basil', 'Cook the penne in salted water.|Fry sliced garlic in olive oil for 1 minute, add the tomatoes and simmer 10 minutes.|Toss the pasta with the sauce and a splash of pasta water.|Finish with parmesan and basil.', 'penne'],
    ['pancakes', 'Pancakes', 1, '20 min', '1 cup flour; 1 tbsp sugar; 2 tsp baking powder; 1 cup milk; 1 egg; 2 tbsp melted butter', 'Whisk the dry ingredients, then the wet ones, then combine. Lumps are fine.|Heat a buttered pan over medium heat.|Pour 1/4 cup batter per pancake; flip when bubbles form.|Cook 1 more minute and stack.', 'pancakes'],
  ],
  [
    ['egg-fried-rice', 'Egg fried rice', 2, '15 min', '2 cups day-old rice; 2 eggs; 1/2 cup frozen peas and carrots; 2 scallions; 1 tbsp soy sauce; 1 tsp sesame oil', 'Scramble the eggs in a hot oiled pan and set aside.|Stir-fry the vegetables 2 minutes, add the rice and press it flat to crisp.|Add soy sauce, the eggs and scallions; toss.|Finish with sesame oil.', 'friedrice'],
    ['chicken-wraps', 'Chicken wraps', 2, '20 min', '2 chicken thighs; 2 tortillas; lettuce; 1 tomato; yogurt; paprika; garlic powder', 'Season the chicken with paprika, garlic powder and salt.|Pan-fry 5 to 6 minutes a side and slice.|Fill the tortillas with lettuce, tomato, chicken and yogurt.|Roll tight and toast seam-side down.', 'wrap'],
    ['sheet-pan-tacos', 'Sheet-pan tacos', 2, '25 min', '300 g ground beef; taco seasoning; 6 small tortillas; cheese; salsa; cilantro', 'Brown the beef with the seasoning.|Fill the tortillas, fold them and lay them on a tray.|Top with cheese and bake at 220 °C for 8 minutes.|Serve with salsa and cilantro.', 'tacos'],
    ['burrito-bowl', 'Burrito bowl', 2, '25 min', '1 cup rice; 1 can black beans; 1 chicken breast; corn; salsa; lime; avocado', 'Cook the rice and stir in lime juice.|Season and pan-fry the chicken; slice.|Warm the beans and corn.|Build bowls: rice, beans, corn, chicken, salsa, avocado.', 'bowl'],
    ['baked-meatballs', 'Baked meatballs', 2, '35 min', '500 g ground beef; 1 egg; 1/2 cup breadcrumbs; parmesan; 2 garlic cloves; jar of marinara', 'Mix everything but the marinara and roll into 16 balls.|Bake at 200 °C for 15 minutes.|Simmer in marinara for 10 minutes.', 'meatballs'],
    ['garlic-shrimp-pasta', 'Garlic shrimp pasta', 2, '20 min', '200 g spaghetti; 250 g shrimp; 4 garlic cloves; butter; lemon; parsley; chili flakes', 'Cook the spaghetti.|Sear the shrimp in butter, 1 minute a side, and remove.|Soften the garlic and chili in the same pan, add lemon juice and pasta water.|Toss in the pasta and shrimp; finish with parsley.', 'shrimp'],
  ],
  [
    ['chicken-rice-bowls', 'Chicken and rice bowls', 2, '40 min', '4 chicken thighs; 2 cups rice; broccoli; teriyaki sauce; sesame seeds', 'Cook a big batch of rice.|Roast the chicken and broccoli at 220 °C for 25 minutes.|Glaze the chicken with teriyaki.|Portion into 4 containers.', 'grainbowl'],
    ['turkey-chili', 'Turkey chili', 2, '50 min', '500 g ground turkey; 2 cans beans; 1 can tomatoes; 1 onion; chili powder; cumin', 'Brown the turkey with the onion.|Add spices, tomatoes and beans.|Simmer 30 minutes.|Cool and portion.'],
    ['overnight-oats', 'Overnight oats', 1, '5 min', '1/2 cup oats; 1/2 cup milk; 1/4 cup yogurt; 1 tbsp chia; honey; berries', 'Stir everything but the berries in a jar.|Refrigerate overnight.|Top with berries in the morning.'],
    ['sheet-pan-chicken', 'Sheet-pan chicken and veg', 2, '45 min', '4 chicken thighs; 2 potatoes; 1 red onion; 2 peppers; olive oil; oregano', 'Cut the vegetables into chunks and toss with oil and oregano.|Nestle in the chicken and season.|Roast at 220 °C for 35 minutes.'],
    ['beef-broccoli', 'Beef and broccoli', 3, '25 min', '400 g flank steak; 1 head broccoli; soy sauce; oyster sauce; garlic; ginger; cornstarch', 'Slice the beef thin and toss with cornstarch.|Sear in batches over high heat.|Stir-fry the broccoli with garlic and ginger.|Add the sauces and the beef; toss until glossy.'],
    ['lentil-soup', 'Lentil soup', 2, '45 min', '1 cup red lentils; 1 onion; 2 carrots; 1 can tomatoes; cumin; stock', 'Soften the onion and carrots.|Add cumin, lentils, tomatoes and 1 l stock.|Simmer 25 minutes and blend half.'],
  ],
  [
    ['smash-burgers', 'Smash burgers', 3, '20 min', '400 g ground beef; 4 buns; 4 slices American cheese; onion; pickles; burger sauce', 'Roll the beef into 8 balls.|Smash onto a very hot pan and season.|Flip after 2 minutes, add cheese, stack two patties.|Build on toasted buns.', 'burger'],
    ['chicken-katsu', 'Chicken katsu', 3, '30 min', '2 chicken breasts; flour; 1 egg; panko; oil; katsu sauce; cabbage', 'Butterfly and pound the chicken.|Flour, egg, panko.|Shallow-fry 4 minutes a side.|Slice and serve with shredded cabbage and sauce.', 'katsu'],
    ['bibimbap', 'Bibimbap', 3, '40 min', 'rice; spinach; carrots; bean sprouts; beef; egg; gochujang; sesame oil', 'Cook the rice.|Blanch or saute each vegetable separately and season.|Fry the beef and the egg.|Arrange over rice and add gochujang.', 'bibimbap'],
    ['homemade-pizza', 'Homemade pizza', 3, '2 h', '500 g flour; 7 g yeast; 325 ml water; tomato sauce; mozzarella; basil', 'Mix the dough and rise 1 hour.|Stretch into two bases.|Top with sauce and mozzarella.|Bake on the hottest setting for 8 to 10 minutes.'],
    ['shakshuka', 'Shakshuka', 2, '30 min', '1 onion; 1 pepper; 2 cans tomatoes; 4 eggs; cumin; paprika; feta', 'Soften the onion and pepper with the spices.|Add the tomatoes and simmer 10 minutes.|Make wells and crack in the eggs.|Cover until the whites set; top with feta.'],
    ['pad-thai', 'Pad thai', 3, '30 min', '200 g rice noodles; shrimp or tofu; 2 eggs; bean sprouts; tamarind; fish sauce; peanuts', 'Soak the noodles.|Stir-fry the protein, push aside, scramble the eggs.|Add noodles and sauce; toss.|Finish with sprouts, peanuts and lime.', 'noodles-fried'],
  ],
  [
    ['pan-seared-salmon', 'Pan-seared salmon', 3, '20 min', '2 salmon fillets; butter; lemon; garlic; thyme', 'Dry and season the salmon.|Sear skin-side down 5 minutes.|Flip and baste with butter, garlic and thyme.|Rest and finish with lemon.', 'salmon'],
    ['steak-pan-sauce', 'Steak with pan sauce', 4, '30 min', '2 ribeye steaks; butter; shallot; red wine; stock; thyme', 'Sear the steaks hard, 3 minutes a side.|Baste with butter and rest.|Soften the shallot, deglaze with wine and stock, reduce.|Mount with cold butter.'],
    ['mushroom-risotto', 'Mushroom risotto', 3, '40 min', 'arborio rice; mushrooms; shallot; white wine; stock; parmesan; butter', 'Brown the mushrooms.|Toast the rice with the shallot, add wine.|Add hot stock a ladle at a time for 18 minutes.|Beat in butter and parmesan.'],
    ['chicken-piccata', 'Chicken piccata', 3, '30 min', 'chicken cutlets; flour; butter; lemon; capers; white wine; parsley', 'Dredge and pan-fry the cutlets.|Deglaze with wine and lemon.|Add capers and mount with butter.|Spoon over the chicken.'],
    ['pork-chops-apples', 'Pork chops with apples', 3, '30 min', '2 thick pork chops; 2 apples; onion; cider; mustard; sage', 'Sear the chops and rest.|Cook apples and onion in the fat.|Deglaze with cider, add mustard and sage.|Return the chops to warm through.', 'porkchop'],
    ['lava-cake', 'Chocolate lava cake', 4, '25 min', '100 g dark chocolate; 100 g butter; 2 eggs; 2 yolks; 50 g sugar; 2 tbsp flour', 'Melt chocolate and butter.|Whisk eggs, yolks and sugar until pale; fold together with flour.|Bake in buttered ramekins at 220 °C for 10 minutes.|Turn out immediately.'],
  ],
  [
    ['roast-chicken', 'Roast chicken', 3, '1 h 30 min', '1 whole chicken; lemon; garlic; thyme; butter; potatoes', 'Dry-brine the chicken overnight.|Stuff with lemon, garlic and thyme; rub with butter.|Roast at 220 °C for about 1 hour 10 minutes over potatoes.|Rest 15 minutes before carving.'],
    ['fresh-pasta', 'Fresh pasta', 4, '1 h', '300 g 00 flour; 3 eggs; semolina; butter; sage', 'Knead the flour and eggs 10 minutes; rest 30.|Roll thin and cut tagliatelle.|Cook 2 minutes and toss in brown butter and sage.'],
    ['pho', 'Pho', 4, '4 h', 'beef bones; brisket; onion; ginger; star anise; cinnamon; rice noodles; herbs', 'Char the onion and ginger.|Simmer bones and brisket with the spices for 3 hours.|Season with fish sauce.|Pour over noodles and thin raw beef; add herbs.'],
    ['green-curry', 'Thai green curry', 3, '35 min', 'green curry paste; coconut milk; chicken; Thai eggplant; basil; fish sauce', 'Fry the paste in thick coconut cream.|Add the chicken and remaining coconut milk.|Simmer with the eggplant 10 minutes.|Season and add basil.'],
    ['gyoza', 'Gyoza', 4, '1 h', 'gyoza wrappers; ground pork; cabbage; garlic; ginger; soy sauce', 'Salt the cabbage and squeeze dry; mix with the pork and aromatics.|Fill and pleat the wrappers.|Fry, steam with a splash of water, then crisp.'],
    ['paella', 'Paella', 4, '1 h', 'bomba rice; chicken thighs; chorizo; saffron; peppers; stock; peas', 'Brown the chicken and chorizo.|Add peppers, rice and saffron stock.|Cook without stirring for 18 minutes.|Let the socarrat form at the end.'],
  ],
  [
    ['beef-bourguignon', 'Beef bourguignon', 4, '3 h 30 min', 'beef chuck; bacon; red wine; mushrooms; pearl onions; stock', 'Brown the beef and bacon.|Braise in wine and stock for 3 hours.|Glaze the onions and brown the mushrooms.|Combine and reduce.'],
    ['tonkotsu-scratch', 'Ramen from scratch', 5, '12 h', 'pork bones; pork belly; tare; aroma oil; fresh noodles; eggs', 'Boil the bones hard for 10 hours.|Roll and braise the belly for chashu.|Marinate soft-boiled eggs.|Assemble tare, broth, noodles and toppings.', 'ramen-tonkotsu'],
    ['duck-breast', 'Duck breast with cherries', 4, '40 min', '2 duck breasts; cherries; port; stock; thyme', 'Score the skin and start in a cold pan.|Render 12 minutes, flip 3 minutes.|Make a cherry and port sauce in the fat.|Rest and slice.'],
    ['birria-tacos', 'Birria tacos', 4, '4 h', 'beef shank; dried chiles; tomatoes; spices; tortillas; cheese', 'Make the chile adobo.|Braise the beef 3 hours.|Dip tortillas in the fat, fill with beef and cheese, crisp.|Serve with the consomme.'],
    ['lasagna', 'Lasagna bolognese', 4, '3 h', 'beef and pork mince; soffritto; tomatoes; milk; pasta sheets; bechamel; parmesan', 'Cook the bolognese slowly for 2 hours.|Make the bechamel.|Layer pasta, ragu, bechamel and parmesan.|Bake 40 minutes and rest.'],
    ['mapo-tofu', 'Mapo tofu', 4, '30 min', 'silken tofu; ground pork; doubanjiang; Sichuan pepper; garlic; stock', 'Blanch the tofu.|Fry the pork until crisp; add doubanjiang.|Add stock and the tofu; simmer.|Thicken and finish with ground Sichuan pepper.'],
  ],
  [
    ['beef-wellington', 'Beef wellington', 5, '3 h', 'beef fillet; mushrooms; prosciutto; puff pastry; mustard; egg', 'Sear the fillet and brush with mustard.|Wrap in duxelles and prosciutto; chill.|Wrap in pastry and egg wash.|Bake to 52 °C inside and rest.'],
    ['cheese-souffle', 'Cheese souffle', 5, '50 min', 'butter; flour; milk; gruyere; 4 eggs; mustard', 'Make a thick bechamel and add cheese and yolks.|Whip the whites to soft peaks and fold in.|Bake in a prepared dish at 200 °C for 25 minutes.|Serve immediately.'],
    ['xiao-long-bao', 'Soup dumplings', 5, '4 h', 'pork skin aspic; ground pork; ginger; flour; vinegar', 'Set the aspic overnight.|Mix the filling with the cubed aspic.|Roll thin wrappers and pleat 18 folds.|Steam 8 minutes.'],
    ['mole-poblano', 'Mole poblano', 5, '5 h', 'dried chiles; chocolate; nuts; seeds; spices; chicken', 'Toast and soak the chiles.|Fry the nuts, seeds and spices.|Blend and fry the paste.|Simmer with stock and chocolate; serve over chicken.'],
    ['sourdough', 'Sourdough loaf', 4, '24 h', 'starter; bread flour; water; salt', 'Autolyse, then mix in starter and salt.|Stretch and fold for 3 hours.|Shape and cold-proof overnight.|Bake in a Dutch oven at 250 °C.'],
    ['coq-au-vin', 'Coq au vin', 4, '3 h', 'chicken legs; red wine; lardons; mushrooms; pearl onions; thyme', 'Marinate the chicken in wine overnight.|Brown and braise 1 hour 30 minutes.|Reduce the sauce.|Garnish with lardons, onions and mushrooms.'],
  ],
  [
    ['peking-duck', 'Peking duck', 5, '2 days', 'whole duck; maltose; five spice; pancakes; hoisin; scallion', 'Separate the skin and scald.|Glaze and air-dry 24 hours.|Roast until lacquered.|Carve and serve with pancakes.'],
    ['macarons', 'Macarons', 5, '3 h', 'almond flour; icing sugar; egg whites; sugar; ganache', 'Make an Italian meringue.|Fold with almond paste to lava consistency.|Pipe, rest and bake.|Fill and mature 24 hours.'],
    ['consomme', 'Beef consomme', 5, '6 h', 'beef stock; lean mince; egg whites; mirepoix; tomato', 'Mix the raft ingredients into cold stock.|Bring up slowly until the raft forms.|Simmer 1 hour without disturbing.|Strain through muslin.'],
    ['lobster-thermidor', 'Lobster thermidor', 5, '1 h 30 min', 'lobsters; shallot; brandy; mustard; cream; gruyere', 'Cook and split the lobsters.|Make the sauce with shallot, brandy, mustard and cream.|Fill the shells and top with cheese.|Grill until golden.'],
    ['pate-en-croute', 'Pate en croute', 5, '2 days', 'pork; veal; foie gras; pastry; aspic; pistachios', 'Make the forcemeat and chill.|Line the mould with pastry.|Fill, cap and bake.|Fill with aspic and set.'],
    ['hand-pulled-noodles', 'Hand-pulled noodles', 5, '2 h', 'bread flour; water; salt; baking soda; chili oil', 'Knead and rest the dough.|Pull and fold until thin strands form.|Boil 1 minute.|Dress with chili oil and vinegar.'],
  ],
  [
    ['croissants', 'Croissants', 5, '3 days', 'flour; butter; milk; yeast; sugar; salt', 'Make the detrempe and the butter block.|Laminate with 3 letter folds.|Shape and proof.|Bake at 190 °C.'],
    ['croquembouche', 'Croquembouche', 5, '6 h', 'choux pastry; pastry cream; caramel', 'Pipe and bake 60 choux.|Fill with pastry cream.|Dip in caramel and build the cone.|Spin sugar around it.'],
    ['omakase-nigiri', 'Nigiri, omakase style', 5, '4 h', 'sushi rice; rice vinegar; fish; wasabi; nikiri', 'Season and cool the rice.|Break down and cure the fish.|Form nigiri by hand.|Brush with nikiri and serve one at a time.'],
    ['mille-feuille', 'Mille-feuille', 5, '2 days', 'puff pastry; pastry cream; fondant; chocolate', 'Bake the pastry pressed flat.|Cut into equal sheets.|Layer with pastry cream.|Glaze and feather.'],
    ['bouillabaisse', 'Bouillabaisse', 5, '4 h', 'rockfish; shellfish; fennel; saffron; orange peel; rouille', 'Make the fish stock.|Build the saffron broth.|Poach the fish in order of firmness.|Serve with rouille and croutons.'],
    ['salt-crust-fish', 'Whole fish in salt crust', 5, '1 h 30 min', 'whole sea bass; coarse salt; egg whites; herbs; lemon', 'Stuff the fish with herbs.|Pack in salt mixed with egg white.|Bake 30 minutes.|Crack the crust at the table and fillet.'],
  ],
];

type VSpec = [id: string, parentId: string, name: string, difficulty: number, time: string, ingredients: string, steps: string, cover?: PhotoKey];

const VARIATIONS: VSpec[] = [
  // Instant ramen tree, three rows deep.
  ['ramen-egg-drop', 'instant-ramen', 'Egg drop and scallion ramen', 1, '12 min', 'instant ramen; 2 eggs; 2 scallions; sesame oil', 'Cook the noodles.|Drizzle beaten egg into the simmering broth.|Finish with scallions and sesame oil.', 'ramen-cheese'],
  ['budae-ramen', 'instant-ramen', 'Budae ramen', 2, '20 min', 'instant ramen; spam; sausages; kimchi; baked beans; American cheese; gochujang', 'Arrange spam, sausages, kimchi and beans in a pot.|Add stock and gochujang; boil.|Add noodles and top with cheese.', 'ramen-budae'],
  ['cheese-ramen', 'instant-ramen', 'Cheese ramen', 1, '12 min', 'instant ramen; 1 slice American cheese; 1 egg; scallion', 'Cook the noodles in less water.|Lay the cheese on top and cover 30 seconds.|Stir and top with egg and scallion.'],
  ['spicy-miso-ramen', 'ramen-egg-drop', 'Spicy miso ramen', 2, '20 min', 'ramen noodles; miso; chili bean paste; ground pork; corn; butter', 'Fry the pork with chili bean paste.|Whisk miso into hot stock.|Add noodles; top with pork, corn and butter.'],
  ['brisket-ramen', 'budae-ramen', 'Brisket ramen with bean sprouts and cilantro', 3, '3 h', 'ramen noodles; beef brisket; bean sprouts; cilantro; soy; star anise', 'Braise the brisket with soy and star anise for 2.5 hours.|Use the braising liquid as broth.|Serve over noodles with sprouts and cilantro.', 'ramen-brisket'],
  ['kimchi-butter-ramen', 'cheese-ramen', 'Kimchi butter ramen', 2, '15 min', 'instant ramen; kimchi; butter; egg; gim', 'Fry the kimchi in butter.|Add water and seasoning, then noodles.|Top with an egg and gim.', 'ramen-egg'],
  ['tonkotsu-style-ramen', 'brisket-ramen', 'Tonkotsu-style ramen', 4, '1 h', 'store-bought pork broth; tahini; garlic; chashu; ajitama; noodles', 'Whisk tahini and garlic into hot broth.|Warm the chashu.|Assemble with noodles and a halved egg.', 'ramen-tonkotsu'],
  // Rank 1
  ['avocado-egg-toast', 'eggs-toast', 'Avocado egg toast', 1, '10 min', 'sourdough; avocado; egg; lemon; chili flakes', 'Mash the avocado with lemon and salt.|Fry the egg.|Stack on toast.'],
  ['eggs-benedict', 'avocado-egg-toast', 'Eggs Benedict', 3, '30 min', 'English muffins; eggs; ham; butter; lemon; yolks', 'Make hollandaise over a water bath.|Poach the eggs.|Build on toasted muffins with ham.'],
  ['kimchi-grilled-cheese', 'grilled-cheese', 'Kimchi grilled cheese', 1, '12 min', 'bread; cheddar; mozzarella; chopped kimchi; butter', 'Squeeze the kimchi dry.|Layer with both cheeses.|Cook low and slow until crisp.'],
  ['patty-melt', 'grilled-cheese', 'Patty melt', 2, '25 min', 'rye bread; beef patty; Swiss cheese; onions; butter', 'Caramelise the onions.|Cook a thin patty.|Grill on rye with Swiss and onions.'],
  ['chicken-quesadilla', 'quesadilla', 'Chicken quesadilla', 2, '20 min', 'tortillas; shredded chicken; peppers; cheese; cumin', 'Saute the peppers with cumin.|Fill with chicken, peppers and cheese.|Crisp both sides.'],
  ['penne-arrabbiata', 'tomato-penne', 'Penne arrabbiata', 1, '20 min', 'penne; tomatoes; garlic; lots of chili; parsley', 'Fry garlic and chili in oil.|Add tomatoes and simmer.|Toss with penne and parsley.'],
  ['vodka-penne', 'tomato-penne', 'Penne alla vodka', 2, '25 min', 'penne; tomato paste; vodka; cream; parmesan; shallot', 'Fry shallot and tomato paste until dark.|Deglaze with vodka, add cream.|Toss with penne and parmesan.'],
  ['blueberry-pancakes', 'pancakes', 'Blueberry pancakes', 1, '20 min', 'pancake batter; blueberries; maple syrup', 'Pour the batter.|Drop blueberries onto each pancake before flipping.|Serve with maple syrup.'],
  // Rank 2
  ['kimchi-fried-rice', 'egg-fried-rice', 'Kimchi fried rice', 2, '15 min', 'day-old rice; kimchi; gochujang; spam; egg; sesame', 'Fry the spam and kimchi.|Add rice and gochujang; press to crisp.|Top with a fried egg.'],
  ['pineapple-fried-rice', 'egg-fried-rice', 'Pineapple fried rice', 2, '20 min', 'rice; pineapple; cashews; curry powder; shrimp; raisins', 'Stir-fry the shrimp.|Add rice, pineapple and curry powder.|Finish with cashews.'],
  ['buffalo-wraps', 'chicken-wraps', 'Buffalo chicken wraps', 2, '25 min', 'chicken; hot sauce; butter; tortillas; ranch; celery', 'Toss the cooked chicken in hot sauce and butter.|Wrap with ranch and celery.|Toast seam-side down.'],
  ['fish-tacos', 'sheet-pan-tacos', 'Fish tacos', 3, '30 min', 'white fish; flour; beer; cabbage; lime crema; tortillas', 'Batter and fry the fish.|Make a slaw and lime crema.|Build the tacos.'],
  ['swedish-meatballs', 'baked-meatballs', 'Swedish meatballs', 3, '45 min', 'beef and pork mince; allspice; cream; stock; lingonberry', 'Roll small meatballs with allspice.|Brown and remove.|Make a cream gravy and simmer them in it.'],
  ['shrimp-scampi', 'garlic-shrimp-pasta', 'Shrimp scampi linguine', 2, '20 min', 'linguine; shrimp; white wine; garlic; butter; lemon', 'Sear the shrimp.|Reduce wine with garlic.|Toss with linguine, butter and lemon.'],
];

const list = (s: string, sep: string) => s.split(sep).map((x) => x.trim()).filter(Boolean);

export const RECIPES: Recipe[] = [
  ...BASE.flatMap((rank, r) =>
    rank.map(([id, name, difficulty, time, ing, steps, cover]): Recipe => ({
      id, name, rank: r, difficulty, time, ingredients: list(ing, ';'), steps: list(steps, '|'), cover,
    })),
  ),
  ...VARIATIONS.map(([id, parentId, name, difficulty, time, ing, steps, cover]): Recipe => ({
    id, parentId, name, rank: -1, difficulty, time, ingredients: list(ing, ';'), steps: list(steps, '|'), cover,
  })),
];

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

// A variation takes the rank of the base recipe at the root of its tree.
for (const r of RECIPES) {
  if (!r.parentId) continue;
  let root = r;
  while (root.parentId) root = RECIPE_BY_ID[root.parentId];
  r.rank = root.rank;
}

export const BASE_IDS_BY_RANK: string[][] = BASE.map((rank) => rank.map(([id]) => id));
