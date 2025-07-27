'use client';

import { useParams } from 'next/navigation';
import PageLayout from '../../../../components/layout/PageLayout';
import { BreadcrumbItem } from '../../../../components/ui/Breadcrumb';
import Card from '../../../../components/ui/Card';
import { LoadingSkeleton } from '../../../../components/ui/Loading';

export default function CategoryPage() {
  const params = useParams();
  const name = (params?.name as string) || 'category';
  
  // Create custom breadcrumbs for this page
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { 
      label: name?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') || 'Category',
      isCurrentPage: true 
    }
  ];

  const categoryTitle = name?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Category';

  return (
    <PageLayout 
      title={categoryTitle}
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
    >
      <div className="space-y-8">
        {/* Category Description */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            Explore our curated collection of {categoryTitle.toLowerCase()}. 
            Each piece is carefully handcrafted by skilled artisans with attention to detail and quality.
          </p>
        </div>

        {/* Filter and Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors">
              All Items
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
              Best Selling
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
              Price: Low to High
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
              Newest
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing 1-12 of 24 products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="cursor-pointer group">
              <div className="p-4">
                {/* Product Image Placeholder */}
                <div className="mb-4 relative">
                  <LoadingSkeleton className="h-48 w-full rounded-md" />
                  <div className="absolute top-2 right-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <i className="ri-heart-line text-gray-600"></i>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    <LoadingSkeleton className="h-5 w-full" />
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <LoadingSkeleton className="h-4 w-16" />
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className="ri-star-fill text-sm"></i>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">(12)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
