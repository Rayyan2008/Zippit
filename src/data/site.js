const dropDate = new Date();
dropDate.setDate(dropDate.getDate() + 7);
dropDate.setHours(12, 0, 0, 0);

export const site = {
  brand: {
    name: 'Zippit',
    wordmark: 'ZIPPIT',
    tagline: 'Handmade Ethnic Pouches for Every Moment',
    description:
      'Discover unique handmade ethnic pouches and organizers crafted for college students and young professionals. Each piece celebrates traditional Indian craftsmanship with modern functionality.',
    domain: 'zippit.store',
    email: 'hello@zippit.store',
    address: 'Zippit Studio · Jaipur · Rajasthan · India',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    foundedYear: 2024,
    taglineShort: 'Organize with culture',
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
      'Handcrafted pouches and organizers that blend traditional Indian artistry with modern functionality. Perfect for students, professionals, and anyone who values quality craftsmanship.',
    primaryCta: { label: 'Shop Collection', href: '/shop' },
    secondaryCta: { label: 'Our Story', href: '/about' },
    image: {
      src: 'https://images.unsplash.com/photo-1694126741743-85352d7e500a?auto=format&fit=crop&w=1600&q=85',
      alt: 'Zippit handmade ethnic pouches collection',
    },
    secondaryImage: {
      src: 'https://images.unsplash.com/photo-1648031449118-a3d7517d2f72?auto=format&fit=crop&w=1200&q=85',
      alt: 'Traditional block print pouch detail',
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
    eyebrow: 'Featured Product',
    title: ['Traditional', 'Block Print', 'Pouch'],
    body:
      'Hand-stamped by skilled artisans using authentic Rajasthani block printing techniques. Each piece is unique, featuring natural dyes and traditional motifs passed down through generations.',
    bullets: [
      'Authentic Rajasthani block printing',
      'Natural dyes, eco-friendly materials',
      'Hand-stamped by skilled artisans',
      'Free shipping on orders over ₹500',
    ],
    price: '₹1,299',
    cta: { label: 'Add to Cart', href: '/shop' },
    image: {
      src: 'https://images.unsplash.com/photo-1694126741743-85352d7e500a?auto=format&fit=crop&w=1400&q=85',
      alt: 'Traditional block print pouch with ethnic motifs',
    },
    socialProof: '127 sold this month',
  },

  editorial: {
    eyebrow: 'Our Philosophy',
    quote: 'Every stitch tells a story. Every pattern preserves a tradition.',
    attribution: 'The Zippit Promise',
    paragraphs: [
      'We partner with skilled artisans across India to create pouches that honor traditional craftsmanship while serving modern needs. Each piece is handmade with care, ensuring quality and uniqueness.',
      'From college students organizing their stationery to young professionals keeping their essentials tidy, Zippit pouches bring cultural authenticity to everyday organization.',
    ],
  },

  lookbook: {
    eyebrow: 'Our Collection',
    title: 'Handmade for you',
    body: 'Explore our range of handcrafted pouches and organizers. Swipe to discover.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1694126741743-85352d7e500a?auto=format&fit=crop&w=1200&q=85',
        title: 'Ethnic Collection',
        caption: 'Traditional Block Print Pouches',
      },
      {
        src: 'https://images.unsplash.com/photo-1648031449118-a3d7517d2f72?auto=format&fit=crop&w=1200&q=85',
        title: 'Daily Essentials',
        caption: 'Everyday Organizers',
      },
      {
        src: 'https://images.unsplash.com/photo-1617121758076-fe4d2e5158ae?auto=format&fit=crop&w=1200&q=85',
        title: 'Travel Ready',
        caption: 'Weekend Travel Pouches',
      },
      {
        src: 'https://images.unsplash.com/photo-1629772702781-1986a33d7fba?auto=format&fit=crop&w=1200&q=85',
        title: 'Makeup & Beauty',
        caption: 'Cosmetic Organizers',
      },
      {
        src: 'https://images.unsplash.com/photo-1618111415464-62013acf8656?auto=format&fit=crop&w=1200&q=85',
        title: 'For Students',
        caption: 'Stationery Pouches',
      },
      {
        src: 'https://images.unsplash.com/photo-1565845135776-05e8c90a936f?auto=format&fit=crop&w=1200&q=85',
        title: 'Compact & Cute',
        caption: 'Coin Pouches',
      },
    ],
  },

  story: {
    eyebrow: 'About Zippit',
    title: ['Handmade', 'with heart'],
    body:
      'Zippit was founded to bridge the gap between traditional Indian craftsmanship and modern organizational needs. We work directly with artisan communities across Rajasthan, Gujarat, and West Bengal to create pouches that are both beautiful and functional.',
    secondaryBody:
      'Every Zippit pouch is handmade by skilled artisans using techniques passed down through generations. We believe in fair wages, sustainable materials, and preserving cultural heritage through contemporary design.',
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
      q: 'What makes Zippit pouches special?',
      a: 'Each Zippit pouch is handmade by skilled artisans using traditional Indian techniques like block printing, hand weaving, and embroidery. We use natural dyes and sustainable materials, ensuring every piece is unique and eco-friendly.',
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
      q: 'Can I customize my pouch?',
      a: 'Yes! We offer customization options for bulk orders (10+ pieces). Contact us at hello@zippit.store with your requirements, and our team will work with you to create custom designs.',
    },
    {
      q: 'Are the pouches machine washable?',
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
          { label: 'Travel Organizers', href: '/shop?category=Travel' },
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
    email: 'hello@zippit.store',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    hours: 'Monday - Saturday · 10 AM - 6 PM IST',
    address: 'Zippit Studio, Jaipur, Rajasthan, India',
  },
};

export default site;