import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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
              <h3 className="font-medium text-amber-600">✅ Phase 1: Frontend Project Initialization</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Next.js 15.4.1 with TypeScript</li>
                <li>• Tailwind CSS with custom design tokens</li>
                <li>• Google Fonts integration (Pacifico, Geist)</li>
                <li>• ESLint and development environment</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-amber-600">⏳ Phase 2: Core Layout & Navigation</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• ✅ Header component with responsive navigation</li>
                <li>• ✅ Footer component with brand links</li>
                <li>• ✅ UI components (Button, Card)</li>
                <li>• ⏳ Layout wrapper and error boundaries</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Current:</strong> Phase 2.1 - Navigation System Implementation (In Progress)
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Modern responsive design patterns with mobile-first approach
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
