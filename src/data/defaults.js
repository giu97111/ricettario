export const CATEGORIES = [
  'Torte',
  'Crostate',
  'Biscotti',
  'Paste frolle',
  'Paste sfoglie',
  'Brioche e lievitati',
  'Creme e farciture',
  'Mousse e bavaresi',
  'Cioccolateria',
  'Mignon',
  'Gelati e sorbetti',
  'Confetture e marmellate',
  'Glasse e decorazioni',
  'Altro',
]

export const INGREDIENTS = [
  // Farine
  { name: 'Farina 00', category: 'Farine' },
  { name: 'Farina 0', category: 'Farine' },
  { name: 'Farina Manitoba', category: 'Farine' },
  { name: 'Farina di mandorle', category: 'Farine' },
  { name: 'Farina di nocciole', category: 'Farine' },
  { name: 'Farina di cocco', category: 'Farine' },
  { name: 'Fecola di patate', category: 'Farine' },
  { name: 'Amido di mais', category: 'Farine' },
  { name: 'Cacao amaro in polvere', category: 'Farine' },
  
  // Zuccheri
  { name: 'Zucchero semolato', category: 'Zuccheri' },
  { name: 'Zucchero a velo', category: 'Zuccheri' },
  { name: 'Zucchero di canna', category: 'Zuccheri' },
  { name: 'Zucchero invertito', category: 'Zuccheri' },
  { name: 'Glucosio', category: 'Zuccheri' },
  { name: 'Destrosio', category: 'Zuccheri' },
  { name: 'Miele', category: 'Zuccheri' },
  { name: 'Sciroppo di glucosio', category: 'Zuccheri' },
  
  // Grassi
  { name: 'Burro', category: 'Grassi' },
  { name: 'Burro di cacao', category: 'Grassi' },
  { name: 'Margarina', category: 'Grassi' },
  { name: 'Olio di semi', category: 'Grassi' },
  { name: 'Olio extravergine', category: 'Grassi' },
  { name: 'Strutto', category: 'Grassi' },
  
  // Uova e latticini
  { name: 'Uova intere', category: 'Uova e latticini' },
  { name: 'Tuorli', category: 'Uova e latticini' },
  { name: 'Albumi', category: 'Uova e latticini' },
  { name: 'Latte intero', category: 'Uova e latticini' },
  { name: 'Panna fresca 35%', category: 'Uova e latticini' },
  { name: 'Panna UHT', category: 'Uova e latticini' },
  { name: 'Mascarpone', category: 'Uova e latticini' },
  { name: 'Ricotta', category: 'Uova e latticini' },
  { name: 'Yogurt', category: 'Uova e latticini' },
  { name: 'Latte condensato', category: 'Uova e latticini' },
  
  // Cioccolato
  { name: 'Cioccolato fondente 70%', category: 'Cioccolato' },
  { name: 'Cioccolato fondente 55%', category: 'Cioccolato' },
  { name: 'Cioccolato al latte', category: 'Cioccolato' },
  { name: 'Cioccolato bianco', category: 'Cioccolato' },
  { name: 'Gocce di cioccolato', category: 'Cioccolato' },
  { name: 'Copertura fondente', category: 'Cioccolato' },
  { name: 'Granella di cioccolato', category: 'Cioccolato' },
  
  // Frutta secca
  { name: 'Mandorle intere', category: 'Frutta secca' },
  { name: 'Mandorle a lamelle', category: 'Frutta secca' },
  { name: 'Nocciole intere', category: 'Frutta secca' },
  { name: 'Pasta di nocciole', category: 'Frutta secca' },
  { name: 'Pistacchi', category: 'Frutta secca' },
  { name: 'Pasta di pistacchio', category: 'Frutta secca' },
  { name: 'Noci', category: 'Frutta secca' },
  { name: 'Pinoli', category: 'Frutta secca' },
  { name: 'Cocco rapé', category: 'Frutta secca' },
  { name: 'Uvetta', category: 'Frutta secca' },
  
  // Lieviti e addensanti
  { name: 'Lievito di birra fresco', category: 'Lieviti' },
  { name: 'Lievito di birra secco', category: 'Lieviti' },
  { name: 'Lievito per dolci', category: 'Lieviti' },
  { name: 'Bicarbonato', category: 'Lieviti' },
  { name: 'Gelatina in fogli', category: 'Addensanti' },
  { name: 'Agar agar', category: 'Addensanti' },
  { name: 'Pectina', category: 'Addensanti' },
  
  // Aromi
  { name: 'Vaniglia in bacche', category: 'Aromi' },
  { name: 'Estratto di vaniglia', category: 'Aromi' },
  { name: 'Scorza di limone', category: 'Aromi' },
  { name: 'Scorza di arancia', category: 'Aromi' },
  { name: 'Cannella', category: 'Aromi' },
  { name: 'Rum', category: 'Aromi' },
  { name: 'Liquore Strega', category: 'Aromi' },
  { name: 'Liquore Alchermes', category: 'Aromi' },
  { name: 'Caffè espresso', category: 'Aromi' },
  { name: 'Sale', category: 'Aromi' },
  
  // Frutta
  { name: 'Fragole', category: 'Frutta' },
  { name: 'Lamponi', category: 'Frutta' },
  { name: 'Mirtilli', category: 'Frutta' },
  { name: 'Ciliegie', category: 'Frutta' },
  { name: 'Albicocche', category: 'Frutta' },
  { name: 'Pesche', category: 'Frutta' },
  { name: 'Mele', category: 'Frutta' },
  { name: 'Pere', category: 'Frutta' },
  { name: 'Limoni', category: 'Frutta' },
  { name: 'Arance', category: 'Frutta' },
  { name: 'Banana', category: 'Frutta' },
  
  // Basi pronte
  { name: 'Pan di Spagna', category: 'Basi' },
  { name: 'Pasta frolla', category: 'Basi' },
  { name: 'Pasta sfoglia', category: 'Basi' },
  { name: 'Pasta brisée', category: 'Basi' },
  { name: 'Savoiardi', category: 'Basi' },
]

export const UNITS = ['g', 'kg', 'ml', 'L', 'pz', 'cucchiai', 'cucchiaini', 'q.b.']
