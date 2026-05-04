'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Check, Loader2, Home, Stethoscope, Microscope, Activity, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { adminFetch } from '@/lib/admin-client'

interface Content {
  id: number
  key: string
  en: string | null
  zh: string | null
  id_text: string | null
}

type Category = 'home' | 'checkup' | 'stemcell' | 'cancer' | 'about'

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Homepage', icon: <Home size={18} /> },
  { id: 'checkup', label: 'Checkup Page', icon: <Stethoscope size={18} /> },
  { id: 'stemcell', label: 'Stem Cell Page', icon: <Microscope size={18} /> },
  { id: 'cancer', label: 'Cancer & Oncology', icon: <Activity size={18} /> },
  { id: 'about', label: 'About Us', icon: <Info size={18} /> }
]

const categoryFilters: Record<Category, (key: string) => boolean> = {
  home: (key) => {
    const homePrefixes = [
      'hero_', 'why_china_', 'feature_', 'service_', 'services_',
      'testimonial_', 'footer_', 'contact_', 'trust'
    ]
    const isHomeKey = homePrefixes.some(prefix => key.startsWith(prefix))
    const isCheckupKey = key.startsWith('checkup_') || /^package_\d+/.test(key)
    const isStemcellKey = key.startsWith('stemcell_')
    const isCancerKey = key.startsWith('cancer_')
    const isAboutKey = key.startsWith('about_')
    return isHomeKey && !isCheckupKey && !isStemcellKey && !isCancerKey && !isAboutKey
  },
  checkup: (key) => {
    const checkupPrefixes = [
      'checkup_hero_', 'checkup_package_', 'checkup_service_',
      'checkup_environment_', 'checkup_step_'
    ]
    const isCheckupKey = checkupPrefixes.some(prefix => key.startsWith(prefix))
    const isTrustKey = /^trust[1-3]$/.test(key)
    return isCheckupKey || isTrustKey
  },
  stemcell: (key) => {
    return key.startsWith('stemcell_')
  },
  cancer: (key) => {
    return key.startsWith('cancer_')
  },
  about: (key) => {
    return key.startsWith('about_')
  }
}

const hiddenKeys = [
  /^service_\d+_title$/,
  /^feature_4_/,
  /^checkup_service_\d+_title$/,
  /^stemcell_advantage_\d+_desc$/,
  /^cancer_step_\d+_title$/
]

interface SectionGroup {
  label: string
  match: (key: string) => boolean
}

const sectionGroups: Record<Category, SectionGroup[]> = {
  home: [
    { label: 'Hero', match: (key) => key.startsWith('hero_') },
    { label: 'Features', match: (key) => key.startsWith('feature_') },
    { label: 'Services', match: (key) => key.startsWith('service_') || key.startsWith('services_') },
    { label: 'Why China', match: (key) => key.startsWith('why_china_') },
    { label: 'Top Bar', match: (key) => key.startsWith('topbar_') },
    { label: 'Footer', match: (key) => key.startsWith('footer_') },
  ],
  checkup: [
    { label: 'Hero', match: (key) => key.startsWith('checkup_hero_') },
    { label: 'Trust Indicators', match: (key) => /^trust[1-3]$/.test(key) },
    { label: 'Services', match: (key) => key.startsWith('checkup_service_') },
    { label: 'Packages', match: (key) => key.startsWith('checkup_package_') },
    { label: 'Process', match: (key) => key.startsWith('checkup_step_') },
    { label: 'Environment', match: (key) => key.startsWith('checkup_env_') },
  ],
  stemcell: [
    { label: 'Hero', match: (key) => key.startsWith('stemcell_hero_') },
    { label: 'Advantages', match: (key) => key.startsWith('stemcell_advantage_') },
    { label: 'Programs', match: (key) => key.startsWith('stemcell_program_') },
    { label: 'Why China', match: (key) => key.startsWith('stemcell_why_china_') },
    { label: 'Boao Zone', match: (key) => key.startsWith('stemcell_boao_') },
  ],
  cancer: [
    { label: 'Hero', match: (key) => key.startsWith('cancer_hero_') },
    { label: 'Advantages', match: (key) => key.startsWith('cancer_advantage_') },
    { label: 'Technologies', match: (key) => key.startsWith('cancer_technology_') },
    { label: 'Process', match: (key) => key.startsWith('cancer_process_') || key.startsWith('cancer_step_') },
  ],
  about: [
    { label: 'Hero', match: (key) => key.startsWith('about_hero_') },
  ],
}

export default function ContentsPage() {
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<Category>('home')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchContents()
  }, [router])

  // Expand all sections when category changes
  useEffect(() => {
    const allSectionIds = sectionGroups[activeCategory].map(g => `${activeCategory}-${g.label}`)
    setExpandedSections(new Set(allSectionIds))
  }, [activeCategory])

  const fetchContents = async () => {
    try {
      const response = await adminFetch('/api/cms', router)
      if (response.ok) {
        const data = await response.json()
        setContents(data.contents || [])
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, locale: 'en' | 'zh' | 'id_text', value: string) => {
    setContents(prev =>
      prev.map(c => (c.key === key ? { ...c, [locale]: value } : c))
    )
  }

  const handleSave = async (key: string) => {
    const content = contents.find(c => c.key === key)
    if (!content) return

    setSaving(true)
    try {
      const response = await adminFetch('/api/cms/update', router, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'content',
          key: content.key,
          en: content.en,
          zh: content.zh,
          id_text: content.id_text
        })
      })

      if (response.ok) {
        setSavedKeys(prev => new Set([...prev, key]))
        setTimeout(() => {
          setSavedKeys(prev => {
            const next = new Set(prev)
            next.delete(key)
            return next
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleBatchSave = async (items: Content[], sectionId?: string) => {
    if (items.length === 0) return

    setSavingSection(sectionId || 'all')
    try {
      const response = await adminFetch('/api/cms/update', router, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'batch',
          items: items.map(c => ({
            type: 'content',
            key: c.key,
            en: c.en,
            zh: c.zh,
            id_text: c.id_text
          }))
        })
      })

      if (response.ok) {
        if (sectionId) {
          setSavedSections(prev => new Set([...prev, sectionId]))
          setTimeout(() => {
            setSavedSections(prev => {
              const next = new Set(prev)
              next.delete(sectionId)
              return next
            })
          }, 2000)
        } else {
          setSavedSections(prev => new Set([...prev, 'all']))
          setTimeout(() => {
            setSavedSections(prev => {
              const next = new Set(prev)
              next.delete('all')
              return next
            })
          }, 2000)
        }
        items.forEach(c => {
          setSavedKeys(prev => new Set([...prev, c.key]))
          setTimeout(() => {
            setSavedKeys(prev => {
              const next = new Set(prev)
              next.delete(c.key)
              return next
            })
          }, 2000)
        })
      }
    } catch (error) {
      console.error('Failed to batch save:', error)
    } finally {
      setSavingSection(null)
    }
  }

  const isRichText = (key: string) => {
    return key === 'services_description' || key === 'hero_title' ||
           key === 'checkup_hero_title' || key === 'checkup_hero_subtitle' ||
           key === 'stemcell_hero_title' || key === 'stemcell_hero_subtitle' ||
           key === 'stemcell_boao_desc' ||
           key === 'cancer_hero_title' || key === 'cancer_hero_subtitle' ||
           key === 'about_hero_title' || key === 'about_hero_description'
  }

  const filteredContents = contents.filter(content => {
    const isHidden = hiddenKeys.some(regex => regex.test(content.key))
    if (isHidden) return false
    return categoryFilters[activeCategory](content.key)
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const isSaving = savingSection !== null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fa3e8]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-[#1a3a5c]">Content Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'text-[#4fa3e8] border-b-2 border-[#4fa3e8]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.label} Content Configuration
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Edit text content for different languages. Use HTML tags for rich text formatting.
              </p>
            </div>
            <button
              onClick={() => handleBatchSave(filteredContents, 'all')}
              disabled={isSaving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                savedSections.has('all')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[#1861D7] text-white hover:bg-[#1250a0]'
              }`}
            >
              {savingSection === 'all' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : savedSections.has('all') ? (
                <Check size={16} />
              ) : (
                <Save size={16} />
              )}
              {savedSections.has('all') ? 'All Saved' : 'Save All'}
            </button>
          </div>

          {filteredContents.length > 0 ? (
            sectionGroups[activeCategory].map((group) => {
              const sectionId = `${activeCategory}-${group.label}`
              const sectionItems = filteredContents.filter(c => group.match(c.key))
              if (sectionItems.length === 0) return null
              const isExpanded = expandedSections.has(sectionId)

              return (
                <div key={sectionId} className="border-b border-gray-200">
                  {/* Section Header */}
                  <div
                    onClick={() => toggleSection(sectionId)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                      <span className="font-semibold text-gray-800">{group.label}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {sectionItems.length}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBatchSave(sectionItems, sectionId)
                      }}
                      disabled={isSaving}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                        savedSections.has(sectionId)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[#4fa3e8] text-white hover:bg-[#3d8fd4]'
                      }`}
                    >
                      {savingSection === sectionId ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : savedSections.has(sectionId) ? (
                        <Check size={12} />
                      ) : (
                        <Save size={12} />
                      )}
                      {savedSections.has(sectionId) ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {sectionItems.map(content => (
                        <div key={content.id} className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                {content.key}
                              </label>
                              {isRichText(content.key) && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Rich text - supports HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;span style="color:red"&gt;
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleSave(content.key)}
                              disabled={saving}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                                savedKeys.has(content.key)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-[#4fa3e8] text-white hover:bg-[#3d8fd4]'
                              }`}
                            >
                              {saving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : savedKeys.has(content.key) ? (
                                <Check size={12} />
                              ) : (
                                <Save size={12} />
                              )}
                              {savedKeys.has(content.key) ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          {isRichText(content.key) ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">English (EN)</label>
                                <textarea
                                  value={content.en || ''}
                                  onChange={e => handleChange(content.key, 'en', e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm font-mono"
                                  placeholder="<p>Your HTML content here</p>"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Chinese (ZH)</label>
                                <textarea
                                  value={content.zh || ''}
                                  onChange={e => handleChange(content.key, 'zh', e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm font-mono"
                                  placeholder="<p>您的HTML内容</p>"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Indonesia (ID)</label>
                                <textarea
                                  value={content.id_text || ''}
                                  onChange={e => handleChange(content.key, 'id_text', e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm font-mono"
                                  placeholder="<p>Konten HTML Anda</p>"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">English (EN)</label>
                                <input
                                  type="text"
                                  value={content.en || ''}
                                  onChange={e => handleChange(content.key, 'en', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Chinese (ZH)</label>
                                <input
                                  type="text"
                                  value={content.zh || ''}
                                  onChange={e => handleChange(content.key, 'zh', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Indonesia (ID)</label>
                                <input
                                  type="text"
                                  value={content.id_text || ''}
                                  onChange={e => handleChange(content.key, 'id_text', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="p-12 text-center text-gray-500">
              No content found for this category.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
