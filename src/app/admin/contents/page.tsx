'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Check, Loader2 } from 'lucide-react'

interface Content {
  id: number
  key: string
  en: string | null
  zh: string | null
  id_text: string | null
}

export default function ContentsPage() {
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchContents()
  }, [router])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/cms')
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
      const response = await fetch('/api/cms/update', {
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

  // Check if content is rich text field
  const isRichText = (key: string) => {
    return key === 'services_description' || key === 'hero_title'
  }

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
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Homepage Content Configuration
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Edit text content for different languages. Use HTML tags for rich text formatting.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {contents
              .filter(content => {
                // Hide service title fields (service_X_title)
                const isServiceTitle = /^service_\d+_title$/.test(content.key)
                return !isServiceTitle
              })
              .map(content => (
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        savedKeys.has(content.key)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[#4fa3e8] text-white hover:bg-[#3d8fd4]'
                      }`}
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : savedKeys.has(content.key) ? (
                        <Check size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      {savedKeys.has(content.key) ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  {isRichText(content.key) ? (
                    // Rich text editor - textarea
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
                        <label className="block text-xs font-medium text-gray-500 mb-1">中文 (ZH)</label>
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
                    // Simple text input
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
                        <label className="block text-xs font-medium text-gray-500 mb-1">中文 (ZH)</label>
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

            {contents.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No content found. Run database seed to add default content.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
