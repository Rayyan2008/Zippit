const dropDate = new Date();
dropDate.setDate(dropDate.getDate() + 7);
dropDate.setHours(12, 0, 0, 0);

export const site = {
  brand: {
    name: 'Bloom',
    wordmark: 'BLOOM',
    tagline: 'Handmade Accessories for Every Moment',
    description:
      'Discover unique handmade accessories—scrunchies, handbags, pouches, and organizers—crafted for students and young professionals. Each piece celebrates traditional Indian craftsmanship with modern functionality.',
    domain: 'bloom.store',
    email: 'hello@bloom.store',
    address: 'Bloom Studio · New Delhi · Delhi · India',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    foundedYear: 2026,
    taglineShort: 'Handmade, beautifully organized',
  },

  drop: {
    title: 'New Collection',
    subtitle: 'Launching in',
    date: dropDate.toISOString(),
    finishedLabel: 'Shop now',
  },

  announcement: {
    items: [
      'Free shipping on orders over ₹500',
      'New collection launching soon',
      'Handmade with love · Ethically sourced · Built to last',
      '7-day easy returns · Secure payments',
    ],
    cta: { label: 'Shop Now', href: '/shop' },
  },

  nav: {
    primary: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    utility: [
      { label: 'Search', href: '#', shortcut: '⌘K' },
      { label: 'Track Order', href: '#' },
      { label: 'Wishlist', href: '#' },
    ],
  },

  hero: {
    eyebrow: 'Handmade · Ethnic · Authentic',
    stack: ['Organize', 'Your', 'Life'],
    bigWord: 'Life',
    body:
      'Handcrafted scrunchies, pouches, handbags, and organizers that blend traditional Indian artistry with modern functionality. Perfect for students, professionals, and anyone who values quality craftsmanship.',
    primaryCta: { label: 'Shop Collection', href: '/shop' },
    secondaryCta: { label: 'Our Story', href: '/about' },
    image: {
      src: 'https://images.unsplash.com/photo-1694126741743-85352d7e500a?auto=format&fit=crop&w=1600&q=85',
      alt: 'Bloom handmade accessories collection',
    },
    secondaryImage: {
      src: 'https://images.unsplash.com/photo-1648031449118-a3d7517d2f72?auto=format&fit=crop&w=1200&q=85',
      alt: 'Handmade Scrunchie detail',
    },
  },

  marquee: {
    primary: [
      'Handmade',
      'Ethnic',
      'Sustainable',
      'Authentic',
      'Affordable',
      'Quality',
      'Traditional',
      'Modern',
    ],
    secondary: [
      'Daily Pouches',
      'Stationery',
      'Makeup',
      'Travel',
      'Coin Pouches',
      'Ethnic',
      'Organizers',
      'Accessories',
    ],
    tertiary: [
      'Jaipur · Delhi · Mumbai · Bangalore · Kolkata · Chennai · Hyderabad · Pune',
    ],
  },

  press: [
    { name: 'The Hindu' },
    { name: 'Times of India' },
    { name: 'Vogue India' },
    { name: 'Elle India' },
    { name: 'Femina' },
    { name: 'Cosmopolitan' },
    { name: 'Grazia' },
    { name: 'Harper\'s Bazaar' },
  ],

  spotlight: {
  eyebrow: 'Best Seller',
  title: ['Bloom', 'Signature', 'Scrunchie'],
  body:
    'Designed for comfort, style, and everyday wear. Our signature scrunchies are crafted from soft premium fabrics that hold your hair securely without pulling or damage.',
  bullets: [
    'Gentle on all hair types',
    'Soft premium fabric',
    'Comfortable all-day hold',
    'Free shipping on orders over ₹500',
  ],
  price: '₹299',
  cta: { label: 'Shop Now', href: '/shop' },
  image: {
    src: 'public/scrunchie.jpg',
    alt: 'Bloom signature scrunchie',
  },
    socialProof: '127 sold this month',
  },



  editorial: {
    eyebrow: 'Our Philosophy',
    quote: 'Every stitch tells a story. Every pattern preserves a tradition.',
    attribution: 'The Bloom Promise',
    paragraphs: [
      'We partner with skilled artisans across India to create accessories that honor traditional craftsmanship while serving modern needs. Each piece is handmade with care, ensuring quality and uniqueness.',
      'From students organizing their everyday essentials to young professionals keeping their items tidy, Bloom accessories bring cultural authenticity to daily organization.',
    ],
  },

  lookbook: {
  eyebrow: 'Our Collection',
  title: 'Made to Bloom',
  body: 'Explore our collection of stylish accessories designed for everyday use. Swipe to discover.',
  images: [
    {
      src: 'public/Scrunchie.jpg',
      title: 'Scrunchie Collection',
      caption: 'Comfort Meets Style',
    },
    {
      src: 'https://images.unsplash.com/photo-1648031449118-a3d7517d2f72?auto=format&fit=crop&w=1200&q=85',
      title: 'Daily Essentials',
      caption: 'Accessories for Everyday Use',
    },
    {
      src: 'https://images.unsplash.com/photo-1617121758076-fe4d2e5158ae?auto=format&fit=crop&w=1200&q=85',
      title: 'Hair Accessories',
      caption: 'Stylish Looks for Every Occasion',
    },
    {
      src: 'https://images.unsplash.com/photo-1629772702781-1986a33d7fba?auto=format&fit=crop&w=1200&q=85',
      title: 'Beauty Collection',
      caption: 'Fashion & Lifestyle Essentials',
    },
    {
      src: '/Vision.jpg',
      title: 'Student Favorites',
      caption: 'Practical Everyday Accessories',
    },
    {
      src: '/display.jpg',
      title: 'Bloom Favorites',
      caption: 'Customer Best Sellers',
    },
  ],
},

  story: {
    eyebrow: 'About Bloom',
    title: ['Handmade', 'with heart'],
    body:
      'Bloom was founded to bridge the gap between traditional Indian craftsmanship and modern organizational needs. We work directly with artisan communities across Rajasthan, Gujarat, and West Bengal to create pouches that are both beautiful and functional.',
    secondaryBody:
      'Every Bloom pouch is handmade by skilled artisans using techniques passed down through generations. We believe in fair wages, sustainable materials, and preserving cultural heritage through contemporary design.',
    cta: { label: 'Read Our Story', href: '/about' },
    image: {
      src: 'https://images.unsplash.com/photo-1527385352018-3c26dd6c3916?auto=format&fit=crop&w=1400&q=85',
      alt: 'Artisan crafting traditional embroidered pouch',
    },
    stats: [
      { value: 15, suffix: '+', label: 'Artisan partners' },
      { value: 2847, suffix: '', label: 'Happy customers' },
      { value: 100, suffix: '%', label: 'Handmade' },
      { value: 7, suffix: 'day', label: 'Easy returns' },
    ],
  },

  faq: [
    {
    q: 'What makes Bloom handmade accessories special?',
      a: 'Each Bloom piece is handmade by skilled artisans using traditional Indian techniques like block printing, hand weaving, and embroidery. We use natural dyes and sustainable materials, ensuring every piece is unique and eco-friendly.',
    },
    {
      q: 'How long does shipping take?',
      a: 'We ship within 1-2 business days. Delivery typically takes 5-7 business days across India. You will receive tracking information via email once your order ships.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day return window from the date of delivery. Items must be unused with original tags attached. Simply contact us to initiate a return, and we will provide a prepaid return label.',
    },
    {
      q: 'Can I customize my Handbags?',
      a: 'Yes! We offer customization options for bulk orders (10+ pieces). Contact us at thebloomstore.in@gmail.com with your requirements, and our team will work with you to create custom designs.',
    },
    {
      q: 'Are the Scrunchies machine washable?',
      a: 'We recommend hand washing with cold water and mild detergent to preserve the colors and fabric quality. Avoid wringing or twisting. Air dry in shade to maintain the integrity of natural dyes.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Currently, we ship only within India. International shipping will be available soon. Subscribe to our newsletter to be notified when we expand our shipping regions.',
    },
  ],

  newsletter: {
    eyebrow: 'Stay Connected',
    title: ['Get', 'Updates'],
    body:
      'New collections, exclusive offers, and stories from our artisan partners. Join our community.',
    placeholder: 'your@email.com',
    cta: 'Subscribe',
    finePrint:
      'By subscribing you agree to our Privacy Policy. Unsubscribe anytime.',
  },

  footer: {
    columns: [
      {
        title: 'Shop',
        links: [
          { label: 'All Products', href: '/shop' },
          { label: 'Daily Essentials', href: '/shop?category=Daily+Essentials' },
          { label: 'Stationery', href: '/shop?category=Stationery' },
          { label: 'Makeup Pouches', href: '/shop?category=Makeup' },
          { label: 'Handbags', href: '/shop?category=Handbags' },
          { label: 'Ethnic Collection', href: '/shop?category=Ethnic' },
        ],
      },
      {
        title: 'About',
        links: [
          { label: 'Our Story', href: '/about' },
          { label: 'Artisan Partners', href: '/about' },
          { label: 'Sustainability', href: '/about' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Shipping Policy', href: '/shipping' },
          { label: 'Return & Exchange', href: '/returns' },
          { label: 'Track Order', href: '#' },
          { label: 'Size Guide', href: '/faq' },
          { label: 'Care Instructions', href: '/faq' },
        ],
      },
    ],
    socials: [
      { name: 'Instagram', href: '#', short: 'IG' },
      { name: 'Facebook', href: '#', short: 'FB' },
      { name: 'Pinterest', href: '#', short: 'PIN' },
      { name: 'WhatsApp', href: 'https://wa.me/919876543210', short: 'WA' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/privacy' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Return Policy', href: '/returns' },
    ],
  },

  contact: {
    eyebrow: 'Get in Touch',
    title: 'Contact us',
    body:
      'Have questions? We\'re here to help. Reach out via the form below or WhatsApp us directly.',
    email: 'thebloomstore.in@gmail.com',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    hours: 'Monday - Saturday · 9 AM - 7 PM IST',
    address: 'Bloom Studio, New Delhi, Delhi, India',
  },
};

export default site;