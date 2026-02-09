# Booklk Website

A modern, all-in-one book website with Supabase authentication, AI book helper, and comments. Built for easy deployment and use on GitHub Pages.

## Features
- User sign in and registration (Supabase Auth)
- Dashboard to add, view, and comment on books
- Create books manually or generate with AI helper
- Book covers and comments
- All-in-one HTML, JS, and CSS for simple deployment

## Live Demo
Once deployed, your site will be live at:
```
https://<your-github-username>.github.io/book-website/
```

## Getting Started
1. **Fork or clone this repo**
2. Add your Supabase project credentials in `main.js`:
   ```js
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Commit and push your changes
4. GitHub Actions will automatically deploy your site to GitHub Pages

## Supabase Table Setup
Run this SQL in your Supabase SQL editor:
```sql
create table books (
  id serial primary key,
  title text not null,
  content text not null,
  cover text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table comments (
  id serial primary key,
  book_id integer references books(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);
```

## Customization
- Update styles in `style.css`
- Add more features in `main.js`

## License
MIT

