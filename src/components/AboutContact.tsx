'use client'

import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'

export default function AboutContact() {
  return (
    <section className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            Contact Us
          </h2>
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E1EDFB] rounded-full flex items-center justify-center shrink-0">
                <Phone size={18} className="text-[#1861D7]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                <a href="tel:+8613244819680" className="text-gray-800 hover:text-[#1861D7] transition-colors">
                  +86 13244819680
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E1EDFB] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-[#1861D7]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">WhatsApp</p>
                <a
                  href="https://wa.me/8613244819680"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-[#1861D7] transition-colors"
                >
                  +86 13244819680
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E1EDFB] rounded-full flex items-center justify-center shrink-0">
                <Mail size={18} className="text-[#1861D7]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                <a href="mailto:huenomedtour@163.com" className="text-gray-800 hover:text-[#1861D7] transition-colors">
                  huenomedtour@163.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E1EDFB] rounded-full flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#1861D7]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Address</p>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  Building 10, Minjie Shangcheng International{'\n'}
                  Wanbo Business District, Nancun Town{'\n'}
                  Panyu District, Guangzhou{'\n'}
                  Guangdong Province, P.R.China
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
