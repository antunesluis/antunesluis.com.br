<div align="center">
  <a href="https://antunesluis.com.br">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/images/home.png">
      <img alt="antunesluis.com.br – personal blog" src="public/images/home.png">
    </picture>
  </a>

  <h1 align="center">antunesluis.com.br</h1>

  <p align="center">
    personal blog and portfolio built with modern web technologies.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/typescript-3178c6?style=for-the-badge&logo=typescript&logocolor=white" />
    <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logocolor=white" />
    <img src="https://img.shields.io/badge/react-20232a?style=for-the-badge&logo=react&logocolor=61dafb" />
    <img src="https://img.shields.io/badge/tailwind_css-38b2ac?style=for-the-badge&logo=tailwind-css&logocolor=white" />
    <img src="https://img.shields.io/badge/sqlite-003b57?style=for-the-badge&logo=sqlite&logocolor=white" />
    <img src="https://img.shields.io/badge/license-mit-blue?style=for-the-badge" />
  </p>
</div>

A modern personal blog built with **Next.js** that renders Markdown posts with a
complete administrative area for content management.

it supports **markdown-based posts**, project showcasing, and secure
authentication for the admin area.

🔗 **live website:** https://antunesluis.com.br

## Features

### Public area

- **Blog Posts** - Markdown rendering with syntax highlighting and GitHub
  Flavored Markdown (GFM)

- **Projects Portfolio** - Dedicated section for software projects with
  technical descriptions

- **About Page** - Personal presentation, resume download, and social media
  links

- **Responsive UI** - Mobile-first design with clean and minimal interface

- **Comments System** - Giscus integration powered by GitHub Discussions

- **Theme Support** - Dark and light mode with system preference detection

### Administrative dashboard

- **Authentication System** - Secure login using bcrypt hashed passwords and JWT

- **Post Management** - Full CRUD operations (create, edit, publish, delete)

- **Project Management** - Complete portfolio management with tech stack tags

- **Markdown Editor** - Live preview editor for writing and editing content

- **Image Upload** - Integrated upload system for cover images

- **Publication Control** - Draft and published states for posts and projects

- **Protected Routes** - Middleware-based access control for admin pages

### Seo & performance

- **Advanced SEO** - Complete Schema.org structured data (JSON-LD):

- **Dynamic Metadata** - Automatic Open Graph and Twitter Card generation

- **Sitemap & Robots.txt** - Automatically generated XML sitemap for search
  engine indexing

- **Performance Optimized** - Server-side rendering with dynamic content
  generation

- **Core Web Vitals** - Optimized loading, interactivity, and visual stability

- **Real-time Updates** - Always displays the latest content without rebuild

## Tech stack

### Core

- **Next.js 15.3.3** – react framework with app router
- **React 19**
- **Typescript 5**

### Database

- **sqlite** – lightweight, serverless database
- **drizzle orm 0.44.4** – type-safe sql query builder
- **better-sqlite3** – high-performance sqlite driver
- **drizzle kit** – database migrations and schema management

### Markdown & content

- **@uiw/react-md-editor** – markdown editor
- **react-markdown** – markdown renderer
- **remark-gfm** – github flavored markdown
- **rehype-sanitize / sanitize-html** – html sanitization

### Security & validation

- **bcryptjs** – password hashing
- **jose** – jwt creation and verification
- **zod** – runtime schema validation
- **next.js middleware** – route protection

## Security overview

- **Password Storage** - Passwords hashed using bcrypt with 10 rounds

- **JWT Authentication** - Tokens stored in httpOnly cookies

- **Protected Routes** - Middleware-based automatic route protection

- **Input Validation** - All inputs validated with Zod schemas

- **Content Sanitization** - Safe Markdown and HTML rendering

- **SQL Injection Prevention** - Drizzle ORM parameterized queries

## Getting started

### Prerequisites

- **node.js 18+**
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/antunesluis/antunesluis.com.br.git
cd antunesluis.com.br
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
next_public_site_url=http://localhost:3000
admin_password_hash=your_bcrypt_hash_here
jwt_secret=your_secret_here
...
```

> you can generate a password hash using `bcrypt`.

4. **Run database migrations**

```bash
npm run migrate
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at: 👉 http://localhost:3000

## License

This project is licensed under the **mit license**. see the [license](license)
file for more information.
