'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Save, Check, Image as ImageIcon, X, Eye } from 'lucide-react'

interface Image {
  id: number
  key: string
  url: string | null
}

export default function ImagesPage() {
  const router = useRouter()
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentEditingKey, setCurrentEditingKey] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchImages()
  }, [router])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/cms')
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

    setSaving(key)
    try {
      const response = await fetch('/api/cms/update', {
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
      setSaving(null)
    }
  }

  const handleFileSelect = (key: string, file: File) => {
    // Create a local URL for preview (this won't persist - user needs to host the image)
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setCurrentEditingKey(key)
    
    // Show alert about hosting needed
    alert('图片已选择为预览状态。请复制图片到图床（如 imgur.com、cloudinary.com）获取 URL，然后粘贴到 URL 输入框中保存。')
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
          <h1 className="text-xl font-bold text-[#1a3a5c]">Image Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Homepage Image Configuration
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter image URLs to update homepage images. You can host images on imgur.com, cloudinary.com, or any image hosting service.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {images.map(image => (
              <div key={image.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{image.key}</label>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: varies</p>
                  </div>
                  <button
                    onClick={() => handleSave(image.key)}
                    disabled={saving === image.key}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      savedKeys.has(image.key)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[#4fa3e8] text-white hover:bg-[#3d8fd4]'
                    }`}
                  >
                    {saving === image.key ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : savedKeys.has(image.key) ? (
                      <Check size={16} />
                    ) : (
                      <Save size={16} />
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

            {images.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No images found. Run database seed to add default image configurations.
              </div>
            )}
          </div>
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
