/**
 * Hero 画框：
 * - 宽度：max-w-site (1400px) 居中，与内容区一致
 * - 高度：由内部图片 h-auto 决定（不再用 padding-bottom 强制比例）
 * - 溢出隐藏，确保图片不会超出
 */
export const heroFrameHomeClass =
  'relative w-full max-w-site mx-auto overflow-hidden'

/** 子页面 Hero 画框，同逻辑 */
export const heroFrameSubpageClass =
  'relative w-full max-w-site mx-auto overflow-hidden'
