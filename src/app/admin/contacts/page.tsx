'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, Download, X, Mail, Phone, Globe, Calendar, User, Heart, MessageCircle } from 'lucide-react'

interface Contact {
  id: number
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  message: string | null
  age: string | null
  gender: string | null
  whatsapp: string | null
  medicalNeeds: string | null
  createdAt: string
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchText, setSearchText] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterAge, setFilterAge] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Derive filter options from data
  const countryOptions = useMemo(() => {
    const set = new Set<string>()
    contacts.forEach(c => { if (c.country) set.add(c.country) })
    return Array.from(set).sort()
  }, [contacts])

  const genderOptions = useMemo(() => {
    const set = new Set<string>()
    contacts.forEach(c => { if (c.gender) set.add(c.gender) })
    return Array.from(set).sort()
  }, [contacts])

  const ageOptions = useMemo(() => {
    const set = new Set<string>()
    contacts.forEach(c => { if (c.age) set.add(c.age) })
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b))
  }, [contacts])

  const hasActiveFilters = searchText || filterCountry || filterGender || filterAge || dateFrom || dateTo

  const clearAllFilters = () => {
    setSearchText('')
    setFilterCountry('')
    setFilterGender('')
    setFilterAge('')
    setDateFrom('')
    setDateTo('')
  }

  const filteredContacts = contacts.filter(contact => {
    if (searchText) {
      const search = searchText.toLowerCase()
      const matchesSearch = [
        contact.name, contact.email, contact.phone, contact.country,
        contact.whatsapp, contact.medicalNeeds
      ].some(field => field?.toLowerCase().includes(search))
      if (!matchesSearch) return false
    }

    if (filterCountry && contact.country !== filterCountry) return false
    if (filterGender && contact.gender !== filterGender) return false
    if (filterAge && contact.age !== filterAge) return false

    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0, 0)
      if (new Date(contact.createdAt) < from) return false
    }

    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      if (new Date(contact.createdAt) > to) return false
    }

    return true
  })

  const exportCSV = () => {
    const headers = ['Name', 'Age', 'Gender', 'Country', 'Email', 'WhatsApp', 'Phone', 'Medical Needs', 'Message', 'Submitted At']
    const rows = filteredContacts.map(c => [
      c.name || '',
      c.age || '',
      c.gender || '',
      c.country || '',
      c.email || '',
      c.whatsapp || '',
      c.phone || '',
      (c.medicalNeeds || '').replace(/"/g, '""'),
      (c.message || '').replace(/"/g, '""'),
      formatDate(c.createdAt)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `customer-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
          {/* Header with filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Customer Enquiries</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredContacts.length} of {contacts.length} enquiries
                </p>
              </div>
              <button
                onClick={exportCSV}
                disabled={filteredContacts.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#1861D7] hover:bg-[#1250a0] disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 space-y-3">
              {/* Row 1: Search + dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, country..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                  />
                </div>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm bg-white min-w-[140px]"
                >
                  <option value="">All Countries</option>
                  {countryOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm bg-white min-w-[120px]"
                >
                  <option value="">All Genders</option>
                  {genderOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <select
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm bg-white min-w-[100px]"
                >
                  <option value="">All Ages</option>
                  {ageOptions.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-400">—</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fa3e8] focus:border-transparent outline-none text-sm"
                />
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-2 text-sm text-[#1861D7] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active filter tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchText && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      Search: {searchText}
                      <button onClick={() => setSearchText('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                  {filterCountry && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      Country: {filterCountry}
                      <button onClick={() => setFilterCountry('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                  {filterGender && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      Gender: {filterGender}
                      <button onClick={() => setFilterGender('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                  {filterAge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      Age: {filterAge}
                      <button onClick={() => setFilterAge('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                  {dateFrom && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      From: {dateFrom}
                      <button onClick={() => setDateFrom('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                  {dateTo && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1861D7] rounded-full text-xs font-medium">
                      To: {dateTo}
                      <button onClick={() => setDateTo('')} className="hover:bg-blue-100 rounded-full p-0.5"><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {contacts.length === 0 ? 'No enquiries yet' : 'No matching enquiries'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age/Gender</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical Needs</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map(contact => (
                    <tr
                      key={contact.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{contact.name || 'Anonymous'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {contact.age ? `${contact.age} yrs` : '-'}
                          {contact.gender ? ` / ${contact.gender}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{contact.country || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="text-sm text-gray-600 truncate max-w-[200px]" title={contact.email}>{contact.email}</div>
                          )}
                          {contact.whatsapp && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]" title={`WhatsApp: ${contact.whatsapp}`}>{contact.whatsapp}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-[250px]">
                          {contact.medicalNeeds || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 whitespace-nowrap">{formatDateShort(contact.createdAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg font-semibold text-gray-900">Enquiry Details</h3>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><User size={12} /> Name</label>
                  <p className="text-gray-900">{selectedContact.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Calendar size={12} /> Age</label>
                  <p className="text-gray-900">{selectedContact.age ? `${selectedContact.age} yrs` : 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Heart size={12} /> Gender</label>
                  <p className="text-gray-900">{selectedContact.gender || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Globe size={12} /> Country</label>
                  <p className="text-gray-900">{selectedContact.country || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail size={12} /> Email</label>
                <p className="text-gray-900">{selectedContact.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MessageCircle size={12} /> WhatsApp</label>
                <p className="text-gray-900">{selectedContact.whatsapp || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone size={12} /> Phone</label>
                <p className="text-gray-900">{selectedContact.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">What medical needs you have?</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.medicalNeeds || 'Not provided'}</p>
              </div>
              {selectedContact.message && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500">Submitted At</label>
                <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
