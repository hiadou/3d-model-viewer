#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""藏品图 PNG → WebP 迁移。

把 img/collections/ 下的 PNG 藏品图转成 WebP，同步改写 index.html 中
URL 编码的引用路径，跑 node --check，然后提交（加 --push 才推送）。

必须用 base 环境运行，不要用冻结的 tf-gpu：

    D:\\miniconda3\\python.exe tools\\webp_migrate.py --dry-run
    D:\\miniconda3\\python.exe tools\\webp_migrate.py
    D:\\miniconda3\\python.exe tools\\webp_migrate.py --push

约定：
  * 已有同名 .webp  → 直接沿用，不重压（外部工具压好的文件优先）
  * 只有 .png       → 用 Pillow 按 --quality 压缩
  * 脚本不会自动 pip install（遵循 D:\\AI\\CLAUDE.md 的环境治理规则）
"""

import argparse
import re
import os
import subprocess
import sys
import tempfile
from urllib.parse import quote, unquote

INDEX = 'index.html'
IMG_DIR = 'img/collections'
REF_RE = re.compile(r'\./img/collections/[\w%./()\-]+')
CODE_RE = re.compile(r'编号：([A-Za-z]{1,3}\d+)')
SCRIPT_RE = re.compile(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', re.S)

_reconfigure = getattr(sys.stdout, 'reconfigure', None)
if _reconfigure:
    _reconfigure(errors='replace')


# --------------------------------------------------------------------------
# 小工具
# --------------------------------------------------------------------------

def die(msg):
    print('错误：' + msg, file=sys.stderr)
    sys.exit(1)


def human(n):
    return '%.1f KB' % (n / 1024.0) if n < 1048576 else '%.2f MB' % (n / 1048576.0)


def git(*args, check=True):
    p = subprocess.run(['git', '-c', 'core.quotepath=false'] + list(args),
                       capture_output=True, text=True,
                       encoding='utf-8', errors='replace')
    if check and p.returncode != 0:
        die('git %s 失败：%s' % (' '.join(args), (p.stderr or p.stdout).strip()))
    return p


def read_index():
    # newline='' 保证不翻译换行符，原样保留 LF/CRLF
    with open(INDEX, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def write_index(text):
    with open(INDEX, 'w', encoding='utf-8', newline='') as f:
        f.write(text)


def ref_path(name_without_ext, ext):
    """按 index.html 的编码风格生成引用路径（非 ASCII 全部百分号编码）。"""
    return './img/collections/' + quote(name_without_ext, safe='') + ext


# --------------------------------------------------------------------------
# 压缩 / 校验
# --------------------------------------------------------------------------

def has_meaningful_alpha(im, threshold):
    """判断 alpha 通道是否真的有用。

    全 255（完全不透明）或仅在 threshold 以上轻微波动（如 253/255，肉眼不可见）
    都算无用，可以降成 RGB 省体积。
    """
    if im.mode == 'P':
        im = im.convert('RGBA')
    if 'A' not in im.getbands():
        return False, None
    lo, hi = im.getchannel('A').getextrema()
    return lo < threshold, (lo, hi)


def compress(png, webp, quality, alpha_threshold):
    from PIL import Image
    with Image.open(png) as src:
        keep_alpha, rng = has_meaningful_alpha(src, alpha_threshold)
        src.convert('RGBA' if keep_alpha else 'RGB').save(
            webp, 'WEBP', quality=quality, method=6)
    return keep_alpha, rng


def validate(webp, png):
    """确认产出的确是 webp，且尺寸与源图一致。"""
    with open(webp, 'rb') as f:
        head = f.read(12)
    if head[:4] != b'RIFF' or head[8:12] != b'WEBP':
        die('%s 不是合法的 webp 文件' % webp)
    if png:
        from PIL import Image
        with Image.open(webp) as w, Image.open(png) as s:
            if w.size != s.size:
                die('%s 尺寸 %s 与源图 %s 不一致' % (webp, w.size, s.size))


# --------------------------------------------------------------------------
# 检查
# --------------------------------------------------------------------------

def _node_check_one(node, code, suffix):
    fd, tmp = tempfile.mkstemp(suffix=suffix)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(code)
        return subprocess.run([node, '--check', tmp], capture_output=True,
                              text=True, encoding='utf-8', errors='replace')
    finally:
        os.unlink(tmp)


def node_check(text):
    """把 text 里的内联 <script> 抽出来交给 node --check。"""
    import shutil
    node = shutil.which('node')
    if not node:
        print('  ! 未找到 node，跳过语法检查')
        return False
    blocks = SCRIPT_RE.findall(text)
    if not blocks:
        print('  ! index.html 中没有内联 script，跳过')
        return False
    for i, code in enumerate(blocks):
        # 先当普通脚本查；含 import/export 的话需要 .mjs
        p = _node_check_one(node, code, '.js')
        if p.returncode != 0:
            p = _node_check_one(node, code, '.mjs')
        if p.returncode != 0:
            die('内联 script #%d 语法检查未通过：\n%s'
                % (i, p.stderr.strip()))
    print('  node --check 通过（%d 段内联脚本）' % len(blocks))
    return True


def verify_refs(text, label=''):
    """确认 text 里所有藏品图引用都能在磁盘上找到。

    引用路径是百分号编码的，必须先 unquote 再比对磁盘上的中文文件名。
    """
    missing = []
    for m in REF_RE.finditer(text):
        p = unquote(m.group(0))
        if not os.path.exists(p):
            missing.append(p)
    if missing:
        die('%sindex.html 中存在失效的藏品图引用：\n  ' % label
            + '\n  '.join(missing))
    print('  %s藏品图引用全部解析成功' % label)


# --------------------------------------------------------------------------
# 主流程
# --------------------------------------------------------------------------

def collect_pairs(img_dir):
    """返回 [(png, webp, 已有webp?)...]，png 可能为 None（只有 webp）。"""
    pairs, orphan_webp = [], []
    for fn in sorted(os.listdir(img_dir)):
        if fn.lower().endswith('.png'):
            png = os.path.join(img_dir, fn)
            webp = os.path.join(img_dir, fn[:-4] + '.webp')
            pairs.append((png, webp, os.path.exists(webp)))
        elif fn.lower().endswith('.webp'):
            base = fn[:-5]
            if not os.path.exists(os.path.join(img_dir, base + '.png')):
                orphan_webp.append(os.path.join(img_dir, fn))
    return pairs, orphan_webp


def main():
    ap = argparse.ArgumentParser(description='藏品图 PNG → WebP 迁移')
    ap.add_argument('--quality', type=int, default=80,
                    help='webp 质量，默认 80（仅对需要压缩的 png 生效）')
    ap.add_argument('--alpha-threshold', type=int, default=250,
                    help='alpha 最小值低于此值才保留透明通道，默认 250')
    ap.add_argument('--img-dir', default=IMG_DIR, help='图片目录，默认 ' + IMG_DIR)
    ap.add_argument('--dry-run', action='store_true',
                    help='只报告将要做的改动，不写文件、不碰 git')
    ap.add_argument('--include-orphans', action='store_true',
                    help='同时转换未被 index.html 引用的 png')
    ap.add_argument('--keep-source', action='store_true',
                    help='保留原 png（默认转换成功后删除，实现替换而非并存）')
    ap.add_argument('--push', action='store_true',
                    help='提交后再 git push')
    args = ap.parse_args()

    # ---- 前置检查 ---------------------------------------------------------
    if os.path.basename(sys.executable).lower().startswith('python') and \
            'tf-gpu' in sys.executable:
        print('注意：当前解释器在冻结环境 tf-gpu 内（%s）。' % sys.executable)
        print('      本脚本只读取该环境的 Pillow，不做任何安装；')
        print('      如要稳妥，请改用 D:\\miniconda3\\python.exe 运行。\n')

    root = git('rev-parse', '--show-toplevel').stdout.strip()
    if os.path.normcase(os.getcwd()) != os.path.normcase(root):
        die('请在仓库根目录运行（当前 %s，仓库根 %s）' % (os.getcwd(), root))
    if not os.path.isfile(INDEX):
        die('找不到 ' + INDEX)
    if not os.path.isdir(args.img_dir):
        die('找不到图片目录 ' + args.img_dir)

    print('仓库：%s' % root)
    print('模式：%s\n' % ('DRY-RUN（不落盘）' if args.dry_run else '实际执行'))

    # 先确认改动前 index.html 的引用本来就是好的，避免带着旧问题往下走
    verify_refs(read_index(), '预检：')

    # ---- 1. 找出待处理文件 ------------------------------------------------
    pairs, orphan_webp = collect_pairs(args.img_dir)
    if not pairs:
        print('没有发现 png 藏品图，无需处理。')
        if orphan_webp:
            print('（目录内已有 %d 个 webp，无对应 png）' % len(orphan_webp))
        return

    # 先分类：只处理 index.html 真正引用了的 png，避免为孤儿文件压出多余的 webp
    text = read_index()
    todo, reuse, skipped = [], [], []
    for png, webp, had_webp in pairs:
        base = os.path.basename(png)[:-4]
        n = text.count(ref_path(base, '.png'))
        if n == 0 and not args.include_orphans:
            skipped.append(base)
            continue
        (reuse if had_webp else todo).append((png, webp, n))

    work = len(todo) + len(reuse)
    print('发现 png %d 个：%d 个需压缩，%d 个已有同名 webp 可直接沿用'
          % (len(pairs), len(todo), len(reuse)))
    if skipped:
        print('! 以下 %d 个文件未被 index.html 引用，本次跳过（加 --include-orphans 可强制处理）：'
              % len(skipped))
        for s in skipped:
            print('    ' + os.path.basename(s)[-20:])
    if not work:
        print('\n没有需要处理的文件。')
        return

    # 先确认 Pillow 可用再动手；绝不自动 pip install
    if todo and not args.dry_run:
        try:
            import PIL.Image  # noqa: F401
        except ImportError:
            die('缺少 Pillow。请改用 D:\\miniconda3\\python.exe 运行；'
                '不要在冻结的 tf-gpu 环境里安装（见 D:\\AI\\CLAUDE.md 环境治理规则）')

    # ---- 2. 压缩 ----------------------------------------------------------
    sizes_before = sizes_after = 0
    print('\n[1/4] 压缩')
    for png, webp, _ in reuse:
        b, a = os.path.getsize(png), os.path.getsize(webp)
        sizes_before += b
        sizes_after += a
        print('  沿用  %s  %s → %s' % (os.path.basename(webp)[-14:],
                                     human(b), human(a)))
    for png, webp, _ in todo:
        if args.dry_run:
            print('  待压  %s  %s' % (os.path.basename(png)[-14:],
                                     human(os.path.getsize(png))))
            continue
        keep_alpha, rng = compress(png, webp, args.quality,
                                   args.alpha_threshold)
        b, a = os.path.getsize(png), os.path.getsize(webp)
        sizes_before += b
        sizes_after += a
        note = 'RGBA' if keep_alpha else 'RGB'
        if keep_alpha and rng:
            note += ' (alpha %d-%d)' % rng
        print('  压缩  %s  %s → %s  %s  q%d'
              % (os.path.basename(png)[-14:], human(b), human(a), note,
                 args.quality))
        validate(webp, png)

    if not args.dry_run and sizes_before:
        saved = sizes_before - sizes_after
        print('  合计 %s → %s，减少 %s (%.0f%%)'
              % (human(sizes_before), human(sizes_after), human(saved),
                 100.0 * saved / sizes_before))

    # ---- 3. 改写 index.html 引用 ------------------------------------------
    print('\n[2/4] 改写 %s 引用' % INDEX)
    replaced, unref = [], []
    for png, webp, n in todo + reuse:
        base = os.path.basename(png)[:-4]
        old, new = ref_path(base, '.png'), ref_path(base, '.webp')
        if n:
            text = text.replace(old, new)
            print('  %s  %d 处' % (os.path.basename(base)[-14:], n))
        else:
            unref.append(base)          # --include-orphans 才会走到这里
        replaced.append(base)
    if not replaced:
        print('  index.html 中没有需要改写的 .png 引用')
    if unref:
        print('  ! 以下文件未被引用，只转格式不改引用：')
        for u in unref:
            print('    ' + os.path.basename(u)[-20:])

    # ---- 4. 校验（全部在写盘之前完成，失败就不会留下半成品）---------------
    print('\n[3/4] 校验')
    node_check(text)
    if args.dry_run:
        print('  DRY-RUN：跳过新引用的落盘校验（webp 尚未生成）')
        if replaced and not args.keep_source:
            print('  将会删除 %d 个被替换的 png' % len(replaced))
        print('\n完成（未做任何改动）。')
        return
    verify_refs(text)

    if text != read_index():
        write_index(text)
        print('  已写回 %s（UTF-8 无 BOM，换行符原样保留）' % INDEX)

    # ---- 删掉被替换的 png（校验都过了才动手）------------------------------
    if args.keep_source:
        print('  --keep-source：保留原 png')
    else:
        removed = 0
        for base in replaced:
            png = os.path.join(args.img_dir, base + '.png')
            if os.path.exists(png):
                os.remove(png)
                removed += 1
        print('  已删除 %d 个被替换的 png' % removed)

    # ---- 5. 提交 ----------------------------------------------------------
    print('\n[4/4] 提交与推送')

    # 只暂存本脚本负责的路径，避免卷入 .claude/ 等无关文件
    git('add', '-A', '--', args.img_dir, INDEX)
    staged = git('diff', '--cached', '--name-only').stdout.strip()
    if not staged:
        print('  没有需要提交的改动')
        return
    print('  已暂存 %d 个文件' % len(staged.splitlines()))

    codes = []
    for png, _, _ in todo + reuse:
        m = CODE_RE.search(os.path.basename(png))
        if m:
            codes.append(m.group(1))
    rewrote = len(replaced) - len(unref)
    title = '图片优化：%d 件藏品图改用 webp' % len(replaced)
    if rewrote:
        title += ' 并同步引用'
    body = ['%s 合计 %s → %s' % (INDEX, human(sizes_before), human(sizes_after))
            if sizes_before else '']
    if codes:
        body.append('涉及：' + '、'.join(codes))
    body.append('由 tools/webp_migrate.py 生成。')
    msg = title + '\n\n' + '\n'.join(b for b in body if b) + \
        '\n\nCo-Authored-By: Claude Code <noreply@anthropic.com>'
    git('commit', '-q', '-m', msg)
    print('  已提交：' + git('log', '--oneline', '-1').stdout.strip())

    # 推送是显式的：不带 --push 一律只留在本地
    if not args.push:
        print('  未推送。确认 diff 后执行：')
        print('    git push origin ' +
              git('rev-parse', '--abbrev-ref', 'HEAD').stdout.strip())
        return
    branch = git('rev-parse', '--abbrev-ref', 'HEAD').stdout.strip()
    p = git('push', 'origin', branch)
    print('  ' + (p.stderr.strip() or p.stdout.strip()))
    print('\n完成。')


if __name__ == '__main__':
    main()
