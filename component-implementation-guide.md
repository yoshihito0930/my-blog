# コンポーネント実装ガイド

この文書では、レスポンシブ対応とUI改善のための各コンポーネントの具体的な実装方法を説明します。前述の「デザインシステム実装ガイド」で定義したCSSカスタムプロパティやグリッドシステムを活用します。

## 目次

1. [ベースレイアウト](#1-ベースレイアウト)
2. [ヘッダー](#2-ヘッダー)
3. [ブログカード](#3-ブログカード)
4. [フッター](#4-フッター)
5. [ホームページ](#5-ホームページ)
6. [タグコンポーネント](#6-タグコンポーネント)
7. [ページネーション](#7-ページネーション)
8. [記事ページ](#8-記事ページ)
9. [テスト手順](#9-テスト手順)

## 1. ベースレイアウト

ベースレイアウトはサイトの基本構造を提供します。レスポンシブ対応のために固定マージンを排除し、コンテナを使います。

### src/layouts/BaseLayout.astro

```astro
---
// コンポーネントとスタイルをインポート
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import "../styles/variables.css";
import "../styles/layout.css";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const { 
  title = "Yoshihito Tech Blog",
  description = "技術的な発見や学びを共有するブログ",
  ogImage = "/assets/ogp/default.png"
} = Astro.props;
---

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    
    <!-- OGP設定 -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Yoshihito Tech Blog" />
    
    <!-- ファビコン -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Header />
    <main class="container">
      <slot /> <!-- コンテンツ表示 -->
    </main>
    <Footer />
  </body>
</html>
```

## 2. ヘッダー

ヘッダーはレスポンシブデザインに対応し、小さい画面ではハンバーガーメニューを表示します。

### src/components/Hamburger.astro

```astro
<button class="hamburger" aria-label="メニュー">
  <span class="line"></span>
  <span class="line"></span>
  <span class="line"></span>
</button>

<style>
  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 1.75rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
  }
  
  .line {
    width: 2rem;
    height: 0.25rem;
    background-color: var(--color-text-inverse);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
  
  .hamburger.active .line:first-child {
    transform: rotate(45deg);
  }
  
  .hamburger.active .line:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger.active .line:nth-child(3) {
    transform: rotate(-45deg);
  }
</style>
```

### src/components/Header.astro

```astro
---
import { BLOG_TITLE } from "../constraint";
import Hamburger from "./Hamburger.astro";
---
<header class="header">
  <div class="container">
    <div class="header-content">
      <h1 class="site-title"><a href="/">{BLOG_TITLE}</a></h1>
      
      <!-- モバイル用メニューボタン -->
      <div class="menu-button">
        <Hamburger />
      </div>
      
      <!-- デスクトップナビゲーション -->
      <nav class="nav-desktop">
        <a href="/profile">Profile</a>
        <a href="/posts">Blog</a>
      </nav>
    </div>
  </div>
</header>

<!-- モバイルナビゲーション -->
<nav id="mobile-nav" class="nav-mobile">
  <a href="/profile">Profile</a>
  <a href="/posts">Blog</a>
</nav>

<style>
  .header {
    background-color: var(--color-secondary);
    color: var(--color-text-inverse);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-sm);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) 0;
  }
  
  .site-title {
    font-size: var(--font-size-xl);
    margin: 0;
  }
  
  .site-title a {
    color: var(--color-text-inverse);
    text-decoration: none;
    font-weight: bold;
  }
  
  .nav-desktop {
    display: none;
  }
  
  .nav-desktop a {
    color: var(--color-text-inverse);
    text-decoration: none;
    margin-left: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    transition: background-color var(--transition-fast);
  }
  
  .nav-desktop a:hover {
    background-color: var(--color-secondary-light);
  }
  
  .nav-mobile {
    display: flex;
    flex-direction: column;
    background-color: var(--color-secondary);
    padding: var(--spacing-md);
    transform: translateY(-100%);
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    transition: transform var(--transition-base);
    z-index: 99;
  }
  
  .nav-mobile.open {
    transform: translateY(0);
  }
  
  .nav-mobile a {
    color: var(--color-text-inverse);
    text-decoration: none;
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--color-secondary-light);
  }
  
  .menu-button {
    display: block;
  }
  
  /* タブレット以上 */
  @media (min-width: 768px) {
    .menu-button {
      display: none;
    }
    
    .nav-desktop {
      display: flex;
    }
    
    .nav-mobile {
      display: none;
    }
  }
</style>

<script>
  // Hamburgerメニューの動作
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    
    hamburger?.addEventListener('click', () => {
      mobileNav?.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  });
</script>
```

## 3. ブログカード

ブログカードは記事のプレビューを表示するコンポーネントです。カードベースのデザインでモダンな印象を与え、レスポンシブグリッドに配置します。

### src/components/PostList.astro

```astro
---
import type { CollectionEntry } from "astro:content";
import { getTagMap } from "../content/utils";
import Tag from "../components/Tag.astro"
import { Image } from "astro:assets";

const tagMap = await getTagMap();

interface Props {
  posts: CollectionEntry<"posts">[];
}

const { posts } = Astro.props;
---
<section class="post-list">
  {posts.map(post => (
    <article class="post-card">
      <a href={`/posts/${post.slug}`} class="post-link">
        <div class="post-image">
          {post.data.image && 
            <img 
              src={post.data.image}
              alt={post.data.title}
              loading="lazy"
            />
          }
        </div>
        
        <div class="post-content">
          <div class="post-meta">
            <time datetime={post.data.publishedAt}>
              {new Date(post.data.publishedAt).toLocaleDateString('ja-JP', { 
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit' 
              })}
            </time>
          </div>
          
          <h2 class="post-title">{post.data.title}</h2>
          
          {post.data.excerpt && 
            <p class="post-excerpt">{post.data.excerpt}</p>
          }
          
          <div class="post-tags">
            {post.data.tags.map(tag => (
              <Tag name={tag} href={`/tags/${tag}`} focused={false} />
            ))}
          </div>
        </div>
      </a>
    </article>
  ))}
</section>

<style>
  .post-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  @media (min-width: 768px) {
    .post-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .post-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .post-card {
    background: var(--color-bg-card);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-base), box-shadow var(--transition-base);
    height: 100%;
  }
  
  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  
  .post-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: var(--color-text);
    text-decoration: none;
  }
  
  .post-image {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background-color: var(--color-bg);
  }
  
  .post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }
  
  .post-card:hover .post-image img {
    transform: scale(1.05);
  }
  
  .post-content {
    padding: var(--spacing-md);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .post-meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin-bottom: var(--spacing-sm);
  }
  
  .post-title {
    font-size: var(--font-size-lg);
    margin: 0 0 var(--spacing-sm) 0;
    line-height: var(--line-height-tight);
  }
  
  .post-excerpt {
    font-size: var(--font-size-base);
    color: var(--color-text-light);
    margin-bottom: var(--spacing-md);
    line-height: var(--line-height-base);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .post-tags {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
</style>
```

## 4. フッター

フッターはシンプルながらも統一感のあるデザインとし、レスポンシブ対応します。

### src/components/Footer.astro

```astro
<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-links">
        <a href="/profile">プロフィール</a>
        <a href="/posts">ブログ</a>
        <a href="https://github.com/yoshihito" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p class="copyright">© {new Date().getFullYear()} Yoshihito Ishihara</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--color-secondary);
    color: var(--color-text-inverse);
    padding: var(--spacing-lg) 0;
    margin-top: var(--spacing-2xl);
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-lg);
  }
  
  .footer-links a {
    color: var(--color-text-inverse);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .footer-links a:hover {
    color: var(--color-primary-light);
  }
  
  .copyright {
    font-size: var(--font-size-sm);
    margin: 0;
  }
  
  @media (min-width: 768px) {
    .footer-content {
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>
```

## 5. ホームページ

ホームページはメインセクションをレスポンシブに配置し、画像サイズを相対的に設定します。

### src/pages/index.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <div class="home-container">
    <!-- プロフィールセクション -->
    <section id="profile" class="home-section">
      <h2 class="section-title">Profile</h2>
      <div class="section-content">
        <a href="/profile" class="image-link">
          <img 
            src="/assets/home/profile.png" 
            alt="Profile" 
            class="section-image" 
            width="800" 
            height="600" 
          />
        </a>
        <p class="section-description">
          プロフィールページでは、私の経歴、スキル、興味のある技術分野について紹介しています。
        </p>
        <a href="/profile" class="cta-button">プロフィールを見る</a>
      </div>
    </section>

    <!-- ブログセクション -->
    <section id="blog" class="home-section">
      <h2 class="section-title">Blog</h2>
      <div class="section-content">
        <a href="/posts" class="image-link">
          <img 
            src="/assets/home/blog.png" 
            alt="Blog" 
            class="section-image" 
            width="800" 
            height="600" 
          />
        </a>
        <p class="section-description">
          技術的な発見、学び、ソフトウェア開発のベストプラクティスなどについての記事を公開しています。
        </p>
        <a href="/posts" class="cta-button">ブログを読む</a>
      </div>
    </section>
  </div>
</BaseLayout>

<style>
  .home-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }

  .home-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .section-image {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    transition: transform var(--transition-base);
  }

  .image-link:hover .section-image {
    transform: scale(1.02);
  }

  .section-description {
    margin: var(--spacing-lg) 0;
    text-align: center;
    font-size: var(--font-size-md);
    color: var(--color-text);
  }

  .cta-button {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--border-radius-md);
    font-weight: bold;
    text-decoration: none;
    transition: background-color var(--transition-fast);
  }

  .cta-button:hover {
    background-color: var(--color-primary-dark);
  }

  /* タブレット以上の画面サイズ */
  @media (min-width: 768px) {
    .section-content {
      width: 80%;
    }
  }

  /* デスクトップ */
  @media (min-width: 1024px) {
    .section-content {
      width: 70%;
    }
  }
</style>
```

## 6. タグコンポーネント

タグコンポーネントは視覚的に目立つデザインとし、クリック可能な領域を広げます。

### src/components/Tag.astro

```astro
---
interface Props {
  name: string;
  href: string;
  focused?: boolean;
}

const { name, href, focused = false } = Astro.props;
---
<a href={href} class={`tag ${focused ? 'focused' : ''}`}>
  <span class="tag-name">{name}</span>
</a>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-xs);
    color: var(--color-text);
    text-decoration: none;
    transition: all var(--transition-fast);
  }
  
  .tag:hover {
    background-color: var(--color-primary-light);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);
  }
  
  .tag.focused {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);
  }
  
  .tag-name {
    font-weight: 500;
  }
</style>
```

## 7. ページネーション

ページネーションは視認性を高め、モバイルでも使いやすく設計します。

### src/components/Pagination.astro

```astro
---
interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const { currentPage, totalPages, baseUrl } = Astro.props;

// 表示するページ番号を計算
const getPageNumbers = () => {
  const pageNumbers = [];
  const MAX_VISIBLE_PAGES = 5;
  
  if (totalPages <= MAX_VISIBLE_PAGES) {
    // ページが少ない場合はすべて表示
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // 現在のページを中心に表示（最大5ページ）
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages);
    
    // endPageが限界に達した場合は調整
    if (endPage === totalPages) {
      startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 1);
    }
    
    // 1ページ目は常に表示
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }
    
    // 中間のページ
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // 最終ページは常に表示
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }
  
  return pageNumbers;
};

const pageNumbers = getPageNumbers();
---

<nav class="pagination" aria-label="ページナビゲーション">
  <ul class="pagination-list">
    <!-- 前のページボタン -->
    <li class="pagination-item">
      {currentPage > 1 ? (
        <a 
          href={`${baseUrl}${currentPage - 1 === 1 ? '' : `/${currentPage - 1}`}`} 
          class="pagination-link" 
          aria-label="前のページ"
        >
          <span class="pagination-arrow">←</span>
          <span class="pagination-text">前へ</span>
        </a>
      ) : (
        <span class="pagination-link disabled">
          <span class="pagination-arrow">←</span>
          <span class="pagination-text">前へ</span>
        </span>
      )}
    </li>
    
    <!-- ページ番号 -->
    {pageNumbers.map(page => (
      <li class="pagination-item">
        {typeof page === 'number' ? (
          <a 
            href={`${baseUrl}${page === 1 ? '' : `/${page}`}`} 
            class={`pagination-link ${currentPage === page ? 'active' : ''}`}
            aria-label={`ページ ${page}${currentPage === page ? '(現在のページ)' : ''}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </a>
        ) : (
          <span class="pagination-ellipsis">...</span>
        )}
      </li>
    ))}
    
    <!-- 次のページボタン -->
    <li class="pagination-item">
      {currentPage < totalPages ? (
        <a 
          href={`${baseUrl}/${currentPage + 1}`} 
          class="pagination-link" 
          aria-label="次のページ"
        >
          <span class="pagination-text">次へ</span>
          <span class="pagination-arrow">→</span>
        </a>
      ) : (
        <span class="pagination-link disabled">
          <span class="pagination-text">次へ</span>
          <span class="pagination-arrow">→</span>
        </span>
      )}
    </li>
  </ul>
</nav>

<style>
  .pagination {
    margin: var(--spacing-xl) 0;
  }
  
  .pagination-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    padding: 0;
    gap: var(--spacing-sm);
  }
  
  .pagination-item {
    margin: 0;
  }
  
  .pagination-link {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-text);
    text-decoration: none;
    transition: all var(--transition-fast);
    font-size: var(--font-size-sm);
  }
  
  .pagination-link:hover:not(.disabled) {
    background-color: var(--color-secondary-light);
    color: var(--color-text-inverse);
  }
  
  .pagination-link.active {
    background-color: var(--color-secondary);
    color: var(--color-text-inverse);
    border-color: var(--color-secondary);
  }
  
  .pagination-link.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-arrow {
    font-size: 1.2em;
    line-height: 1;
  }
  
  .pagination-text {
    display: none;
  }
  
  .pagination-ellipsis {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-light);
  }
  
  /* タブレット以上 */
  @media (min-width: 768px) {
    .pagination-text {
      display: inline;
      margin: 0 var(--spacing-xs);
    }
  }
</style>
```

## 8. 記事ページ

記事ページは読みやすさを重視し、適切な行長と行間を確保します。

### src/pages/posts/[id]/index.astro

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import DateInfo from '../../../components/DateInfo.astro';
import Tag from '../../../components/Tag.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  
  return posts.map(post => ({
    params: { id: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

// OGP用の説明文（最初の100文字程度）
const description = post.body.slice(0, 150).replace(/[#*`]/g, '').trim() + '...';
---

<BaseLayout title={post.data.title} description={description} ogImage={post.data.image}>
  <article class="article">
    <header class="article-header">
      <div class="article-meta">
        <DateInfo date={post.data.publishedAt} />
      </div>
      <h1 class="article-title">{post.data.title}</h1>
      <div class="article-tags">
        {post.data.tags.map(tag => (
          <Tag name={tag} href={`/tags/${tag}`} />
        ))}
      </div>
      {post.data.image && (
        <div class="article-featured-image">
          <img 
            src={post.data.image} 
            alt={post.data.title}
            width="1200"
            height="630"
          />
        </div>
      )}
    </header>
    
    <div class="article-content">
      <Content />
    </div>
    
    <footer class="article-footer">
      <div class="article-navigation">
        <a href="/posts" class="back-link">← 記事一覧に戻る</a>
      </div>
    </footer>
  </article>
</BaseLayout>

<style>
  .article {
    max-width: var(--content-max-width);
    margin: 0 auto;
  }
  
  .article-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .article-meta {
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-light);
  }
  
  .article-title {
    font-size: var(--font-size-3xl);
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
    word-wrap: break-word;
  }
  
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
  }
  
  .article-featured-image {
    margin-bottom: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }
  
  .article-featured-image img {
    width: 100%;
    height: auto;
