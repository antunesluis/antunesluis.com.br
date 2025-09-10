<div align="center">
  <a href="https://antunesluis.com.br">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/images/home.png">
      <img alt="Blog Markdown Project Cover" src="public/images/home.png" style="border-radius: 15px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); max-width: 900px; height: auto; display: block; margin: 0 auto;">
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
</div>

<br />

A modern personal blog built with Next.js that renders Markdown posts with a
complete administrative area for content management.

## ✨ Features

### Public Frontend

- **Post Rendering**: Full Markdown support with syntax highlighting
- **Responsive Design**: Modern and clean interface with Tailwind CSS
- **SEO Optimized**: Dynamic meta tags and optimized structure
- **Performance**: Static generation with Next.js for fast loading

### Administrative Area

- **Login System**: Secure authentication with password hashing
- **Post Management**: Complete CRUD operations (create, read, update, delete)
- ** Markdown Editor**: Intuitive interface for creating and editing posts
- **Image Upload**: Integrated upload system for cover images
- **Publication Status**: Control over published/draft posts
- **Route Protection**: Authentication middleware for all admin routes

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15.3.3** - React framework with App Router
- **React 19** - User interface library
- **TypeScript 5** - Typed programming language

### Database

- **SQLite** - Local database
- **Drizzle ORM 0.44.4** - TypeScript-first ORM
- **Better SQLite3** - SQLite driver for Node.js

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Typography plugin
- **Lucide React** - Icon library

### Markdown & Editor

- **@uiw/react-md-editor** - React Markdown editor
- **react-markdown** - Markdown renderer
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-sanitize** - HTML sanitization
- **sanitize-html** - HTML cleaning

### Authentication & Security

- **bcryptjs** - Password hashing
- **jose** - JWT manipulation
- **Zod** - TypeScript schema validation

### Utilities

- **react-toastify** - Toast notifications

## 🔒 Security

- **Authentication**: bcrypt password hashing
- **Middleware**: Automatic protection of administrative routes
- **Validation**: Zod schemas for input validation
- **Sanitization**: Safe Markdown and HTML processing

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for more details.
