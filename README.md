# 🌐 Digital Revolution - E-Commerce Platform

A comprehensive e-commerce platform dedicated to bridging the digital divide through technology education and community empowerment. Built with modern web technologies and designed to support STEM education initiatives.

## 🎯 Mission Statement

**Digital Revolution** is a foundation committed to creating pathways from digital exclusion to STEM opportunities. We believe technology should serve democratic values and create opportunities for all communities. Our platform sells products where **50% of profits** go directly to digital equity and STEM education initiatives, ensuring every purchase contributes to closing the digital divide.

### Our Impact Areas:

- **Digital Literacy**: Empowering communities with essential technology skills
- **STEM Education**: Creating opportunities in Science, Technology, Engineering, and Mathematics
- **Community Building**: Fostering inclusive technology ecosystems
- **Democratic Values**: Ensuring technology serves the public good

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- MySQL database
- Stripe account for payments
- Printful account for product fulfillment
- Resend account for email services

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/digital-revolution.git
cd digital-revolution
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Configure your environment variables**

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/digital_revolution"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Printful
DIGITAL_REVOLUTION_API_KEY="your-printful-api-key"

# Resend
RESEND_API_KEY="re_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

6. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
digital-revolution/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (pages)/                 # Main pages
│   │   │   ├── about/               # About page
│   │   │   ├── shop/                # Shop pages
│   │   │   │   ├── product/         # Product detail pages
│   │   │   │   └── cart/            # Shopping cart
│   │   │   ├── donate/              # Donation pages
│   │   │   ├── partners/            # Partnership pages
│   │   │   ├── profile/             # User profile
│   │   │   ├── orders/              # Order history
│   │   │   ├── share/               # Social sharing
│   │   │   └── api/                 # API routes
│   │   │       ├── webhooks/        # Webhook handlers
│   │   │       │   ├── stripe/      # Stripe webhooks
│   │   │       │   └── printful/    # Printful webhooks
│   │   │       └── auth/            # Authentication
│   │   ├── globals.css              # Global styles
│   │   └── layout.tsx               # Root layout
│   ├── components/                  # React components
│   │   ├── ui/                      # Reusable UI components
│   │   ├── forms/                   # Form components
│   │   ├── pages/                   # Page-specific components
│   │   └── layout/                  # Layout components
│   ├── contexts/                    # React contexts
│   │   ├── ShopContext.tsx          # Shopping context
│   │   └── ProductContext.tsx       # Product context
│   ├── lib/                         # Utility libraries
│   │   ├── actions.ts               # Server actions
│   │   ├── prisma.ts                # Database client
│   │   ├── stripe.ts                # Stripe client
│   │   ├── resend.ts                # Email client
│   │   ├── utils.ts                 # Utility functions
│   │   └── rateLimiter.ts           # Rate limiting
│   ├── emails/                      # Email templates
│   │   ├── OrderEmails.ts           # Order notifications
│   │   ├── DonationEmails.ts        # Donation emails
│   │   └── PartnersTicketEmail.tsx  # Partnership emails
│   ├── constants/                   # Static data
│   │   └── index.tsx                # All constants
│   └── hooks/                       # Custom React hooks
│       └── useClickOutside.ts       # Click outside detection
├── prisma/                          # Database schema
│   ├── schema.prisma                # Prisma schema
│   └── generated/                   # Generated Prisma client
├── public/                          # Static assets
│   ├── Assets/                      # Images and logos
│   └── videos/                      # Video files
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **GSAP** - Animation library with SplitText
- **React Email** - Email template system

### Backend

- **Next.js API Routes** - Server-side API
- **Prisma** - Database ORM
- **MySQL** - Database
- **NextAuth.js v5** - Authentication
- **Server Actions** - Form handling

### External Services

- **Stripe** - Payment processing
- **Printful** - Product fulfillment
- **Resend** - Email delivery
- **Google OAuth** - Authentication

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Prisma Studio** - Database management

## 🎨 Key Features

### E-Commerce

- **Product Catalog** - Dynamic product listings with filtering
- **Shopping Cart** - Persistent cart with guest/user support
- **Checkout Process** - Secure Stripe integration
- **Order Management** - Order tracking and history
- **Inventory Management** - Real-time stock checking

### User Experience

- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Modern aesthetic with gradients
- **Animations** - GSAP-powered smooth transitions
- **Accessibility** - WCAG compliant design
- **Performance** - Optimized loading and caching

### Content Management

- **Dynamic Content** - Data-driven page generation
- **Image Carousels** - Interactive product galleries
- **Form Handling** - Contact and partnership forms
- **Email Templates** - Professional email communications

### Business Features

- **Donation System** - One-time and recurring donations
- **Partnership Program** - Organization collaboration
- **Social Sharing** - Community engagement tools
- **Analytics** - User behavior tracking

## 🔧 Configuration

### Database Schema

The application uses Prisma with MySQL. Key models include:

- **User** - User accounts and authentication
- **Product** - Product catalog and variants
- **Cart/CartItem** - Shopping cart functionality
- **Order/OrderItem** - Order management
- **Donation** - Donation tracking
- **Subscription** - Recurring donations
- **PartnerTicket** - Partnership inquiries

### Environment Variables

All sensitive configuration is managed through environment variables. See `.env.example` for required variables.

### Rate Limiting

Built-in rate limiting prevents API abuse and ensures fair usage across all endpoints.

## 📧 Email System

### Templates

- **Order Confirmation** - Purchase confirmations
- **Shipping Notifications** - Order tracking updates
- **Donation Receipts** - Tax-deductible receipts
- **Partnership Responses** - Collaboration confirmations

### Delivery

- **Resend Integration** - Reliable email delivery
- **Template Management** - React-based email templates
- **Responsive Design** - Mobile-friendly emails

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment
- **AWS** - Enterprise deployment

## 🤝 Contributing

We welcome contributions to Digital Revolution! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Printful** - Product fulfillment services
- **Stripe** - Payment processing
- **Vercel** - Hosting and deployment
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Beautiful utility-first CSS

## 📞 Contact

- **Email**: clutchdev.apps@gmail.com
- **Website**: [Digital Revolution](https://your-domain.com)
- **Mission**: Bridging the digital divide through technology education

---

**Made with ❤️ for digital equity**
