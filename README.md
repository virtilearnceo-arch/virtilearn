# 🌟 VirtiLearn – Learning & Internship Platform

VirtiLearn is a **modern e-learning and internship management platform** built with **Next.js 15+ (App Router)**, **Supabase**, **TailwindCSS**, and **Razorpay**.

It provides:

* 📚 **Course learning & certification**
* 🎓 **Internship enrollment, projects & submissions**
* 📊 **Admin dashboards with analytics**
* 💳 **Secure payments & invoicing**
* 🪪 **Certificate verification system**
* 👩‍🎓 **Personalized student dashboards**

---

## ✨ Features

### 🎯 User Side

* Sign-up, login, forgot/update password
* Explore & purchase **courses/internships**
* Learn via **interactive lessons, quizzes, projects & resources**
* Download & verify **certificates**

### 🛠️ Admin Side

* Manage **courses, internships, projects, resources**
* Monitor **analytics (users, courses, orders)**
* Configure **settings, coupons, categories, FAQs**
* Handle **payments & invoices**

### 💳 Payments & Verification

* Secure **Razorpay checkout**
* Auto-generated **invoices & internship verifications**
* **Certificate verification portal**

### 🌍 Landing & Support

* Marketing landing page (hero, highlights, showcase, FAQ)
* Contact & support pages
* Policies: Refund, Privacy, Terms, Shipping

---

## 🛠️ Tech Stack

* **Framework**: Next.js 13+ (App Router)
* **Database & Auth**: Supabase
* **UI**: TailwindCSS + ShadCN UI
* **Payments**: Razorpay
* **Emails**: Resend + Custom templates
* **Deployment**: Vercel (recommended), Docker

---

## 📂 File Structure

Here’s the **detailed project structure** with explanations:

```bash
├── .gitignore
├── README.md
├── app/                                # Next.js App Router (main app entry)
│   ├── ShippingPolicyPage/             # Static policy page
│   │   └── page.tsx
│   ├── account/                        # User account area
│   │   ├── components/                 # Forms & account features
│   │   │   ├── EditProfileForm.tsx     # Update profile info
│   │   │   ├── UpdatePasswordForm.tsx  # Change password
│   │   │   ├── UserCourses.tsx         # Display enrolled courses
│   │   │   └── UserPayments.tsx        # Payment history
│   │   └── page.tsx                    # Account dashboard
│   ├── admin/                          # Admin dashboard
│   │   ├── dashboard/                  # Core admin analytics & management
│   │   │   ├── analytics/              # Analytics pages
│   │   │   │   ├── course-analytics/page.tsx
│   │   │   │   ├── orders-analytics/page.tsx
│   │   │   │   └── user-analytics/page.tsx
│   │   │   ├── courses/                # Course management
│   │   │   │   ├── [id]/edit/page.tsx  # Edit specific course
│   │   │   │   ├── [id]/quizzes/page.tsx
│   │   │   │   ├── new/                # Course creation
│   │   │   │   │   ├── CourseCreationForm.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx            # List all courses
│   │   │   ├── customization/          # Customization features
│   │   │   │   ├── categories/page.tsx
│   │   │   │   ├── coupon/page.tsx
│   │   │   │   └── faq/page.tsx
│   │   │   ├── enrollments/page.tsx
│   │   │   ├── instructor/page.tsx
│   │   │   ├── internships/            # Internship management
│   │   │   │   ├── [id]/edit/page.tsx
│   │   │   │   ├── [id]/sections/page.tsx
│   │   │   │   ├── new/InternshipCreationForm.tsx
│   │   │   │   ├── projects/[id]/manageprojects/page.tsx
│   │   │   │   ├── projects/[id]/submissions/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── invoices/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── users/page.tsx
│   │   └── layout.tsx                  # Admin layout
│   ├── api/                            # API routes
│   │   ├── courses/[id]/route.ts       # Course CRUD
│   │   ├── internships/[id]/route.ts   # Internship CRUD
│   │   ├── razorpay/                   # Payment endpoints
│   │   │   ├── order/route.ts
│   │   │   ├── verify/route.ts
│   │   │   └── verify-internship/route.ts
│   │   └── send/route.ts               # Email sending
│   ├── auth/                           # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── update-password/page.tsx
│   │   └── error/page.tsx
│   ├── checkout/                       # Checkout flows
│   │   ├── [id]/checkoutClient.tsx
│   │   ├── [id]/page.tsx
│   │   └── internship/[id]/page.tsx
│   ├── courses/                        # Course learning flows
│   │   ├── [id]/learn/components/      # Course learning UI
│   │   │   ├── LessonPlayer.tsx        # Video lesson player
│   │   │   ├── Sidebar.tsx             # Course navigation
│   │   │   ├── Quiz.tsx                # Interactive quizzes
│   │   │   └── ExtraResources.tsx
│   │   └── page.tsx
│   ├── internships/                    # Internship learning flows
│   │   ├── [id]/learn/components/      # Similar to courses
│   │   │   ├── LessonPlayer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Quiz.tsx
│   │   ├── [id]/project/page.tsx       # Project submission
│   │   └── page.tsx
│   ├── student/                        # Student-specific dashboards
│   │   ├── certificates/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── my-journey/page.tsx
│   │   └── layout.tsx
│   ├── privacy-policy/page.tsx
│   ├── refund/page.tsx
│   ├── support/page.tsx
│   ├── terms/page.tsx
│   ├── verify-certificate/page.tsx     # Certificate verification
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing page
│   ├── error.tsx                       # Global error page
│   └── not-found.tsx                   # 404 handler
├── components/                         # Reusable UI components
│   ├── Landing/                        # Landing page UI
│   ├── courses/                        # Course-related UI
│   ├── internship/                     # Internship-related UI
│   ├── magicui/                        # Fancy animated components
│   ├── tutorial/                       # Step-by-step tutorials
│   ├── ui/                             # Shared UI primitives
│   └── ...                             # Auth forms, navbar, etc.
├── hooks/                              # Custom React hooks
├── lib/                                # Utilities & integrations
│   ├── supabase/                       # Supabase setup & helpers
│   ├── getCourseResources.ts
│   ├── resend.ts                       # Email utility
│   └── utils.ts
├── public/                             # Static assets
│   ├── images/                         # App images
│   ├── svg/                            # Social media icons
│   └── fonts/                          # Custom fonts
├── styles/
│   └── globals.css                     # Global Tailwind styles
├── tailwind.config.ts                  # Tailwind configuration
├── next.config.ts                      # Next.js config
├── middleware.ts                       # Middleware (auth checks)
├── service-worker.js                   # PWA service worker
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

---

## ⚡ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/VirtiLearn.git
cd VirtiLearn
```

### 2️⃣ Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RESEND_API_KEY=your_resend_key
```

### 4️⃣ Run Development Server

```bash
pnpm dev
# or
npm run dev
```

App runs at: **[http://localhost:3000](http://localhost:3000)** 🚀

---

## 📦 Deployment

* ✅ **Vercel** (recommended)
* Docker, Netlify, AWS Amplify also supported

---

## 🤝 Contributing

1. Fork repo & create a feature branch
2. Write clean code (ESLint + Prettier included)
3. Submit PR with clear description

---
