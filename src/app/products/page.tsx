'use client';

import PageLayout, { useGeneratedBreadcrumbs } from '../../components/layout/PageLayout';
import { LoadingSkeleton } from '../../components/ui/Loading';
import Card from '../../components/ui/Card';

export default function ProductsPage() {
  const breadcrumbs = useGeneratedBreadcrumbs();

  return (
    <PageLayout 
      title="Our Products"
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
    >
      <div className="space-y-8">
        {/* Product Categories */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Product Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Handmade Jewelry', 'Artisan Crafts', 'Home Decor'].map((category) => (
              <Card key={category} className="cursor-pointer group">
                <div className="p-6">
                  <div className="mb-4">
                    <LoadingSkeleton className="h-32 w-full rounded-md" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Discover our beautiful collection of {category.toLowerCase()}.
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="cursor-pointer group">
                <div className="p-4">
                  <div className="mb-4">
                    <LoadingSkeleton className="h-40 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <LoadingSkeleton className="h-4 w-3/4" />
                    <LoadingSkeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
