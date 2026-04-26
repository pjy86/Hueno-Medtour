import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default content - only create if not exists
  const contents = [
    // Hero section
    { key: 'hero_title', en: 'Medical Travel to China Made Simple', zh: '来华就医就这么简单', id_text: 'Perjalanan Medis ke China Dibuat Mudah' },
    { key: 'hero_subtitle', en: 'Professional · Safe · Cost-effective · Caring', zh: '专业 · 安全 · 高性价比 · 贴心服务', id_text: 'Profesional · Aman · Terjangkau · Penuh Perhatian' },
    { key: 'hero_cta_text', en: 'Contact Us Now', zh: '立即咨询', id_text: 'Hubungi Kami Sekarang' },

    // Features section
    { key: 'feature_1_title', en: 'Professional', zh: '专业', id_text: 'Profesional' },
    { key: 'feature_1_subtitle', en: '', zh: '', id_text: '' },
    { key: 'feature_1_desc', en: 'Professional medical team with extensive experience', zh: '专业的医疗团队，经验丰富', id_text: 'Tim medis profesional dengan pengalaman luas' },
    { key: 'feature_2_title', en: 'Safe', zh: '安全', id_text: 'Aman' },
    { key: 'feature_2_subtitle', en: '', zh: '', id_text: '' },
    { key: 'feature_2_desc', en: 'Comprehensive safety guarantee system', zh: '完善的安全保障体系', id_text: 'Sistem jaminan keamanan menyeluruh' },
    { key: 'feature_3_title', en: 'Cost-effective', zh: '高性价比', id_text: 'Terjangkau' },
    { key: 'feature_3_subtitle', en: '', zh: '', id_text: '' },
    { key: 'feature_3_desc', en: 'Transparent and reasonable fees', zh: '费用透明合理', id_text: 'Biaya transparan dan wajar' },

    // Services section - up to 8 services
    { key: 'services_description', en: '<p>Our comprehensive medical tourism services are designed to make your journey to China seamless and stress-free.</p>', zh: '<p>我们 comprehensive 全面医疗服务设计让您的中国就医之旅轻松无忧。</p>', id_text: '<p>Layanan pariwisata medis komprehensif kami dirancang untuk membuat perjalanan Anda ke China mudah dan tanpa stres.</p>' },
    { key: 'service_1_desc', en: 'Expert diagnosis and treatment planning', zh: '专家诊断与治疗方案', id_text: 'Diagnosis ahli dan perencanaan perawatan' },
    { key: 'service_2_desc', en: 'Streamlined admission procedures', zh: '便捷的入院手续', id_text: 'Prosedur masuk yang streamlined' },
    { key: 'service_3_desc', en: 'Comfortable stay near medical facilities', zh: '临近医疗机构的舒适住宿', id_text: 'Penginapan nyaman dekat fasilitas medis' },
    { key: 'service_4_desc', en: 'Continous support after treatment', zh: '治疗后的持续跟进', id_text: 'Dukungan berkelanjutan setelah perawatan' },
    { key: 'service_5_desc', en: 'Service 5 description', zh: '服务5描述', id_text: 'Deskripsi layanan 5' },
    { key: 'service_6_desc', en: 'Service 6 description', zh: '服务6描述', id_text: 'Deskripsi layanan 6' },
    { key: 'service_7_desc', en: 'Service 7 description', zh: '服务7描述', id_text: 'Deskripsi layanan 7' },
    { key: 'service_8_desc', en: 'Service 8 description', zh: '服务8描述', id_text: 'Deskripsi layanan 8' },

    // Why Choose China section
    { key: 'why_china_title', en: 'Why Choose China', zh: '为什么选择中国', id_text: 'Mengapa Memilih China' },
    { key: 'why_china_1_title', en: 'Advanced Technology', zh: '先进的技术', id_text: 'Teknologi Canggih' },
    { key: 'why_china_1_desc', en: 'State-of-the-art medical equipment and cutting-edge treatment methods.', zh: '最先进的医疗设备和尖端的治疗方法。', id_text: 'Peralatan medis mutakhir dan metode perawatan canggih.' },
    { key: 'why_china_2_title', en: 'Expert Doctors', zh: '专家医生', id_text: 'Dokter Ahli' },
    { key: 'why_china_2_desc', en: 'Experienced medical professionals with international training.', zh: '具有国际培训经验的医疗专业人员。', id_text: 'Profesional medis berpengalaman dengan pelatihan internasional.' },
    { key: 'why_china_3_title', en: 'Affordable Care', zh: '费用实惠', id_text: 'Perawatan Terjangkau' },
    { key: 'why_china_3_desc', en: 'High quality treatment at a fraction of the cost compared to Western countries.', zh: '与西方国家相比，成本很小一部分的高质量治疗。', id_text: 'Perawatan berkualitas tinggi dengan biaya yang sangat terjangkau.' },
    { key: 'why_china_4_title', en: 'Rich Culture', zh: '丰富的文化', id_text: 'Budaya Kaya' },
    { key: 'why_china_4_desc', en: 'Experience China rich history and culture while receiving treatment.', zh: '在接受治疗的同时体验中国丰富的历史和文化。', id_text: 'Rasakan sejarah dan budaya China yang kaya sambil menerima perawatan.' },

    // Footer
    { key: 'footer_address', en: '123 Medical Center Road, Chaoyang District, Beijing, China', zh: '中国北京市朝阳区医疗中心路123号', id_text: 'Jalan Pusat Medis 123, Distrik Chaoyang, Beijing, Tiongkok' },
    { key: 'footer_phone', en: '400-888-8888', zh: '400-888-8888', id_text: '400-888-8888' },

    // Top bar (global strip above main header)
    { key: 'topbar_email', en: 'huenomedtour@163.com', zh: 'huenomedtour@163.com', id_text: 'huenomedtour@163.com' },
    { key: 'topbar_phone', en: '+86 13244819680', zh: '+86 13244819680', id_text: '+86 13244819680' },
    { key: 'topbar_social_tiktok_url', en: '', zh: '', id_text: '' },
    { key: 'topbar_social_ins_url', en: '', zh: '', id_text: '' },
    { key: 'topbar_social_facebook_url', en: '', zh: '', id_text: '' },
  ]

  // Only create content if it doesn't exist (to preserve user edits)
  for (const content of contents) {
    const existing = await prisma.content.findUnique({
      where: { key: content.key }
    })
    if (!existing) {
      await prisma.content.create({
        data: content
      })
      console.log(`Created content: ${content.key}`)
    } else {
      console.log(`Skipped content (already exists): ${content.key}`)
    }
  }

  // Create default images - only if not exists
  const images = [
    { key: 'hero_bg', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80' },
    { key: 'logo_header', url: null },
    { key: 'logo_footer', url: null },
    { key: 'feature_icon_1', url: null },
    { key: 'feature_icon_2', url: null },
    { key: 'feature_icon_3', url: null },
    { key: 'service_image_1', url: null },
    { key: 'service_image_2', url: null },
    { key: 'service_image_3', url: null },
    { key: 'service_image_4', url: null },
    { key: 'service_image_5', url: null },
    { key: 'service_image_6', url: null },
    { key: 'service_image_7', url: null },
    { key: 'service_image_8', url: null },
    { key: 'testimonial_1', url: null },
    { key: 'testimonial_2', url: null },
    { key: 'testimonial_3', url: null },
    { key: 'testimonial_4', url: null },
    { key: 'testimonial_5', url: null },
    { key: 'testimonial_6', url: null },
    { key: 'testimonial_7', url: null },
    { key: 'testimonial_8', url: null },
    { key: 'social_facebook', url: null },
    { key: 'social_instagram', url: null },
    { key: 'social_tiktok', url: null },
    { key: 'social_whatsapp', url: null },
    // Why China section images
    { key: 'why_china_1_image', url: null },
    { key: 'why_china_2_image', url: null },
    { key: 'why_china_3_image', url: null },
    { key: 'why_china_4_image', url: null },
    // Top bar icons (5): email, phone, TikTok, Instagram, Facebook
    { key: 'topbar_email_icon', url: null },
    { key: 'topbar_phone_icon', url: null },
    { key: 'topbar_tiktok', url: null },
    { key: 'topbar_ins', url: null },
    { key: 'topbar_facebook', url: null },
  ]

  for (const image of images) {
    const existing = await prisma.image.findUnique({
      where: { key: image.key }
    })
    if (!existing) {
      await prisma.image.create({
        data: image
      })
      console.log(`Created image: ${image.key}`)
    } else {
      console.log(`Skipped image (already exists): ${image.key}`)
    }
  }

  // Create admin user - only if not exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    })
    console.log('Created admin user: admin / admin123')
  } else {
    console.log('Skipped admin user (already exists)')
  }

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
