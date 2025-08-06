'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent mb-4">
              Modern Blog
            </h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Un blog moderne et professionnel créé avec Next.js, TypeScript et Tailwind CSS. 
              Partagez vos histoires et connectez-vous avec des lecteurs du monde entier.
            </p>
          </div>

          {/* Explorer */}
          <div>
            <h4 className="font-medium text-lg mb-2">Explorer</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/posts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Tous les articles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Auteurs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="font-medium text-lg mb-2">Compte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  S&apos;inscrire
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Profil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © {currentYear} Modern Blog. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
