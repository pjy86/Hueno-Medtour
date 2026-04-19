'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Mail, Phone, Globe, Calendar } from 'lucide-react'

interface Contact {
  id: number
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  message: string | null
  createdAt: string
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchContacts()
  }, [router])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
          <h1 className="text-xl font-bold text-[#1a3a5c]">Contact Enquiries</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Customer Enquiries</h2>
            <p className="text-gray-500 text-sm mt-1">{contacts.length} total enquiries</p>
          </div>

          {contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No enquiries yet</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{contact.name || 'Anonymous'}</h3>
                        {contact.country && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Globe size={12} />{contact.country}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {contact.email && (
                          <span className="flex items-center gap-1"><Mail size={14} />{contact.email}</span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1"><Phone size={14} />{contact.phone}</span>
                        )}
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar size={14} />{formatDate(contact.createdAt)}
                        </span>
                      </div>
                      {contact.message && (
                        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                      )}
                    </div>
                    <MessageSquare className="text-gray-300" size={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Enquiry Details</h3>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs font-medium text-gray-500">Name</label><p className="text-gray-900">{selectedContact.name || 'Not provided'}</p></div>
              <div><label className="text-xs font-medium text-gray-500">Email</label><p className="text-gray-900">{selectedContact.email || 'Not provided'}</p></div>
              <div><label className="text-xs font-medium text-gray-500">Phone</label><p className="text-gray-900">{selectedContact.phone || 'Not provided'}</p></div>
              <div><label className="text-xs font-medium text-gray-500">Country</label><p className="text-gray-900">{selectedContact.country || 'Not provided'}</p></div>
              <div><label className="text-xs font-medium text-gray-500">Message</label><p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message || 'No message'}</p></div>
              <div><label className="text-xs font-medium text-gray-500">Submitted At</label><p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
