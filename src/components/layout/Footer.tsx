'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-amber-700 font-brand">
                Handcrafted Haven
              </span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Discover unique handmade treasures crafted by talented artisans. Supporting local craftsmanship and sustainable consumption.
            </p>
            <div className="flex space-x-4">
              <button 
                className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Follow us on Facebook"
              >
                <i className="ri-facebook-fill"></i>
              </button>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <i className="ri-instagram-fill"></i>
              </button>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Follow us on Twitter"
              >
                <i className="ri-twitter-fill"></i>
              </button>
              <button 
                className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors cursor-pointer"
                aria-label="Follow us on Pinterest"
              >
                <i className="ri-pinterest-fill"></i>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Featured Artisans
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-600 hover:text-amber-700 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-amber-700 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 Handcrafted Haven. All rights reserved. Made with love for artisans worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
