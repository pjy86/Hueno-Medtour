type Props = { src: string }

/**
 * Hero 背景图组件：
 * - 移动端：最小高度 520px，使用 object-cover 聚焦主体
 * - 桌面端：保持原有比例（h-auto）
 */
export default function HeroBackgroundImage({ src }: Props) {
  return (
    <div className="relative min-h-[520px] md:min-h-0 md:h-auto overflow-hidden">
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover md:relative md:inset-auto md:h-auto md:object-contain pointer-events-none select-none"
        sizes="(max-width: 1400px) 100vw, 1400px"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
