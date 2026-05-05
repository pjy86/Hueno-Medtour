import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { BCRYPT_SALT_ROUNDS } from '../src/lib/admin-password-policy'

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

    // Stem Cell page content
    { key: 'stemcell_hero_title', en: 'Stem Cell Therapy in China', zh: '中国干细胞治疗', id_text: 'Terapi Sel Induk di Tiongkok' },
    { key: 'stemcell_hero_subtitle', en: 'Advanced regenerative medicine with world-class facilities & expert care', zh: '先进再生医学，世界级设施与专业护理', id_text: 'Kedokteran regeneratif canggih dengan fasilitas kelas dunia & perawatan ahli' },

    // Stem Cell Advantages (内容区1)
    { key: 'stemcell_advantages_title', en: 'Stem Cell Advantages', zh: '干细胞治疗优势', id_text: 'Keunggulan Sel Induk' },
    { key: 'stemcell_advantage_1_title', en: 'Regenerative Power', zh: '再生能力', id_text: 'Kekuatan Regeneratif' },
    { key: 'stemcell_advantage_1_desc', en: 'Stem cells can differentiate into various cell types, promoting tissue repair and regeneration', zh: '干细胞可分化为多种细胞类型，促进组织修复和再生', id_text: 'Sel induk dapat berdiferensiasi menjadi berbagai jenis sel, mempromosikan perbaikan dan regenerasi jaringan' },
    { key: 'stemcell_advantage_2_title', en: 'Minimally Invasive', zh: '微创治疗', id_text: 'Minimal Invasif' },
    { key: 'stemcell_advantage_2_desc', en: 'Non-surgical procedures with shorter recovery time and fewer complications', zh: '非手术方式，恢复时间更短，并发症更少', id_text: 'Prosedur non-bedah dengan waktu pemulihan lebih singkat dan komplikasi lebih sedikit' },
    { key: 'stemcell_advantage_3_title', en: 'Personalized Treatment', zh: '个性化治疗', id_text: 'Perawatan Personal' },
    { key: 'stemcell_advantage_3_desc', en: 'Tailored therapy plans based on individual health conditions and needs', zh: '根据个人健康状况和需求量身定制的治疗方案', id_text: 'Rencana terapi yang disesuaikan berdasarkan kondisi dan kebutuhan kesehatan individu' },
    { key: 'stemcell_advantage_4_title', en: 'Evidence-Based', zh: '循证医学', id_text: 'Berbasis Bukti' },
    { key: 'stemcell_advantage_4_desc', en: 'Treatments backed by rigorous clinical research and international standards', zh: '基于严格临床研究和国际标准支持的治疗', id_text: 'Perawatan yang didukung oleh penelitian klinis ketat dan standar internasional' },
    { key: 'stemcell_advantage_5_title', en: 'Multi-Disease Application', zh: '多疾病应用', id_text: 'Aplikasi Multi-Penyakit' },
    { key: 'stemcell_advantage_5_desc', en: 'Effective for autoimmune, neurological, orthopedic and degenerative conditions', zh: '对自身免疫、神经、骨科及退行性疾病有效', id_text: 'Efektif untuk kondisi autoimun, neurologis, ortopedi dan degeneratif' },
    { key: 'stemcell_advantage_6_title', en: 'Cost-Effective', zh: '高性价比', id_text: 'Hemat Biaya' },
    { key: 'stemcell_advantage_6_desc', en: 'World-class treatment at a fraction of the cost compared to Western countries', zh: '与西方国家相比，以极低的成本获得世界级治疗', id_text: 'Perawatan kelas dunia dengan biaya yang jauh lebih rendah dibanding negara Barat' },

    // Stem Cell Programs (内容区2)
    { key: 'stemcell_programs_title', en: 'Stem Cell Therapy Programs in China', zh: '中国干细胞治疗方案', id_text: 'Program Terapi Sel Induk di Tiongkok' },
    { key: 'stemcell_program_1_title', en: 'Anti-Aging & Rejuvenation', zh: '抗衰老与再生', id_text: 'Anti-Penuaan & Rejuvenasi' },
    { key: 'stemcell_program_1_desc', en: 'Comprehensive stem cell programs targeting cellular aging and vitality restoration', zh: '针对细胞衰老和活力恢复的综合干细胞方案', id_text: 'Program sel induk komprehensif yang menargetkan penuaan seluler dan pemulihan vitalitas' },
    { key: 'stemcell_program_2_title', en: 'Neurological Disorders', zh: '神经系统疾病', id_text: 'Gangguan Neurologis' },
    { key: 'stemcell_program_2_desc', en: 'Advanced therapies for stroke recovery, spinal cord injury, and neurodegenerative diseases', zh: '针对中风恢复、脊髓损伤和神经退行性疾病的先进疗法', id_text: 'Terapi canggih untuk pemulihan stroke, cedera sumsum tulang belakang, dan penyakit neurodegeneratif' },
    { key: 'stemcell_program_3_title', en: 'Autoimmune Conditions', zh: '自身免疫疾病', id_text: 'Kondisi Autoimun' },
    { key: 'stemcell_program_3_desc', en: 'Immunomodulatory stem cell treatments for lupus, rheumatoid arthritis, and MS', zh: '针对狼疮、类风湿性关节炎和多发性硬化症的免疫调节干细胞治疗', id_text: 'Perawatan sel induk imunomodulator untuk lupus, artritis reumatoid, dan MS' },
    { key: 'stemcell_program_4_title', en: 'Orthopedic Regeneration', zh: '骨科再生', id_text: 'Regenerasi Ortopedi' },
    { key: 'stemcell_program_4_desc', en: 'Cartilage repair, joint regeneration, and bone healing with mesenchymal stem cells', zh: '使用间充质干细胞进行软骨修复、关节再生和骨骼愈合', id_text: 'Perbaikan tulang rawan, regenerasi sendi, dan penyembuhan tulang dengan sel induk mesenkim' },
    { key: 'stemcell_program_5_title', en: 'Cardiovascular Therapy', zh: '心血管治疗', id_text: 'Terapi Kardiovaskular' },
    { key: 'stemcell_program_5_desc', en: 'Stem cell-based cardiac repair and vascular regeneration programs', zh: '基于干细胞的心脏修复和血管再生方案', id_text: 'Program perbaikan jantung dan regenerasi vaskular berbasis sel induk' },
    { key: 'stemcell_program_6_title', en: 'Diabetes Management', zh: '糖尿病管理', id_text: 'Manajemen Diabetes' },
    { key: 'stemcell_program_6_desc', en: 'Islet cell regeneration and immune modulation for type 1 and type 2 diabetes', zh: '针对1型和2型糖尿病的胰岛细胞再生和免疫调节', id_text: 'Regenerasi sel pulau Langerhans dan modulasi kekebalan untuk diabetes tipe 1 dan tipe 2' },

    // Stem Cell Why China (内容区3)
    { key: 'stemcell_why_china_title', en: 'Stem Cell Therapy Programs in China', zh: '中国干细胞治疗方案', id_text: 'Program Terapi Sel Induk di Tiongkok' },
    { key: 'stemcell_why_china_1_title', en: 'Pioneering Research', zh: '前沿研究', id_text: 'Riset Perintis' },
    { key: 'stemcell_why_china_1_desc', en: 'China leads global stem cell clinical trials with over 500 registered studies', zh: '中国在全球干细胞临床试验中领先，注册研究超过500项', id_text: 'China memimpin uji klinis sel induk global dengan lebih dari 500 studi terdaftar' },
    { key: 'stemcell_why_china_2_title', en: 'World-Class Facilities', zh: '世界级设施', id_text: 'Fasilitas Kelas Dunia' },
    { key: 'stemcell_why_china_2_desc', en: 'State-of-the-art GMP labs and specialized stem cell treatment centers', zh: '最先进的GMP实验室和专科干细胞治疗中心', id_text: 'Lab GMP mutakhir dan pusat perawatan sel induk khusus' },
    { key: 'stemcell_why_china_3_title', en: 'Expert Medical Teams', zh: '专家医疗团队', id_text: 'Tim Medis Ahli' },
    { key: 'stemcell_why_china_3_desc', en: 'Internationally trained specialists with decades of stem cell research experience', zh: '具有数十年干细胞研究经验的国际培训专家', id_text: 'Spesialis berpelatihan internasional dengan pengalaman riset sel induk selama puluhan tahun' },
    { key: 'stemcell_why_china_4_title', en: 'Regulatory Support', zh: '政策支持', id_text: 'Dukungan Regulasi' },
    { key: 'stemcell_why_china_4_desc', en: 'Special medical zones with streamlined approval processes for innovative therapies', zh: '特殊医疗区域为创新疗法提供简化的审批流程', id_text: 'Zona medis khusus dengan proses persetujuan yang disederhanakan untuk terapi inovatif' },
    { key: 'stemcell_why_china_5_title', en: 'Affordable Excellence', zh: '优质平价', id_text: 'Keunggulan Terjangkau' },
    { key: 'stemcell_why_china_5_desc', en: 'Premium treatments at 60-80% lower cost compared to Western alternatives', zh: '与西方替代方案相比，费用降低60-80%的优质治疗', id_text: 'Perawatan premium dengan biaya 60-80% lebih rendah dibanding alternatif Barat' },
    { key: 'stemcell_why_china_6_title', en: 'Holistic Care', zh: '全面护理', id_text: 'Perawatan Holistik' },
    { key: 'stemcell_why_china_6_desc', en: 'Complete patient journey from consultation to post-treatment follow-up', zh: '从咨询到治疗后随访的完整患者旅程', id_text: 'Perjalanan pasien lengkap dari konsultasi hingga tindak lanjut pasca-perawatan' },

    // Stem Cell Boao Zone (内容区4)
    { key: 'stemcell_boao_title', en: 'About Boao Lecheng International Medical Tourism Pilot Zone', zh: '关于博鳌乐城国际医疗旅游先行区', id_text: 'Tentang Zona Percontohan Pariwisata Medis Internasional Boao Lecheng' },
    { key: 'stemcell_boao_desc', en: '<p>The Boao Lecheng International Medical Tourism Pilot Zone is China\'s only special medical zone approved by the State Council, offering unprecedented access to cutting-edge medical technologies and stem cell therapies. Located in Hainan Province, this pilot zone allows the use of internationally approved drugs, medical devices, and stem cell therapies that are not yet available elsewhere in China, providing patients with early access to the world\'s most advanced medical treatments.</p>', zh: '<p>博鳌乐城国际医疗旅游先行区是经国务院批准的中国唯一特殊医疗区域，提供前所未有的尖端医疗技术和干细胞治疗机会。位于海南省，该先行区允许使用尚未在中国其他地区上市的国际已批准药物、医疗器械和干细胞疗法，让患者提前获得世界最先进的医疗治疗。</p>', id_text: '<p>Zona Percontohan Pariwisata Medis Internasional Boao Lecheng adalah satu-satunya zona medis khusus di China yang disetujui oleh Dewan Negara, menawarkan akses tanpa preseden ke teknologi medis canggih dan terapi sel induk. Terletak di Provinsi Hainan, zona percontohan ini memungkinkan penggunaan obat, perangkat medis, dan terapi sel induk yang disetujui secara internasional yang belum tersedia di tempat lain di China, memberikan pasien akses awal ke perawatan medis paling canggih di dunia.</p>' },

    // Cancer & Oncology page content
    { key: 'cancer_hero_title', en: 'Cancer & Oncology Treatment in China', zh: '中国肿瘤与癌症治疗', id_text: 'Perawatan Kanker & Onkologi di Tiongkok' },
    { key: 'cancer_hero_subtitle', en: 'World-class cancer care with advanced technology & compassionate support', zh: '世界级癌症护理，先进技术与贴心关怀', id_text: 'Perawatan kanker kelas dunia dengan teknologi canggih & dukungan penuh perhatian' },

    // Cancer Advantages
    { key: 'cancer_advantages_title', en: 'Oncology Treatment Advantages', zh: '肿瘤治疗优势', id_text: 'Keunggulan Perawatan Onkologi' },
    { key: 'cancer_advantage_1_title', en: 'Multidisciplinary Teams', zh: '多学科团队', id_text: 'Tim Multidisiplin' },
    { key: 'cancer_advantage_2_title', en: 'Cutting-Edge Technology', zh: '尖端技术', id_text: 'Teknologi Canggih' },
    { key: 'cancer_advantage_3_title', en: 'Personalized Treatment', zh: '个性化治疗', id_text: 'Perawatan Personal' },
    { key: 'cancer_advantage_4_title', en: 'Affordable Excellence', zh: '优质平价', id_text: 'Keunggulan Terjangkau' },
    { key: 'cancer_advantage_5_title', en: 'Clinical Trials Access', zh: '临床试验机会', id_text: 'Akses Uji Klinis' },
    { key: 'cancer_advantage_6_title', en: 'Holistic Support', zh: '全面支持', id_text: 'Dukungan Holistik' },

    // Cancer Technologies
    { key: 'cancer_technologies_title', en: 'Advanced Cancer Treatment Technologies', zh: '先进癌症治疗技术', id_text: 'Teknologi Perawatan Kanker Canggih' },
    { key: 'cancer_technology_1_title', en: 'Proton Therapy', zh: '质子治疗', id_text: 'Terapi Proton' },
    { key: 'cancer_technology_1_desc', en: 'Precision radiation therapy that targets tumors while sparing healthy tissue', zh: '精准放射治疗，靶向肿瘤同时保护健康组织', id_text: 'Terapi radiasi presisi yang menargetkan tumor sambil melindungi jaringan sehat' },
    { key: 'cancer_technology_2_title', en: 'Immunotherapy', zh: '免疫治疗', id_text: 'Imunoterapi' },
    { key: 'cancer_technology_2_desc', en: 'Harness the body immune system to fight cancer with checkpoint inhibitors and CAR-T cell therapy', zh: '利用身体免疫系统对抗癌症，包括检查点抑制剂和CAR-T细胞疗法', id_text: 'Memanfaatkan sistem kekebalan tubuh untuk melawan kanker dengan inhibitor checkpoint dan terapi sel CAR-T' },
    { key: 'cancer_technology_3_title', en: 'Targeted Therapy', zh: '靶向治疗', id_text: 'Terapi Target' },
    { key: 'cancer_technology_3_desc', en: 'Drugs designed to target specific cancer cells with minimal side effects', zh: '针对特定癌细胞设计的药物，副作用最小', id_text: 'Obat yang dirancang untuk menargetkan sel kanker tertentu dengan efek samping minimal' },
    { key: 'cancer_technology_4_title', en: 'Minimally Invasive Surgery', zh: '微创手术', id_text: 'Operasi Minimal Invasif' },
    { key: 'cancer_technology_4_desc', en: 'Robotic and laparoscopic surgical techniques for faster recovery', zh: '机器人和腹腔镜手术技术，加速恢复', id_text: 'Teknik bedah robotik dan laparoskopi untuk pemulihan lebih cepat' },
    { key: 'cancer_technology_5_title', en: 'Nuclear Medicine', zh: '核医学', id_text: 'Kedokteran Nuklir' },
    { key: 'cancer_technology_5_desc', en: 'Advanced diagnostic imaging and targeted radionuclide therapy', zh: '先进诊断影像和靶向放射性核素治疗', id_text: 'Pencitraan diagnostik canggih dan terapi radionuklida target' },
    { key: 'cancer_technology_6_title', en: 'Precision Oncology', zh: '精准肿瘤学', id_text: 'Onkologi Presisi' },
    { key: 'cancer_technology_6_desc', en: 'Genomic profiling to match patients with the most effective treatments', zh: '基因组分析，为患者匹配最有效的治疗方案', id_text: 'Profil genomik untuk mencocokkan pasien dengan perawatan paling efektif' },

    // Cancer Treatment Process
    { key: 'cancer_process_title', en: 'Treatment Process', zh: '治疗流程', id_text: 'Proses Perawatan' },
    { key: 'cancer_step_1_title', en: 'Online Consultation', zh: '在线咨询', id_text: 'Konsultasi Online' },
    { key: 'cancer_step_1_desc', en: 'Share your medical records for preliminary assessment by specialist teams', zh: '分享您的病历，由专家团队进行初步评估', id_text: 'Bagikan catatan medis Anda untuk penilaian awal oleh tim spesialis' },
    { key: 'cancer_step_2_title', en: 'Treatment Planning', zh: '治疗方案制定', id_text: 'Perencanaan Perawatan' },
    { key: 'cancer_step_2_desc', en: 'Multidisciplinary team designs a personalized treatment plan', zh: '多学科团队制定个性化治疗方案', id_text: 'Tim multidisiplin merancang rencana perawatan personal' },
    { key: 'cancer_step_3_title', en: 'Travel Arrangement', zh: '出行安排', id_text: 'Pengaturan Perjalanan' },
    { key: 'cancer_step_3_desc', en: 'We handle visa, flights, accommodation and airport pickup', zh: '我们办理签证、航班、住宿和接机', id_text: 'Kami menangani visa, penerbangan, akomodasi, dan penjemputan bandara' },
    { key: 'cancer_step_4_title', en: 'Treatment in China', zh: '在华治疗', id_text: 'Perawatan di Tiongkok' },
    { key: 'cancer_step_4_desc', en: 'Receive world-class treatment with bilingual medical support', zh: '在双语医疗支持下接受世界级治疗', id_text: 'Terima perawatan kelas dunia dengan dukungan medis bilingual' },
    { key: 'cancer_step_5_title', en: 'Post-Treatment Care', zh: '治疗后护理', id_text: 'Perawatan Pasca-Perawatan' },
    { key: 'cancer_step_5_desc', en: 'Recovery support and follow-up consultations', zh: '恢复支持和后续咨询', id_text: 'Dukungan pemulihan dan konsultasi tindak lanjut' },
    { key: 'cancer_step_6_title', en: 'Long-term Follow-up', zh: '长期随访', id_text: 'Tindak Lanjut Jangka Panjang' },
    { key: 'cancer_step_6_desc', en: 'Ongoing monitoring and coordination with your home doctors', zh: '持续监测和与国内医生协调', id_text: 'Pemantauan berkelanjutan dan koordinasi dengan dokter di negara Anda' },

    // About Us page content
    { key: 'about_hero_title', en: 'About Us', zh: '关于我们', id_text: 'Tentang Kami' },
    { key: 'about_hero_description', en: 'Hueno Medtour China is a one-stop, seamlessly connected international medical tourism service platform dedicated to delivering customized, world-class and affordable medical tourism solutions centered on China\'s premium healthcare resources.', zh: 'Hueno Medtour China 是一站式、无缝连接的国际医疗旅游服务平台，致力于以中国优质医疗资源为核心，提供定制化、世界级、高性价比的医疗旅游解决方案。', id_text: 'Hueno Medtour China adalah platform layanan pariwisata medis internasional satu atap yang terhubung secara mulus, didedikasikan untuk memberikan solusi pariwisata medis yang disesuaikan, kelas dunia, dan terjangkau yang berpusat pada sumber daya perawatan kesehatan premium China.' },
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
    { key: 'checkup_service_1_icon', url: null },
    { key: 'checkup_service_2_icon', url: null },
    { key: 'checkup_service_3_icon', url: null },
    { key: 'checkup_service_4_icon', url: null },
    { key: 'checkup_service_5_icon', url: null },
    { key: 'checkup_service_6_icon', url: null },
    { key: 'checkup_step_1_icon', url: null },
    { key: 'checkup_step_2_icon', url: null },
    { key: 'checkup_step_3_icon', url: null },
    { key: 'checkup_step_4_icon', url: null },
    { key: 'checkup_step_5_icon', url: null },
    { key: 'checkup_step_6_icon', url: null },
    { key: 'checkup_package_1_image', url: null },
    { key: 'checkup_package_2_image', url: null },
    { key: 'checkup_package_3_image', url: null },
    { key: 'checkup_package_4_image', url: null },
    { key: 'checkup_env_1', url: null },
    { key: 'checkup_env_2', url: null },
    { key: 'checkup_env_3', url: null },
    { key: 'checkup_env_4', url: null },
    // Stem Cell page images
    { key: 'stemcell_hero_bg', url: null },
    { key: 'stemcell_advantage_1_icon', url: null },
    { key: 'stemcell_advantage_2_icon', url: null },
    { key: 'stemcell_advantage_3_icon', url: null },
    { key: 'stemcell_advantage_4_icon', url: null },
    { key: 'stemcell_advantage_5_icon', url: null },
    { key: 'stemcell_advantage_6_icon', url: null },
    { key: 'stemcell_why_china_1_image', url: null },
    { key: 'stemcell_why_china_2_image', url: null },
    { key: 'stemcell_why_china_3_image', url: null },
    { key: 'stemcell_why_china_4_image', url: null },
    { key: 'stemcell_why_china_5_image', url: null },
    { key: 'stemcell_why_china_6_image', url: null },
    { key: 'stemcell_boao_image', url: null },
    // Cancer & Oncology page images
    { key: 'cancer_hero_bg', url: null },
    { key: 'cancer_advantage_1_icon', url: null },
    { key: 'cancer_advantage_2_icon', url: null },
    { key: 'cancer_advantage_3_icon', url: null },
    { key: 'cancer_advantage_4_icon', url: null },
    { key: 'cancer_advantage_5_icon', url: null },
    { key: 'cancer_advantage_6_icon', url: null },
    { key: 'cancer_technology_1_image', url: null },
    { key: 'cancer_technology_2_image', url: null },
    { key: 'cancer_technology_3_image', url: null },
    { key: 'cancer_technology_4_image', url: null },
    { key: 'cancer_technology_5_image', url: null },
    { key: 'cancer_technology_6_image', url: null },
    { key: 'cancer_step_1_icon', url: null },
    { key: 'cancer_step_2_icon', url: null },
    { key: 'cancer_step_3_icon', url: null },
    { key: 'cancer_step_4_icon', url: null },
    { key: 'cancer_step_5_icon', url: null },
    { key: 'cancer_step_6_icon', url: null },
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
    const hashedPassword = await bcrypt.hash('admin123', BCRYPT_SALT_ROUNDS)
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
