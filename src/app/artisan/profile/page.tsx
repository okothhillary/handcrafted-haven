'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSession } from 'next-auth/react';

interface ArtworkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: 'active' | 'draft' | 'sold';
  createdAt: string;
}

interface ArtisanProfile {
  businessName: string;
  description: string;
  totalProducts: number;
  totalSales: number;
  rating: number;
  isVerified: boolean;
}

export default function ArtisanProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ArtisanProfile>({
    businessName: '',
    description: '',
    totalProducts: 0,
    totalSales: 0,
    rating: 0,
    isVerified: false
  });
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Artisan Profile', isCurrentPage: true }
  ];

  useEffect(() => {
    fetchArtisanData();
  }, []);

  const fetchArtisanData = async () => {
    try {
      const [profileRes, artworksRes] = await Promise.all([
        fetch('/api/artisan/profile'),
        fetch('/api/artisan/artworks')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      if (artworksRes.ok) {
        const artworksData = await artworksRes.json();
        setArtworks(artworksData);
      }
    } catch (error) {
      console.error('Failed to fetch artisan data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      const response = await fetch(`/api/artisan/artworks/${artworkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setArtworks(artworks.filter(artwork => artwork.id !== artworkId));
      } else {
        alert('Failed to delete artwork');
      }
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      alert('Failed to delete artwork');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quickStats = [
    {
      title: 'Total Artworks',
      value: profile.totalProducts,
      icon: 'ri-palette-line',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Sales',
      value: `$${profile.totalSales}`,
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Rating',
      value: `${profile.rating}/5`,
      icon: 'ri-star-line',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Status',
      value: profile.isVerified ? 'Verified' : 'Pending',
      icon: profile.isVerified ? 'ri-verified-badge-line' : 'ri-time-line',
      color: profile.isVerified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <ProtectedRoute requiredRole="seller">
      <PageLayout
        title="Artisan Profile"
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to your Artisan Studio, {session?.user?.name}!
            </h1>
            <p className="text-purple-100">
              Manage your artworks, track sales, and grow your creative business.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <i className={`${stat.icon} text-2xl`}></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '-' : stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="ri-user-line text-3xl text-gray-500"></i>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {profile.businessName || session?.user?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {profile.description || 'No description provided'}
                  </p>
                  <Button variant="secondary" size="sm">
                    <Link href="/artisan/settings">
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Artworks Management */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Artworks</h2>
                <Button 
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="ri-add-line mr-2"></i>
                  Add New Artwork
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your artworks...</p>
                </div>
              ) : artworks.length > 0 ? (
                <div className="space-y-4">
                  {artworks.map((artwork) => (
                    <Card key={artwork.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {artwork.image ? (
                            <Image 
                              src={artwork.image} 
                              alt={artwork.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <i className="ri-image-line text-gray-400"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {artwork.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(artwork.status)}`}>
                              {artwork.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {artwork.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-primary">
                              ${artwork.price}
                            </span>
                            <div className="flex space-x-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => window.location.href = `/artisan/artworks/${artwork.id}/edit`}
                              >
                                <i className="ri-edit-line mr-1"></i>
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteArtwork(artwork.id)}
                              >
                                <i className="ri-delete-bin-line mr-1"></i>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <i className="ri-palette-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No artworks yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by creating your first artwork to showcase your talent.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="ri-add-line mr-2"></i>
                    Create Your First Artwork
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Create Artwork Modal - Simple for now */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>
              <p className="text-gray-600 mb-4">
                The artwork creation form will be implemented in the next phase.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </ProtectedRoute>
  );
}
