type Props = { src: string }

/**
 * Hero 背景图组件：
 * - 宽度：100%（与 max-w-site 内容区一致）
 * - 高度：auto（按图片自身比例）
 * - 这样横向完整展示，竖向随浏览器缩放自然变化
 */
export default function HeroBackgroundImage({ src }: Props) {
  return (
    <img
      src={src}
      alt=""
      className="block w-full h-auto pointer-events-none select-none"
      sizes="(max-width: 1400px) 100vw, 1400px"
      decoding="async"
      fetchPriority="high"
    />
  )
}
