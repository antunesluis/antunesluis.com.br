<div align="center">
  <a href="https://antunesluis.com.br">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/images/home.png">
      <img alt="Personal Blog Project Cover" src="public/images/home.png">
    </picture>
  </a>
  <h1 align="center">
    antunesluis.com.br
  </h1>

  <p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License MIT" />
  </p>

  <p align="center">
    A modern, SEO-optimized personal blog and portfolio built with Next.js 15, featuring a complete CMS and advanced structured data implementation.
  </p>

  <p align="center">
    <a href="https://antunesluis.com.br">View Live Demo</a> •
    <a href="#-features">Features</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>
</div>

<br />

## ✨ Features

### 🌐 Public Frontend

#### Content Display

- **Blog Posts**: Full Markdown rendering with syntax highlighting and GitHub
  Flavored Markdown
- **Featured Posts**: Automatic highlighting of featured articles on homepage
- **Project Portfolio**: Showcase of software projects with technical details
- **About Page**: Personal information with resume download and social links
- **Responsive Design**: Mobile-first approach with modern, clean interface

#### SEO & Performance

- **Advanced SEO**: Complete Schema.org structured data (JSON-LD) implementation
  - PersonSchema for author identity
  - BlogPostSchema for individual articles
  - ProjectSchema for software applications
  - BreadcrumbSchema for site navigation
  - WebSiteSchema with search action capability
- **Dynamic Meta Tags**: Automatic Open Graph and Twitter Card generation
- **Sitemap & Robots.txt**: Automated XML sitemap generation
- **Performance**: Static generation with ISR (Incremental Static Regeneration)
- **Web Vitals**: Optimized Core Web Vitals scores

#### User Experience

- **Dark/Light Theme**: System-aware theme with manual toggle
- **Comments Section**: Integrated Giscus comments (GitHub Discussions)
- **Smooth Navigation**: Client-side routing with optimistic UI updates
- **Loading States**: Suspense boundaries with elegant loaders
- **Toast Notifications**: User feedback for all actions

### 🔐 Administrative Area

#### Authentication & Security

- **Secure Login**: JWT-based authentication with httpOnly cookies
- **Password Hashing**: bcrypt encryption for credentials
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic token refresh and expiration

#### Content Management

##### Blog Posts

- **Full CRUD Operations**: Create, read, update, and delete posts
- **Markdown Editor**: Live preview with toolbar and shortcuts
- **Image Upload**: Integrated file upload system for cover images
- **Publication Control**: Draft/published status toggle
- **Featured Posts**: Mark posts to appear on homepage
- **SEO Fields**: Custom title, description, and slug management
- **Validation**: Zod schema validation for all inputs

##### Projects

- **Project Management**: Complete CRUD for portfolio projects
- **Tech Stack Tags**: Multiple technology badges per project
- **Repository Links**: GitHub/GitLab repository URLs
- **Live Demo URLs**: Deploy URL tracking
- **Cover Images**: Project screenshot uploads
- **Rich Descriptions**: Markdown support for project details

#### Admin Dashboard

- **Content Overview**: List view of all posts and projects
- **Quick Actions**: Edit, delete, and toggle featured status
- **Search & Filter**: Find content quickly (planned)
- **Draft Management**: Separate views for published and draft content

### 🎨 Design System

- **Component Architecture**: Modular, reusable React components
- **Type Safety**: Full TypeScript coverage with strict mode
- **Consistent Styling**: Tailwind CSS with custom design tokens
- **Accessibility**: ARIA labels and semantic HTML
- **Icon System**: Lucide React icon library

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15.3.3** - React framework with App Router and Server Components
- **React 19** - Latest React with Concurrent Features
- **TypeScript 5** - Static type checking

### Database Layer

- **SQLite** - Lightweight, serverless database
- **Drizzle ORM 0.44.4** - Type-safe SQL query builder
- **Better SQLite3** - Synchronous SQLite driver for Node.js
- **Drizzle Kit** - Database migrations and introspection

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Beautiful typography defaults
- **next-themes** - Dark mode implementation
- **Lucide React** - Modern icon library
- **Space Grotesk** - Google Font for typography

### Content Management

- **@uiw/react-md-editor** - Feature-rich Markdown editor
- **react-markdown** - Markdown to React component renderer
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-raw** - Raw HTML in Markdown
- **rehype-sanitize** - HTML sanitization
- **sanitize-html** - Additional HTML cleaning

### Authentication & Security

- **bcryptjs** - Password hashing algorithm
- **jose** - Universal JavaScript/TypeScript JWT implementation
- **Zod** - TypeScript-first schema validation
- **Middleware** - Next.js middleware for route protection

### SEO & Analytics

- **next-sitemap** - Automatic sitemap generation
- **Schema.org JSON-LD** - Structured data for search engines
- **Open Graph Protocol** - Social media previews
- **Twitter Cards** - Rich Twitter previews

### Utilities

- **react-toastify** - Toast notification system
- **clsx** - Conditional className utility (if used)
- **date-fns** - Date formatting utilities (if used)

## 📝 Content Management

### Creating Blog Posts

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Go to `/admin/post/new`
4. Fill in post details:
   - Title
   - Slug (auto-generated from title)
   - Excerpt
   - Content (Markdown)
   - Cover Image
   - Author
   - Featured toggle
   - Published toggle

### Managing Projects

1. Navigate to `/admin/projects/new`
2. Fill in project details:
   - Name
   - Description
   - Tech Stack (comma-separated)
   - Repository URL
   - Deploy URL (optional)
   - Cover Image

## 🔒 Security

### Authentication

- **Password Storage**: Passwords are hashed using bcrypt with 10 rounds
- **JWT Tokens**: Signed with HS256 algorithm, stored in httpOnly cookies
- **Token Expiration**: Configurable expiration time (default: 7 days)

### Content Security

- **Markdown Sanitization**: All Markdown is sanitized before rendering
- **HTML Cleaning**: User-generated HTML is cleaned with sanitize-html
- **XSS Protection**: Input validation with Zod schemas
- **SQL Injection**: Prevented by Drizzle ORM parameterized queries

### Route Protection

- **Middleware**: Automatic redirection for unauthenticated admin access
- **Server Actions**: All mutations require valid authentication
- **API Routes**: Protected with token verification

## 🎯 SEO Features

### Structured Data (JSON-LD)

- **Person Schema**: Author identity and credentials
- **WebSite Schema**: Site-wide search functionality
- **Blog Schema**: Complete blog post collection
- **BlogPosting Schema**: Individual article rich snippets
- **SoftwareApplication Schema**: Project portfolio items
- **BreadcrumbList Schema**: Site navigation hierarchy

### Meta Tags

- **Dynamic Title & Description**: Per-page customization
- **Open Graph**: Full OG protocol implementation
- **Twitter Cards**: Large image cards for social sharing
- **Canonical URLs**: Prevent duplicate content issues
- **Language Tags**: Proper language declaration

### Performance

- **Static Generation**: Pre-rendered pages for instant loading
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: Google Fonts with display swap

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
