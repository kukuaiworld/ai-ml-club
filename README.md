# AI/ML Club — Premier Academic & Research Community Portal

A production-quality website for a university Artificial Intelligence & Machine Learning Club. Crafted with a dark cyber-futuristic identity inspired by cutting-edge AI research labs, neural networks, and robotics centers.

---

## ⚡ Key Highlights & Features

### 🌌 1. Futuristic 3D Visual Identity
- **Interactive Three.js 3D Hero Core**: Full WebGL neural network brain & particle sphere with dynamic synapses, depth particles, and real-time mouse tilt reactions.
- **"Inside the AI Lab" Signature Visualizer**: Dynamic HTML5 Canvas rendering action potentials (traveling electrical pulses) along synaptic routes connecting research divisions, with an interactive cyber telemetry HUD.
- **Glassmorphism & Neon Glow**: Deep charcoal/black palette (`#04060A`), electric cyan, blue, and violet neon accents, smooth scrolling, and custom desktop cyber cursor.

### 🌐 2. Public Experience & Disciplines
- **Live Event Countdown**: Dynamic countdown ticker to the next upcoming workshop with real-time seat tracking.
- **Explore AI (10 Disciplines)**: Interactive domain cards with custom animated hover micro-visualizers for:
  - Machine Learning
  - Deep Learning
  - Generative AI
  - Natural Language Processing
  - Computer Vision
  - Neural Networks
  - Data Science
  - AI Agents
  - Robotics
  - Responsible AI
- **Hands-on Workshops**: Filter by Upcoming, Ongoing, and Past; complete registration modal with form validation and celebratory confetti.
- **Activities**: Filter by Category (*Technical Session, Competition, Hackathon, Project Showcase, Club Meeting, AI Challenge*) and Status.
- **Projects Showcase**: Filterable research grid displaying tech stack, GitHub repo links, live demo links, and team leads.
- **Open Resource Hub**: Downloadable guides, arXiv paper analyses, datasets, tools, and community stars.
- **Masonry Gallery & Lightbox**: High-res photo archive covering hackathons, hardware setups, and drone trials.
- **Academic Year Timeline**: Interactive academic calendar with cyber nodes and seasonal milestones.
- **Encrypted Contact Dispatch**: Direct contact form persisting inquiries into the club database for administrative review.
- **Global Search (`Cmd + K` / `Ctrl + K`)**: Instant search across workshops, activities, projects, resources, and team members.

### 🔒 3. Role-Based Access Control (RBAC) & Dashboard (`/dashboard`)
- **Member Authentication (`/login`)**: Protected dashboard routes with strict role-based separation:
  - **Admin**: Full database authority, member role management, dynamic achievement metrics editing, contact inquiry review, and telemetry analytics.
  - **Core Member**: Manage activities, publish workshops, review/approve student project submissions, upload to gallery.
  - **Member**: Submit AI/ML projects for review, access resources, update researcher profile, view private club notifications.
  - **Visitor**: Read-only public exploration.
- **Instant Demo Switcher**: One-click demo buttons on the login page and navbar badge for immediate testing of each role without manual database seeding!

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Effects** | Tailwind CSS v3, Custom Cyber Keyframes, Glassmorphism |
| **3D & Visualizations** | Three.js (WebGL), HTML5 Canvas Particle Engine |
| **Icons & Micro-Interactions** | Lucide Icons, Canvas Confetti |
| **Backend & Storage** | Supabase (PostgreSQL, Row Level Security, Auth), Local Reactive DataStore |

---

## 🚀 Getting Started

### 1. Development Server
The development server runs on:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. Supabase Setup (Optional)
The project works 100% out of the box with built-in reactive storage and sample data. To connect your live Supabase project:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor in Supabase and paste the contents of `supabase/schema.sql`.
3. Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
4. Restart the Vite server. All data will automatically sync with your PostgreSQL database!

---

## 👥 Demo Accounts
- **Admin**: `admin@aimlclub.edu` (Password: any or click "Admin" button)
- **Core Member**: `core@aimlclub.edu` (Password: any or click "Core Member" button)
- **Member**: `member@aimlclub.edu` (Password: any or click "Member" button)
