'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, Calendar, ArrowRight } from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()

  // Mock blog posts data
  const featuredPosts = [
    {
      id: 1,
      title: 'Getting Started with Next.js 14',
      excerpt: 'Découvrez les nouvelles fonctionnalités de Next.js 14 et comment créer des applications web modernes.',
      author: 'Jean Dupont',
      date: '2024-01-15',
      category: 'Technology',
      readTime: '5 min',
      image: 'https://via.placeholder.com/400x200?text=Next.js+14',
    },
    {
      id: 2,
      title: 'TypeScript Best Practices',
      excerpt: 'Les meilleures pratiques pour écrire du code TypeScript maintenable et évolutif.',
      author: 'Marie Martin',
      date: '2024-01-10',
      category: 'Development',
      readTime: '8 min',
      image: 'https://via.placeholder.com/400x200?text=TypeScript',
    },
    {
      id: 3,
      title: 'Building Modern UIs with Tailwind CSS',
      excerpt: 'Comment créer des interfaces utilisateur modernes et responsives avec Tailwind CSS.',
      author: 'Pierre Durand',
      date: '2024-01-05',
      category: 'Design',
      readTime: '6 min',
      image: 'https://via.placeholder.com/400x200?text=Tailwind+CSS',
    }
  ]

  const categories = [
    { name: 'Technology', count: 12, color: 'bg-blue-100 text-blue-800' },
    { name: 'Development', count: 8, color: 'bg-green-100 text-green-800' },
    { name: 'Design', count: 6, color: 'bg-purple-100 text-purple-800' },
    { name: 'Business', count: 4, color: 'bg-yellow-100 text-yellow-800' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue sur{' '}
              <span className="text-blue-600">Modern Blog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez des articles passionnants, partagez vos idées et 
              connectez-vous avec une communauté de créateurs de contenu.
            </p>
            
            {session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Aller au tableau de bord
                </Link>
                <Link
                  href="/write"
                  className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Écrire un article
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => signIn()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Se connecter
                </button>
                <Link
                  href="/auth/signup"
                  className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Articles en vedette</h2>
          <p className="text-lg text-gray-600">
            Découvrez nos articles les plus populaires et les plus récents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(post.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                <Link
                  href={`/posts/${post.id}`}
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lire l'article
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catégories populaires</h2>
            <p className="text-lg text-gray-600">
              Explorez nos différentes catégories d'articles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${category.color}`}>
                    {category.count} articles
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à partager vos idées ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté de créateurs et commencez à publier vos articles dès aujourd'hui.
            </p>
            {!session && (
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Commencer maintenant
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
