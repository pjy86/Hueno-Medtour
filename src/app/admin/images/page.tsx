'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Save, Check, Image as ImageIcon, X, Eye, Home, Stethoscope, Microscope, Activity, Info, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { adminFetch } from '@/lib/admin-client'

interface Image {
  id: number
  key: string
  url: string | null
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
      'hero_bg', 'logo_header', 'logo_footer', 'why_china_', 'feature_icon_',
      'service_image_', 'testimonial_'
    ]
    const isHomeKey = homePrefixes.some(prefix => key.startsWith(prefix))
    const isCheckupKey = key.startsWith('checkup_')
    const isStemcellKey = key.startsWith('stemcell_')
    const isCancerKey = key.startsWith('cancer_')
    const isAboutKey = key.startsWith('about_')
    return isHomeKey && !isCheckupKey && !isStemcellKey && !isCancerKey && !isAboutKey
  },
  checkup: (key) => {
    return key.startsWith('checkup_')
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
  'feature_icon_4'
]

interface SectionGroup {
  label: string
  match: (key: string) => boolean
}

const sectionGroups: Record<Category, SectionGroup[]> = {
  home: [
    { label: 'Hero', match: (key) => key === 'hero_bg' },
    { label: 'Logo', match: (key) => key.startsWith('logo_') },
    { label: 'Features', match: (key) => key.startsWith('feature_icon_') },
    { label: 'Services', match: (key) => key.startsWith('service_image_') },
    { label: 'Why China', match: (key) => key.startsWith('why_china_') },
    { label: 'Testimonials', match: (key) => key.startsWith('testimonial_') },
    { label: 'Top Bar', match: (key) => key.startsWith('topbar_') },
  ],
  checkup: [
    { label: 'Hero', match: (key) => key.startsWith('checkup_hero_') },
    { label: 'Services', match: (key) => key.startsWith('checkup_service_') },
    { label: 'Packages', match: (key) => key.startsWith('checkup_package_') },
    { label: 'Process', match: (key) => key.startsWith('checkup_step_') },
    { label: 'Environment', match: (key) => key.startsWith('checkup_env_') },
  ],
  stemcell: [
    { label: 'Hero', match: (key) => key.startsWith('stemcell_hero_') },
    { label: 'Advantages', match: (key) => key.startsWith('stemcell_advantage_') },
    { label: 'Why China', match: (key) => key.startsWith('stemcell_why_china_') },
    { label: 'Boao Zone', match: (key) => key.startsWith('stemcell_boao_') },
  ],
  cancer: [
    { label: 'Hero', match: (key) => key.startsWith('cancer_hero_') },
    { label: 'Advantages', match: (key) => key.startsWith('cancer_advantage_') },
    { label: 'Technologies', match: (key) => key.startsWith('cancer_technology_') },
    { label: 'Process', match: (key) => key.startsWith('cancer_step_') },
  ],
  about: [
    { label: 'Hero', match: (key) => key.startsWith('about_') },
  ],
}

export default function ImagesPage() {
  const router = useRouter()
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('home')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchImages()
  }, [router])

  useEffect(() => {
    const allSectionIds = sectionGroups[activeCategory].map(g => `${activeCategory}-${g.label}`)
    setExpandedSections(new Set(allSectionIds))
  }, [activeCategory])

  const fetchImages = async () => {
    try {
      const response = await adminFetch('/api/cms', router)
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUrlChange = (key: string, url: string) => {
    setImages(prev =>
      prev.map(img => (img.key === key ? { ...img, url } : img))
    )
  }

  const handleSave = async (key: string) => {
    const image = images.find(img => img.key === key)
    if (!image) return

    setSavingSection(key)
    try {
      const response = await adminFetch('/api/cms/update', router, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          key: image.key,
          url: image.url
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
      setSavingSection(null)
    }
  }

  const handleBatchSave = async (items: Image[], sectionId?: string) => {
    if (items.length === 0) return

    setSavingSection(sectionId || 'all')
    try {
      const response = await adminFetch('/api/cms/update', router, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'batch',
          items: items.map(img => ({
            type: 'image',
            key: img.key,
            url: img.url
          }))
        })
      })

      if (response.ok) {
        const id = sectionId || 'all'
        setSavedSections(prev => new Set([...prev, id]))
        setTimeout(() => {
          setSavedSections(prev => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        }, 2000)
        items.forEach(img => {
          setSavedKeys(prev => new Set([...prev, img.key]))
          setTimeout(() => {
            setSavedKeys(prev => {
              const next = new Set(prev)
              next.delete(img.key)
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

  const handleFileSelect = (key: string, file: File) => {
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    alert('图片已选择为预览状态。请复制图片到图床（如 imgur.com、cloudinary.com）获取 URL，然后粘贴到 URL 输入框中保存。')
  }

  const filteredImages = images.filter(image => {
    if (hiddenKeys.includes(image.key)) return false
    return categoryFilters[activeCategory](image.key)
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
          <h1 className="text-xl font-bold text-[#1a3a5c]">Image Management</h1>
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

        {/* Image List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.label} Image Configuration
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter image URLs to update images. You can host images on imgur.com, cloudinary.com, or any image hosting service.
              </p>
            </div>
            <button
              onClick={() => handleBatchSave(filteredImages, 'all')}
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

          {filteredImages.length > 0 ? (
            sectionGroups[activeCategory].map((group) => {
              const sectionId = `${activeCategory}-${group.label}`
              const sectionItems = filteredImages.filter(img => group.match(img.key))
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
                      {sectionItems.map(image => (
                        <div key={image.id} className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">{image.key}</label>
                              <p className="text-xs text-gray-500 mt-1">Recommended size: varies</p>
                            </div>
                            <button
                              onClick={() => handleSave(image.key)}
                              disabled={savingSection === image.key}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                                savedKeys.has(image.key)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-[#4fa3e8] text-white hover:bg-[#3d8fd4]'
                              }`}
                            >
                              {savingSection === image.key ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : savedKeys.has(image.key) ? (
                                <Check size={12} />
                              ) : (
                                <Save size={12} />
                              )}
                              {savedKeys.has(image.key) ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          <div className="flex items-start gap-6">
                            <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                              {image.url ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={image.url} alt={image.key} className="w-full h-full object-cover" />
                                  <a
                                    href={image.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    <Eye className="text-white" size={24} />
                                  </a>
                                </>
                              ) : (
                                <ImageIcon className="text-gray-300" size={48} />
                              )}
                            </div>

                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                              <input
                                type="url"
                                value={image.url || ''}
                                onChange={e => handleUrlChange(image.key, e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm mb-3"
                              />

                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                  <Upload size={16} />
                                  <span className="text-sm font-medium">Select Image File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handleFileSelect(image.key, file)
                                    }}
                                  />
                                </label>
                                <span className="text-xs text-gray-500">
                                  Select a file to preview, then copy image URL to the input above
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="p-12 text-center text-gray-500">
              No images found for this category.
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Image Preview</h3>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
