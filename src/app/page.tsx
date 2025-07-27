import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-brand text-amber-600 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique handcrafted treasures from talented artisans. 
            Support local creators and find one-of-a-kind handmade items that tell a story.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Shop Now
            </Button>
            <Button variant="secondary" size="lg">
              Meet Artisans
            </Button>
          </div>
        </div>
      </section>

      {/* Development Progress Section */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🚀 Development Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-amber-600">✅ Phase 2: Core Layout & Components</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• ✅ Navigation system with mobile menu</li>
                <li>• ✅ Layout components and error boundaries</li>
                <li>• ✅ Form fields with validation system</li>
                <li>• ✅ Modal and dropdown components</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-amber-600">⏳ Phase 3: Homepage Implementation</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Hero section with brand messaging</li>
                <li>• Featured products integration</li>
                <li>• Category showcase with navigation</li>
                <li>• Testimonials and social proof</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Current:</strong> Phase 2.3 Complete - All Base UI Components Implemented
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Modern design system with form validation, modals, and dropdowns following Team 13 patterns
            </p>
            <div className="mt-3">
              <Link 
                href="/components-demo"
                className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                View UI Components Demo
                <i className="ri-arrow-right-line ml-1"></i>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
