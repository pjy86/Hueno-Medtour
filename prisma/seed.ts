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

    // Checkup page content
    { key: 'checkup_hero_title', en: 'Premium Health Checkup in China', zh: '中国高端体检服务', id_text: 'Premium Health Checkup di Tiongkok' },
    { key: 'checkup_hero_subtitle', en: 'Fast, Accurate, Comprehensive Medical Screening with World-Class Facilities & Transparent Pricing', zh: '快速、精准、全面的健康筛查——世界级医疗设施与透明定价', id_text: 'Pemeriksaan Medis Cepat, Akurat, Komprehensif dengan Fasilitas Kelas Dunia & Harga Transparan' },
    { key: 'checkup_service_1_title', en: 'Half/Full Day Express', zh: '半日/一日快速体检', id_text: 'Cepat Half/Full Day' },
    { key: 'checkup_service_1_desc', en: 'Complete health screening in just 2-6 hours, perfect for busy schedules', zh: '仅需2-6小时完成全面健康筛查，非常适合忙碌人士', id_text: 'Pemeriksaan kesehatan lengkap dalam 2-6 jam saja' },
    { key: 'checkup_service_2_title', en: 'Bilingual Companion', zh: '全程双语陪同', id_text: 'Pendamping Biligual' },
    { key: 'checkup_service_2_desc', en: 'Professional medical interpreter throughout your entire visit', zh: '专业医疗翻译师全程陪同就诊', id_text: 'Penerjemah medis profesional sepanjang kunjungan' },
    { key: 'checkup_service_3_title', en: 'Advanced Equipment', zh: '高端影像设备', id_text: 'Peralatan Canggih' },
    { key: 'checkup_service_3_desc', en: 'State-of-the-art imaging and diagnostic technology', zh: '国际领先的影像诊断设备', id_text: 'Teknologi pencitraan dan diagnostik terkini' },
    { key: 'checkup_service_4_title', en: 'VIP Access', zh: 'VIP专属通道', id_text: 'Akses VIP' },
    { key: 'checkup_service_4_desc', en: 'Dedicated priority channel with no waiting time', zh: '专属绿色通道，无需排队等待', id_text: 'Jalur prioritas tanpa waktu tunggu' },
    { key: 'checkup_service_5_title', en: 'Bilingual Reports', zh: '双语报告+解读', id_text: 'Laporan Bilingual' },
    { key: 'checkup_service_5_desc', en: 'Detailed medical reports with expert interpretation', zh: '详细的双语医学报告及专家解读', id_text: 'Laporan medis detail dengan interpretasi ahli' },
    { key: 'checkup_service_6_title', en: 'Transparent Pricing', zh: '透明定价', id_text: 'Harga Transparan' },
    { key: 'checkup_service_6_desc', en: 'All-inclusive pricing with no hidden fees', zh: '全包价格，无隐形消费', id_text: 'Harga all-inclusive tanpa biaya tersembunyi' },
    { key: 'checkup_package_1_name', en: 'Package A | Express Checkup', zh: '套餐A | 快速基础体检', id_text: 'Paket A | Pemeriksaan Ekspres' },
    { key: 'checkup_package_1_content', en: 'Price: $500\nFor: General population, quick health screening\nKey Items: Physical exam, Blood test, Liver & kidney function, Chest X-ray, Abdominal ultrasound, ECG\nHighlight: Fast, basic, cost-effective', zh: '价格: $500\n适合: 一般人群、快速健康筛查\n关键项目: 体检、血液检查、肝肾功能、胸部X光、腹部超声、心电图\n亮点: 快速、基础、高性价比', id_text: 'Harga: $500\nUntuk: Populasi umum, pemeriksaan kesehatan cepat\nItem Utama: Pemeriksaan fisik, Tes darah, Fungsi hati & ginjal, Rontgen dada, USG perut, EKG\nHighlight: Cepat, dasar, hemat biaya' },

    // Package B
    { key: 'checkup_package_2_name', en: 'Package B | Young Adult Basic Checkup', zh: '套餐B | 青年基础体检', id_text: 'Paket B | Pemeriksaan Dasar Dewasa Muda' },
    { key: 'checkup_package_2_content', en: 'Price: $1,000\nFor: Adults 18+, annual routine check\nKey Items: All items in A + Lipid 4 items, Liver function 5 items, Tumor markers (AFP, CEA, EB-VCA-IgA)\nHighlight: Basic cancer screening + full organ assessment', zh: '价格: $1,000\n适合: 18岁以上成人、年度常规体检\n关键项目: A套餐所有项目 + 血脂4项、肝功能5项、肿瘤标志物(AFP、CEA、EB-VCA-IgA)\n亮点: 基础癌症筛查+全身器官评估', id_text: 'Harga: $1,000\nUntuk: Dewasa 18+, pemeriksaan rutin tahunan\nItem Utama: Semua item di A + Lipid 4 item, Fungsi hati 5 item, Penanda tumor (AFP, CEA, EB-VCA-IgA)\nHighlight: Skrining kanker dasar + penilaian organ penuh' },

    // Package C
    { key: 'checkup_package_3_name', en: 'Package C | Adults Standard Checkup', zh: '套餐C | 成人标准体检', id_text: 'Paket C | Pemeriksaan Standar Dewasa' },
    { key: 'checkup_package_3_content', en: 'Price: $2,000 – $2,200\nFor: Adults who want full-body health management\nKey Items: All items in B + Chest CT, Thyroid function, Heart color ultrasound, Carotid ultrasound, Gender-specific tumor markers, Gynecological exam (female)\nHighlight: Deep screening for tumors, heart, cerebrovascular, thyroid', zh: '价格: $2,000 – $2,200\n适合: 需要全身健康管理的人群\n关键项目: B套餐所有项目 + 胸部CT、甲状腺功能、心脏彩超、颈动脉彩超、性别特异性肿瘤标志物、妇科检查(女性)\n亮点: 深度筛查肿瘤、心脏、脑血管、甲状腺', id_text: 'Harga: $2,000 – $2,200\nUntuk: Dewasa yang ingin manajemen kesehatan seluruh tubuh\nItem Utama: Semua item di B + CT dada, Fungsi tiroid, USG jantung warna, USG karotid, Penanda tumor spesifik gender, Pemeriksaan ginekologis (wanita)\nHighlight: Skrining mendalam untuk tumor, jantung, serebrovaskular, tiroid' },

    // Package D
    { key: 'checkup_package_4_name', en: 'Package D | Adults Comprehensive Checkup', zh: '套餐D | 成人全面体检', id_text: 'Paket D | Pemeriksaan Komprehensif Dewasa' },
    { key: 'checkup_package_4_content', en: 'Price: $3,700 – $3,900\nFor: Adults who want comprehensive disease prevention\nKey Items: All items in C + Brain & cervical MRI, Painless gastrointestinal endoscopy, Coagulation function, Immune function, Hepatitis markers\nHighlight: Top-level screening, early detection of serious diseases', zh: '价格: $3,700 – $3,900\n适合: 需要全面疾病预防的人群\n关键项目: C套餐所有项目 + 脑部和颈椎MRI、无痛胃肠镜检查、凝血功能、免疫功能、乙肝标志物\n亮点: 顶级筛查、早期发现重大疾病', id_text: 'Harga: $3,700 – $3,900\nUntuk: Dewasa yang ingin pencegahan penyakit komprehensif\nItem Utama: Semua item di C + MRI otak & servikal, Endoskopi gastrointestinal tanpa rasa sakit, Fungsi koagulasi, Fungsi imun, Penanda hepatitis\nHighlight: Skrining tingkat atas, deteksi dini penyakit serius' },
    { key: 'checkup_step_1_title', en: 'Online Consultation', zh: '在线咨询', id_text: 'Konsultasi Online' },
    { key: 'checkup_step_1_desc', en: 'Discuss your health needs and choose the right package', zh: '了解您的健康需求，选择合适的套餐', id_text: 'Diskusikan kebutuhan kesehatan Anda' },
    { key: 'checkup_step_2_title', en: 'Airport Pickup', zh: '入境接待', id_text: 'Penjemputan Bandara' },
    { key: 'checkup_step_2_desc', en: 'VIP reception at the airport with comfortable transfer', zh: '专车接机，全程舒适接送', id_text: 'Resepsi VIP di bandara dengan transfer nyaman' },
    { key: 'checkup_step_3_title', en: 'Checkup Day', zh: '体检当日', id_text: 'Hari Pemeriksaan' },
    { key: 'checkup_step_3_desc', en: 'Comprehensive screening with personal attendant', zh: '专业医护人员全程陪同检查', id_text: 'Pemeriksaan menyeluruh dengan attendant pribadi' },
    { key: 'checkup_step_4_title', en: 'Expert Interpretation', zh: '专家解读', id_text: 'Interpretasi Ahli' },
    { key: 'checkup_step_4_desc', en: 'Board-certified doctor reviews your results', zh: '主任医师现场解读检查结果', id_text: 'Dokter bersertifikat meninjau hasil Anda' },
    { key: 'checkup_step_5_title', en: 'Bilingual Report', zh: '双语报告', id_text: 'Laporan Bilingual' },
    { key: 'checkup_step_5_desc', en: 'Receive detailed report in your preferred language', zh: '提供详细的双语体检报告', id_text: 'Terima laporan detail dalam bahasa pilihan Anda' },
    { key: 'checkup_step_6_title', en: 'Long-term Follow-up', zh: '长期健康跟进', id_text: 'Tindak Lanjut Jangka Panjang' },
    { key: 'checkup_step_6_desc', en: 'Ongoing health management and support', zh: '持续的健康管理与跟踪服务', id_text: 'Manajemen kesehatan berkelanjutan' },
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
    // Checkup page images
    { key: 'checkup_hero_bg', url: null },
    { key: 'checkup_package_1_image', url: null },
    { key: 'checkup_package_2_image', url: null },
    { key: 'checkup_package_3_image', url: null },
    { key: 'checkup_package_4_image', url: null },
    { key: 'checkup_env_1', url: null },
    { key: 'checkup_env_2', url: null },
    { key: 'checkup_env_3', url: null },
    { key: 'checkup_env_4', url: null },
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
