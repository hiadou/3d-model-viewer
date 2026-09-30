# 白沙河谷生态博物馆 · 官网

线上地址：<https://hiadou.github.io/3d-model-viewer/>（推送到 `main` 分支即更新）

海南乐东白沙河谷生态博物馆的展示站：单页站点（概览 / 园内·馆内景观 / 数字藏品 / 3D 展陈 / 联系），
其中 3D 展陈是 5 个可交互的独立模型页面。

**线上运行的唯一文件是根目录的 [`index.html`](./index.html)**——一份把 React 打包结果和 Tailwind CSS
全部内联进来的单文件产物，图片与 3D 模型仍是相对路径外链。它由 [`ledong-exhibition/`](./ledong-exhibition)
里的 React 源码构建得到。

## 目录结构

| 路径 | 说明 | Git |
| --- | --- | --- |
| `index.html` | **线上文件**：单文件产物（JS/CSS 全内联） | 已跟踪 |
| `ledong-exhibition/` | **源码**：React 19 + TypeScript + Vite，改内容改这里 | 已跟踪 |
| `img/garden/` | 园内景观图 12 张（含首页大图 `白沙河谷大门.webp`） | 已跟踪 |
| `img/hall/` | 馆内景观图 17 张 | 已跟踪 |
| `img/collections/` | 数字藏品图 6 张 | 已跟踪 |
| `glb/` | 3D 展陈：5 个独立模型页 `*.html` + 模型 `*.glb` + 背景音乐 `background.m4a` | 已跟踪 |
| `tools/webp_migrate.py` | 藏品图 PNG → WebP 迁移脚本 | 已跟踪 |
| `icon.ico` | 站点图标（标签页 favicon） | 已跟踪 |
| `CLAUDE.md` / `.claude/` | AI 助手协作约定与本机配置 | 未跟踪 |
| `备份/`、`dist/`、`bundle.html` | 历史备份与旧构建产物 | 已忽略 |

## 内容维护速查

除注明外，全部在 `ledong-exhibition/src/App.tsx`：

| 想改什么 | 改哪里 |
| --- | --- |
| 顶部导航项 | `navItems`（`id` 同时是区块锚点，改 id 要同步区块） |
| 园内 / 馆内景观图与标签 | `allImages`（`tag: 'garden' \| 'hall'`）+ `filterTags` |
| 数字藏品条目 | `collectionItems`（含 `description` 长文） |
| 藏品分类 / 年代筛选 | `collectionCategories` / `collectionDynasties` |
| 3D 展陈清单 | `models3d`（`src` 指向 `glb/*.html`，带 `?v=` 缓存戳） |
| 概览四张卡片文案 | `<section id="intro">` |
| 联系方式、开放时间、传真 | `<section id="contact">` |
| 首页大图与标题 | `<header>`（`./img/garden/白沙河谷大门.webp`） |
| 页脚、访问统计（Vercount） | `<footer>` 与组件顶部的 `useEffect` |
| 标题、描述、分享卡片 `og:*` | `ledong-exhibition/index.html` 的 `<head>` |
| 站点图标 | 根目录 `icon.ico` |

区块 id：`intro`（概览）、`gallery`（园内 + 馆内景观共用）、`collections`（数字藏品，独立页）、
`exhibits3d`（3D 展陈）、`contact`（联系）。

> 「园内景观」和「馆内景观」两个导航项共用 `#gallery` 区块，靠筛选标签区分：点导航会滚动到该区块并
> 切换筛选，导航高亮由 `activeNavItem` 派生（筛选为 `hall` 时高亮「馆内景观」）。不要把它们当成两个独立区块。

## 构建与发布

### 前置

- Node.js（本机 v22），依赖已装在 `ledong-exhibition/node_modules`；缺失时在该目录执行 `npm i`。
  依赖以 `package-lock.json` 为准（npm）；同目录的 `pnpm-lock.yaml`、`pnpm-workspace.yaml` 是历史遗留，可忽略。
- 只替换同名文件（图片、模型、`icon.ico` 文件名不变）时**不需要重新构建**，推资源文件即可；
  新增或改名的资源要改源码里的引用再构建，因为引用路径内联在 `index.html` 里。

### 构建：一条命令

```powershell
pwsh -File D:\AI\网页\tools\build.ps1
```

脚本串起整条链路并自检：`vite build` → `html-inline` 覆盖根目录 `index.html` → 自动补回 favicon 行 →
校验（无 BOM、LF 换行、内联脚本过 `node --check`），最后打印前后 SHA256，产物没变化时会提示
`byte-identical`。PowerShell 7 与 Windows PowerShell 5.1 下都验证过，结果一致
（脚本刻意写成纯 ASCII，不受脚本文件编码影响）。

它直接调用 `ledong-exhibition/node_modules/.bin/` 里的 `vite` / `html-inline`，不经过 `npx`：
本机 `D:\nodejs\npx.ps1` 这个 shim 在被 `&` 调用时会算错参数偏移（把 `npx vite build` 变成 `px vite build`），
直接调本地 bin 既绕开这个坑，也保证版本与 `package-lock.json` 一致。

### 手动等价步骤（脚本不可用时）

```powershell
# 1) 打包源码 → ledong-exhibition/dist/
cd D:\AI\网页\ledong-exhibition
npx vite build                    # 注意：npx 必须在命令位置调用，不要写成 & npx …

# 2) 内联 JS/CSS，直接覆盖线上文件（--ignore-images 保证图片仍走相对路径外链）
npx html-inline -i dist/index.html -o ..\index.html -b dist --ignore-images

# 3) 补 favicon 行：构建模板里没有这一行，内联后必须手工加回，否则标签页图标丢失
cd D:\AI\网页
$enc   = New-Object System.Text.UTF8Encoding($false)
$html  = [IO.File]::ReadAllText('index.html', $enc)
$title = '<title>白沙河谷生态博物馆 - 小河谷，大文化</title>'
$link  = '<link rel="icon" type="image/x-icon" href="./icon.ico" />'
if (-not $html.Contains($link)) {
  [IO.File]::WriteAllText('index.html', $html.Replace($title, $title + "`n    " + $link), $enc)
}
```

### 构建后校验（`tools/build.ps1` 已自动执行）

```powershell
# 无 BOM：前 3 字节应是 3C 21 64（<!d），不能是 EF BB BF
$b = [IO.File]::ReadAllBytes('index.html')
($b[0..2] | ForEach-Object { $_.ToString('X2') }) -join ' '

# 行尾：CRLF 数应为 0（仓库统一 LF）
$t = [Text.Encoding]::UTF8.GetString($b)
[regex]::Matches($t, "`r`n").Count

# 内联脚本语法：抽出 <script type="module"> 内容交给 node --check，应无输出
$enc = New-Object System.Text.UTF8Encoding($false)
$m   = [regex]::Match($t, '(?s)<script type="module"[^>]*>(.*?)</script>')
$tmp = Join-Path $env:TEMP 'inline-check.js'
[IO.File]::WriteAllText($tmp, $m.Groups[1].Value, $enc)
node --check $tmp
```

更省事的等价校验：`index.html` 里的内联脚本应与 `ledong-exhibition/dist/assets/index-*.js` 内容一致，
内联样式应与同名 `.css` 一致。

### 发布

```powershell
cd D:\AI\网页
git add index.html img glb icon.ico tools README.md   # 按需增删
git commit -m "说明这次改了什么"
git push origin main
```

推送后 GitHub Pages 自动更新 <https://hiadou.github.io/3d-model-viewer/>。

### 发布前自测

1. 起本地服务，避免 `file://` 下的差异：仓库根目录执行 `python -m http.server 9998`，
   打开 <http://127.0.0.1:9998/index.html>。
2. 导航 6 项逐个点：高亮跟随；「园内景观」11 张、「馆内景观」17 张。
3. 景观区筛选条计数：全部 28 / 园内 11 / 馆内 17；点图能开大图，带 `description` 的图能出说明栏。
4. 数字藏品页：6 张卡片；分类计数（低温陶 1、陶器 1、织绣 1、骨角牙器 1、金属器（青铜）1、铁器 1）。
5. 3D 展陈 5 个模型都能加载（iframe），切换标签不白屏。
6. 窄窗口（手机宽度）下顶部导航不遮挡正文。

## 图片与素材规范

- 图片统一用 `.webp`；新增图片沿用现有命名（中文名即可，引用时整段百分号编码）。
- 藏品图文件名即「名称：…；编号：…；类别：…；年代：….webp」，与 `collectionItems.image` 一一对应。
- `tools/webp_migrate.py` 用于把 `img/collections/` 的 PNG 迁到 WebP（无损 VP8L，回读核对后改写引用）：

  ```powershell
  D:\miniconda3\python.exe tools\webp_migrate.py --dry-run     # 只看计划
  D:\miniconda3\python.exe tools\webp_migrate.py               # 转换 + 改写 + 提交
  D:\miniconda3\python.exe tools\webp_migrate.py --push        # 顺带推送
  ```

  ⚠️ 该脚本改的是**产物** `index.html`，不会动源码；跑完要把同样的后缀改动同步到
  `src/App.tsx` 的 `collectionItems.image`，否则下次构建会把改动“回滚”。
- 3D 模型页各自引用同一份 `glb/background.m4a`（AAC，装在 MP4 容器里才被 Chrome/Firefox 认）。

### 新增一件数字藏品

1. 图片按命名规范放进 `img/collections/`（`.webp`）。
2. 在 `src/App.tsx` 的 `collectionItems` 末尾追加一条（`id` / `title` / `category` / `dynasty` / `image` / `description`），
   `image` 写百分号编码后的路径。取编码可用：
   `python -c "from urllib.parse import quote; print(quote('名称：…；编号：FL0000；类别：陶器；年代：清.webp'))"`
3. 若引入新分类或新年份，同步 `collectionCategories` / `collectionDynasties`，否则筛选条里选不到。
4. 走上面的「构建三步」，跑自测，`git add img index.html` 后提交推送。

## 已知问题与风险

1. **源码已于 2026-09-30 纳入版本管理**（此前 `.gitignore` 忽略了整个 `ledong-exhibition/`，
   仓库里只有产物没有源码）。现在 `.gitignore` 只忽略该目录下的 `node_modules/`、`dist/`、
   `.parcel-cache/`、`*.tsbuildinfo` 等产物；其余源码、配置、`package-lock.json` 都在库里。
   仍不要忘记：改了源码必须重新构建并提交 `index.html`，否则线上不会变。
2. **`npm run build` 目前跑不通**：脚本是 `tsc -b && vite build`，而 `tsconfig.json` 的项目引用配置在
   TypeScript 6 下报 `TS5101`（`baseUrl` 已废弃）、`TS6306` / `TS6310`（引用项目需 `composite: true` 且不能禁用 emit）。
   现状是直接用 `npx vite build`（只打包、不做类型检查）。想单独做类型检查：
   `npx tsc --noEmit -p tsconfig.app.json --ignoreDeprecations 6.0`，已知 `src/components/ui/` 下未使用的
   脚手架组件（`calendar.tsx`、`resizable.tsx`、`sonner.tsx`）存在既有报错。
3. **不要手改 `index.html` 里的压缩 JS**：历史上多次直接手改产物（加藏品、改图片后缀、改分类），
   导致源码与线上漂移——线上有 6 件藏品、源码只有 3 件，分类列表也少「陶器」「铁器」。
   2026-09-30 已把源码对齐线上，并让 `index.html` 等于「源码构建产物」本身；以后改内容请改源码再构建。
4. **3D 页面的缓存戳**：`models3d` 里用的是 `./glb/xxx.html?v=4`，改动 `glb/*.html` 或模型后请把 `v` 加一，
   否则用户浏览器可能继续使用缓存里的旧页面。
5. **字体未引入 webfont**：中文按 `Noto Sans SC / Source Han Serif SC / system-ui` 回退到系统字体，
   不同设备观感会有差异；如需一致外观要自带字体文件。

## 相关文档

- `CLAUDE.md`：本仓库给 AI 助手的行为约定（思考先行、最小改动、Windows 批处理编码规则等）。
- `备份/`：历史版本、旧版 3D 展示页、联展方案等（未纳入 Git）。
