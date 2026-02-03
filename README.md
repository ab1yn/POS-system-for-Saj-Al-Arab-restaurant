# نظام صاج العرب POS (Saj Al-Arab Point of Sale)

نظام نقاط بيع متكامل (Full-Stack) مصمم خصيصاً لمطعم "صاج العرب" في الأردن. يدعم اللغة العربية بالكامل (RTL) ويتميز بتصميم عصري وأداء عالي.

## 🛠️ التقنيات المستخدمة (Tech Stack)

### Frontend (واجهة المستخدم)
- **Framework:** React 18 + Vite (TypeScript)
- **Styling:** TailwindCSS + Shadcn/UI (Arabic 'Cairo' Font)
- **State:** Zustand (Cart & UI)
- **API:** Axios + TanStack Query
- **Routing:** React Router DOM

### Backend (الخادم وقاعدة البيانات)
- **Runtime:** Node.js 20 LTS
- **Framework:** Express (TypeScript)
- **Database:** SQLite (better-sqlite3)
- **Validation:** Zod
- **Architecture:** Services/Controllers Pattern

### Shared
- **Monorepo:** npm workspaces
- **Types:** Shared Zod schemas (packages/types)

---

## 🚀 تعليمات التثبيت (Installation)

# Prerequisites: Node.js 20 LTS, npm 10+, Git

# 1. Clone or navigate to project
cd POS_1

# 2. Install all dependencies
npm install

# 3. Setup environment variables
# Copy .env.example to .env in both apps
copy apps\frontend\.env.example apps\frontend\.env
copy apps\backend\.env.example apps\backend\.env

# 4. Initialize database (Run Migrations & Seed)
cd apps\backend
npm run db:migrate
npm run db:seed
cd ..\..

# 5. Run development mode (Start both Frontend & Backend)
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3001

## 🖨️ إعدادات الطباعة (Printing Setup)
النظام يستخدم بروتوكول `window.print()` ولا يحتاج لبرامج تعريف معقدة.
1. تأكد من توصيل طابعة الإيصالات الحرارية (80mm).
2. اجعلها الطابعة الافتراضية في إعدادات Windows.
3. عند أول طباعة، تأكد من إلغاء خيار "Headers and Footers" في نافذة الطباعة بالمتصفح، وضبط الهوامش "Margins" على "None" أو "Minimum".

---

## 📂 هيكلية المشروع (Project Structure)

project-root/
├── package.json          # Root workspace config
├── tsconfig.json         # Shared TS config
├── apps/
│   ├── frontend/         # React Application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── layout/    # MainLayout
│   │   │   │   ├── pos/       # OrderPanel, ProductGrid...
│   │   │   │   └── ui/        # Shadcn components
│   │   │   ├── store/         # Zustand stores
│   │   │   └── lib/           # Hooks, Utils
│   └── backend/          # Express API
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── routes/
│       │   ├── database/    # Migrations & Seeds
│       │   └── middleware/
└── packages/
    └── types/            # Shared Types & Zod Schemas

---

## ✅ المميزات المكتملة (Completed Features)
- [x] واجهة عربية بالكامل مع خط "كايرو".
- [x] نظام الطلبات (سفري، توصيل، محلي).
- [x] إدارة السلة (إضافة، تعديل، حذف، ملاحظات).
- [x] الإضافات (Modifiers) ونظام التسعير الديناميكي.
- [x] الدفع (كاش، بطاقة) مع حساب الباقي.
- [x] طباعة تذكرة المطبخ (بدون أسعار).
- [x] طباعة فاتورة العميل (مع الأسعار بالدينار الأردني).
- [x] قاعدة بيانات SQLite سريعة.

---
**Developer:** Antigravity (Via Google DeepMind)
