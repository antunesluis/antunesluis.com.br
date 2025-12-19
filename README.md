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

- **blog posts** - markdown rendering with syntax highlighting and github
  flavored markdown (gfm)

- **featured content** - highlighted posts automatically displayed on the
  homepage

- **projects portfolio** - dedicated section for software projects with
  technical descriptions

- **about page** - personal presentation, resume download, and social media
  links

- **responsive ui** - mobile-first design with a clean and minimal interface

### Administrative dashboard

- **authentication system** - secure login using hashed passwords and jwt

- **post management** - full crud operations (create, edit, publish, delete)

- **markdown editor** - intuitive editor for writing and editing posts

- **image upload** - integrated upload system for cover images

- **publication control** - draft and published states for posts

- **protected routes** - middleware-based access control for admin pages

### Seo & performance

- **advanced seo** - schema.org structured data (json-ld)

- **dynamic metadata** - automatic open graph and twitter card generation

- **sitemap & robots.txt** - automatically generated for search engine indexing

## Tech stack

### Core

- **next.js 15.3.3** – react framework with app router
- **react 19**
- **typescript 5**

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

- passwords stored using **bcrypt hashing**
- jwt-based authentication
- protected admin routes via middleware
- input validation with zod
- sanitized markdown and html rendering

## Getting started

### Prerequisites

- **node.js 18+**
- npm or yarn

### Installation

1. **clone the repository**

```bash
git clone https://github.com/antunesluis/antunesluis.com.br.git
cd antunesluis.com.br
```

2. **install dependencies**

```bash
npm install
```

3. **configure environment variables**

```bash
cp .env.example .env.local
```

edit `.env.local`:

```env
next_public_site_url=http://localhost:3000
admin_password_hash=your_bcrypt_hash_here
jwt_secret=your_secret_here
...
```

> you can generate a password hash using `bcrypt`.

4. **run database migrations**

```bash
npm run migrate
```

5. **start the development server**

```bash
npm run dev
```

the application will be available at: 👉 http://localhost:3000

## License

this project is licensed under the **mit license**. see the [license](license)
file for more information.
