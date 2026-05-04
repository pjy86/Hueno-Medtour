'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Image, MessageSquare, LogOut, ChevronRight, Settings, KeyRound } from 'lucide-react'
import { adminFetch, checkAdminSession } from '@/lib/admin-client'
import { MIN_ADMIN_PASSWORD_LENGTH } from '@/lib/admin-password-policy'

interface Stats {
  contents: number
  images: number
  contacts: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ contents: 0, images: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      const ok = await checkAdminSession()
      if (!ok) {
        router.push('/admin/login')
        return
      }
      await fetchData()
    })()
  }, [router])

  const fetchData = async () => {
    try {
      const [cmsRes, contactsRes] = await Promise.all([
        adminFetch('/api/cms', router),
        adminFetch('/api/contact', router)
      ])

      if (cmsRes.ok && contactsRes.ok) {
        const cmsData = await cmsRes.json()
        const contactsData = await contactsRes.json()
        setStats({
          contents: cmsData.contents?.length || 0,
          images: cmsData.images?.length || 0,
          contacts: contactsData.length || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg('')
    if (pwNew !== pwConfirm) {
      setPwMsg('New passwords do not match')
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew })
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (res.ok) {
        setPwMsg('Password updated.')
        setPwCurrent('')
        setPwNew('')
        setPwConfirm('')
      } else {
        setPwMsg(data.error || 'Failed to update password')
      }
    } finally {
      setPwSaving(false)
    }
  }

  const menuItems = [
    {
      title: 'Content Management',
      description: 'Edit homepage text content',
      href: '/admin/contents',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Image Management',
      description: 'Upload and manage images',
      href: '/admin/images',
      icon: Image,
      color: 'bg-green-500'
    },
    {
      title: 'Contact Enquiries',
      description: 'View customer enquiries',
      href: '/admin/contacts',
      icon: MessageSquare,
      color: 'bg-purple-500'
    }
  ]

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
              <Settings className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-[#1a3a5c]">HN Travel CMS</h1>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-[#1a3a5c]">{stats.contents}</div>
            <div className="text-gray-500 text-sm">Content Items</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-[#1a3a5c]">{stats.images}</div>
            <div className="text-gray-500 text-sm">Images</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-[#1a3a5c]">{stats.contacts}</div>
            <div className="text-gray-500 text-sm">Contact Enquiries</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                <item.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#4fa3e8] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{item.description}</p>
              <div className="flex items-center text-[#4fa3e8] text-sm font-medium">
                Go to {item.title.split(' ')[0]}
                <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="text-[#1a3a5c]" size={22} />
            <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            New password must be at least {MIN_ADMIN_PASSWORD_LENGTH} characters.
          </p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwMsg && (
              <div
                className={`text-sm ${pwMsg.includes('updated') ? 'text-green-600' : 'text-red-600'}`}
              >
                {pwMsg}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <input
                type="password"
                value={pwCurrent}
                onChange={e => setPwCurrent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] outline-none"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={pwNew}
                onChange={e => setPwNew(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] outline-none"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <input
                type="password"
                value={pwConfirm}
                onChange={e => setPwConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] outline-none"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={pwSaving}
              className="px-4 py-2 bg-[#4fa3e8] hover:bg-[#3d8fd4] disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
            >
              {pwSaving ? 'Saving...' : 'Update password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
