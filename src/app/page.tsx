export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-brand text-amber-600 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique handcrafted treasures from talented artisans. 
            Support local creators and find one-of-a-kind handmade items that tell a story.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-colors">
              Meet Artisans
            </button>
          </div>
        </div>
        
        {/* Development Status Display */}
        <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Development Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-amber-600">✅ Phase 1.1: Project Setup Complete</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Next.js 15.4.1 with TypeScript</li>
                <li>• Tailwind CSS with custom design tokens</li>
                <li>• Google Fonts integration (Pacifico, Geist)</li>
                <li>• ESLint and development environment</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-amber-600">✅ Phase 1.2: Development Environment</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Development server configuration</li>
                <li>• Component directory structure</li>
                <li>• Brand colors and design system</li>
                <li>• Hot reload and TypeScript checking</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Next:</strong> Phase 1.3 - Design System Foundation Implementation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
