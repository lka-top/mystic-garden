#!/bin/bash
# ============================================================
# 神秘花园 · 图片资源一键优化脚本
# 功能：PNG → WebP 批量转换 + 清理废弃图片 + favicon 压缩
# 原理：WebP 使用有损预测编码，在视觉无损前提下压缩 70%~90%
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$PROJECT_ROOT/public/images"
PUBLIC_DIR="$PROJECT_ROOT/public"

echo "=========================================="
echo "🌸 神秘花园 · 图片优化脚本启动"
echo "=========================================="

# ---- 第 0 步：检查并安装依赖工具 ----
echo ""
echo "📦 [0/5] 检查图片处理工具..."
if ! command -v cwebp &> /dev/null || ! command -v convert &> /dev/null; then
    echo "   → 未检测到 cwebp / imagemagick，正在安装..."
    sudo apt install -y webp imagemagick
    echo "   ✅ 工具安装完成"
else
    echo "   ✅ cwebp 和 imagemagick 已就绪"
fi

# ---- 第 1 步：转换主要大图 PNG → WebP ----
echo ""
echo "🖼️  [1/5] 转换首页 Banner 与背景图 → WebP..."

convert_to_webp() {
    local src="$1"
    local quality="${2:-85}"
    local filename=$(basename "$src")
    local name="${filename%.*}"
    local dir=$(dirname "$src")
    local dest="$dir/$name.webp"

    if [ ! -f "$src" ]; then
        echo "   ⏭️  跳过（文件不存在）: $filename"
        return
    fi

    if [ -f "$dest" ]; then
        echo "   ⏭️  跳过（已存在 WebP）: $name.webp"
        return
    fi

    local src_size=$(du -h "$src" | cut -f1)
    cwebp -q "$quality" "$src" -o "$dest" -quiet
    local dest_size=$(du -h "$dest" | cut -f1)
    echo "   ✅ $filename ($src_size) → $name.webp ($dest_size)"
}

# 首页白天 Banner（最大的一张）
convert_to_webp "$IMG_DIR/banner-light.png" 85

# 首页暗黑 Banner
convert_to_webp "$IMG_DIR/banner-night.png" 85

# 全站底层背景纹理
convert_to_webp "$IMG_DIR/bg-main.png" 85

# 头像（保留较高质量）
convert_to_webp "$IMG_DIR/avatar.png" 90

# 根目录头像副本
convert_to_webp "$PUBLIC_DIR/avatar.png" 90

# ---- 第 2 步：压缩 favicon ----
echo ""
echo "🔖 [2/5] 压缩 favicon（848KB → ~10KB）..."

if [ -f "$PUBLIC_DIR/favicon.png" ] && [ ! -f "$PUBLIC_DIR/favicon-original.png" ]; then
    cp "$PUBLIC_DIR/favicon.png" "$PUBLIC_DIR/favicon-original.png"
    convert "$PUBLIC_DIR/favicon.png" -resize 64x64 -quality 85 "$PUBLIC_DIR/favicon-optimized.png"
    mv "$PUBLIC_DIR/favicon-optimized.png" "$PUBLIC_DIR/favicon.png"
    new_size=$(du -h "$PUBLIC_DIR/favicon.png" | cut -f1)
    echo "   ✅ favicon.png 已压缩至 $new_size（原图备份为 favicon-original.png）"
else
    echo "   ⏭️  跳过（已处理过或文件不存在）"
fi

# ---- 第 3 步：清理确认不再使用的废弃图片 ----
echo ""
echo "🧹 [3/5] 检查并清理废弃图片..."

cleaned=0
for candidate in "banner.png" "banner.jpg" "148521465_p1.png" "bg1.png"; do
    filepath="$IMG_DIR/$candidate"
    if [ ! -f "$filepath" ]; then
        continue
    fi

    # 检查代码中是否还有引用（排除 seed.ts 中的种子数据引用和本脚本自身）
    refs=$(grep -rn "$candidate" "$PROJECT_ROOT/app/" --include="*.vue" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)

    if [ "$refs" -eq 0 ]; then
        file_size=$(du -h "$filepath" | cut -f1)
        # 移动到备份目录而非直接删除
        mkdir -p "$IMG_DIR/.backup"
        mv "$filepath" "$IMG_DIR/.backup/$candidate"
        echo "   🗑️  $candidate ($file_size) → 已移至 .backup/（代码中无引用）"
        cleaned=$((cleaned + 1))
    else
        echo "   ⏭️  保留 $candidate（代码中仍有 $refs 处引用）"
    fi
done

if [ "$cleaned" -eq 0 ]; then
    echo "   ✅ 没有需要清理的废弃图片"
fi

# ---- 第 4 步：更新代码中的图片引用 ----
echo ""
echo "✏️  [4/5] 更新代码中的图片引用（.png → .webp）..."

update_ref() {
    local file="$1"
    local old="$2"
    local new="$3"

    if grep -q "$old" "$file" 2>/dev/null; then
        sed -i "s|$old|$new|g" "$file"
        echo "   ✅ $(basename "$file"): $old → $new"
    fi
}

HERO="$PROJECT_ROOT/app/components/layout/HeroBanner.vue"
LAYOUT="$PROJECT_ROOT/app/layouts/default.vue"
PROFILE="$PROJECT_ROOT/app/components/layout/ProfileCard.vue"
ABOUT="$PROJECT_ROOT/app/pages/about.vue"
NUXT_CONFIG="$PROJECT_ROOT/nuxt.config.ts"

# Banner 图片引用
update_ref "$HERO" "/images/banner-light.png" "/images/banner-light.webp"
update_ref "$HERO" "/images/banner-night.png" "/images/banner-night.webp"
update_ref "$HERO" "/images/banner.png" "/images/banner.webp"

# 全站背景
update_ref "$LAYOUT" "/images/bg-main.png" "/images/bg-main.webp"

# 头像
update_ref "$PROFILE" "/images/avatar.png" "/images/avatar.webp"
update_ref "$ABOUT" "/images/avatar.png" "/images/avatar.webp"
update_ref "$NUXT_CONFIG" "/images/avatar.png" "/images/avatar.webp"

# ---- 第 5 步：输出优化报告 ----
echo ""
echo "=========================================="
echo "📊 [5/5] 优化完成！资源体积对比："
echo "=========================================="

total_before=0
total_after=0

report_line() {
    local name="$1"
    local old_file="$2"
    local new_file="$3"

    if [ -f "$new_file" ]; then
        local new_kb=$(du -k "$new_file" | cut -f1)
        total_after=$((total_after + new_kb))

        if [ -f "$old_file" ]; then
            local old_kb=$(du -k "$old_file" | cut -f1)
            total_before=$((total_before + old_kb))
            local ratio=$((100 - new_kb * 100 / old_kb))
            printf "   %-25s %6sKB → %6sKB  (-%d%%)\n" "$name" "$old_kb" "$new_kb" "$ratio"
        else
            printf "   %-25s           %6sKB  (新文件)\n" "$name" "$(du -k "$new_file" | cut -f1)"
        fi
    fi
}

report_line "banner-light" "$IMG_DIR/banner-light.png" "$IMG_DIR/banner-light.webp"
report_line "banner-night" "$IMG_DIR/banner-night.png" "$IMG_DIR/banner-night.webp"
report_line "bg-main" "$IMG_DIR/bg-main.png" "$IMG_DIR/bg-main.webp"
report_line "avatar" "$IMG_DIR/avatar.png" "$IMG_DIR/avatar.webp"

echo ""
echo "🎉 全部优化完成！刷新浏览器 http://localhost:3000 体验飞速加载吧！"
echo "💡 提示：旧的 PNG 原图仍保留在原位，确认无误后可手动删除以释放空间。"
echo "💡 提示：废弃图片已移至 public/images/.backup/ 目录，确认后可删除。"
echo ""
