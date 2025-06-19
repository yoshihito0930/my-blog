# デザインシステム実装ガイド

## 1. CSSカスタムプロパティの定義

まず、`src/styles/variables.css`ファイルを作成して、デザインシステムの基本要素を定義します：

```css
:root {
  /* カラーパレット */
  --color-primary: #3498db;        /* プライマリカラー - アクセントやメインカラー */
  --color-primary-light: #5dade2;
  --color-primary-dark: #2980b9;
  
  --color-secondary: #2c3e50;      /* セカンダリカラー - ヘッダーやフッターの背景 */
  --color-secondary-light: #34495e;
  --color-secondary-dark: #1a252f;
  
  --color-accent: #e74c3c;         /* アクセントカラー - 重要な要素やハイライト */
  
  --color-text: #333333;           /* 通常テキスト */
  --color-text-light: #666666;     /* 薄いテキスト（メタ情報など） */
  --color-text-inverse: #ffffff;   /* 暗い背景上のテキスト */
  
  --color-bg: #f9f9f9;             /* メイン背景色 */
  --color-bg-card: #ffffff;        /* カード背景色 */
  --color-bg-code: #f5f5f5;        /* コードブロック背景色 */
  
  --color-border: #e0e0e0;         /* ボーダー色 */

  /* タイポグラフィ */
  --font-family-base: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  --font-family-heading: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  --font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-md: 1.125rem;  /* 18px */
  --font-size-lg: 1.25rem;   /* 20px */
  --font-size-xl: 1.5rem;    /* 24px */
  --font-size-2xl: 1.875rem; /* 30px */
  --font-size-3xl: 2.25rem;  /* 36px */
  
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-loose: 1.75;
  
  /* スペーシング */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  
  /* レイアウト */
  --container-max-width: 1200px;
  --content-max-width: 720px;  /* 記事本文の最大幅 */
  
  /* ブレークポイント */
  --breakpoint-sm: 576px;   /* スマホ横向き */
  --breakpoint-md: 768px;   /* タブレット */
  --breakpoint-lg: 992px;   /* 小型デスクトップ */
  --breakpoint-xl: 1200px;  /* 大型デスクトップ */
  
  /* その他 */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
}
```

## 2. レスポンシブグリッドの設定

次に、`src/styles/layout.css`を作成してレスポンシブなレイアウト基盤を構築します：

```css
/* ベースレイアウト */
.container {
  width: 100%;
  padding: 0 var(--spacing-md);
  margin: 0 auto;
}

/* レスポンシブコンテナ */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: var(--container-max-width);
  }
}

/* グリッドシステム */
.grid {
  display: grid;
  gap: var(--spacing-md);
}

/* モバイルファーストのグリッド列定義 */
.col-1 { grid-template-columns: repeat(1, 1fr); }
.col-2 { grid-template-columns: repeat(2, 1fr); }

/* メディアクエリでブレイクポイントごとの列数を調整 */
@media (min-width: 768px) {
  .md\:col-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:col-3 { grid-template-columns: repeat(3, 1fr); }
  .md\:col-4 { grid-template-columns: repeat(4, 1fr); }
  
  /* 特別なレイアウト比率 */
  .md\:col-1-2 { grid-template-columns: 1fr 2fr; }
  .md\:col-2-1 { grid-template-columns: 2fr 1fr; }
  .md\:col-3-1 { grid-template-columns: 3fr 1fr; }
}

/* フレックスボックスユーティリティ */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.flex-wrap { flex-wrap: wrap; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }

/* スペーシングユーティリティ */
.mt-md { margin-top: var(--spacing-md); }
.mb-md { margin-bottom: var(--spacing-md); }
.py-md { padding-top: var(--spacing-md); padding-bottom: var(--spacing-md); }
.px-md { padding-left: var(--spacing-md); padding-right: var(--spacing-md); }
```

## 3. コンポーネントのリファクタリング例

以下は各コンポーネントの改善案です。

### BaseLayout.astro

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

### Header.astro

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

### PostList.astro (リファクタリング)

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

## 4. グローバルスタイルのリファクタリング

`src/styles/global.css` を下記のように更新します：

```css
/* ベーススタイル */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background-color: var(--color-bg);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--spacing-md) 0;
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }
h4 { font-size: var(--font-size-lg); }
h5 { font-size: var(--font-size-md); }
h6 { font-size: var(--font-size-base); }

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

img {
  max-width: 100%;
  height: auto;
}

/* コンテンツエリア */
main {
  padding: var(--spacing-xl) 0;
}

/* レスポンシブセクション */
section {
  margin-bottom: var(--spacing-2xl);
}

/* アーティクル（ブログ記事）スタイル */
article {
  margin-bottom: var(--spacing-xl);
}

.article-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.article-content p {
  margin-bottom: var(--spacing-md);
}

.article-content img {
  border-radius: var(--border-radius-md);
  margin: var(--spacing-lg) 0;
}

/* フォーム要素 */
input, textarea, select, button {
  font-family: inherit;
  font-size: inherit;
}

button {
  cursor: pointer;
}

/* ユーティリティクラス */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }

.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-white { background-color: white; }

.rounded { border-radius: var(--border-radius-md); }
.shadow { box-shadow: var(--shadow-md); }
```

## 5. モバイルメニューの実装（Hamburger.astro の例）

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
    height: 2rem;
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

## 6. 実装手順

1. **基本ファイルの作成と更新**:
   - `src/styles/variables.css` を新規作成
   - `src/styles/layout.css` を新規作成
   - `src/styles/global.css` を更新

2. **ベースレイアウトの更新**:
   - `src/layouts/BaseLayout.astro` を更新してスタイルファイルをインポート
   - コンテナ構造に変更

3. **コンポーネント更新**:
   - `src/components/Header.astro`
   - `src/components/Footer.astro`
   - `src/components/Hamburger.astro`（新規または更新）
   - `src/components/PostList.astro`

4. **各ページの更新**:
   - `src/pages/index.astro`
   - `src/pages/posts.astro`
   - `src/pages/profile.astro`
   - `src/pages/posts/[id]/index.astro`

5. **テストとブレークポイント調整**:
   - 各画面サイズでの表示を確認
   - 必要に応じてブレークポイントを微調整

この実装計画は、モバイルファーストのアプローチと再利用可能なコンポーネントを中心に構築されています。CSSカスタムプロパティを活用することで、テーマの一貫性を確保し、必要に応じて簡単に調整できる柔軟性を持たせています。
