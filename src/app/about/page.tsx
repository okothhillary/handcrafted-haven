'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] flex items-center justify-center bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Story of
            <span className="block text-amber-200">Craftsmanship & Community</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto">
            Connecting passionate artisans with people who appreciate the beauty and authenticity of handmade treasures
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Handcrafted Haven was born from a simple belief: that in our increasingly digital world, 
                  there's something irreplaceable about items made by human hands with care, skill, and passion.
                </p>
                <p>
                  Founded in 2020, we started as a small platform connecting local artisans with their communities. 
                  Today, we're proud to support hundreds of creators worldwide, each bringing their unique cultural 
                  heritage and personal artistry to life through their craft.
                </p>
                <p>
                  Every product in our marketplace tells a story – of tradition passed down through generations, 
                  of innovation meeting heritage, and of the human spirit expressed through creativity.
                </p>
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="text-center">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
                    <div className="text-gray-700">Artisans</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-2">25k+</div>
                    <div className="text-gray-700">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-2">50</div>
                    <div className="text-gray-700">Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-2">15k+</div>
                    <div className="text-gray-700">Products</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To preserve traditional craftsmanship while empowering artisans to thrive in the modern economy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl text-amber-500 mb-4">
                <i className="ri-hand-heart-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Support Artisans</h3>
              <p className="text-gray-600">
                We provide a platform for skilled craftspeople to showcase their work and connect with 
                customers who value authentic, handmade products.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl text-amber-500 mb-4">
                <i className="ri-leaf-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Commerce</h3>
              <p className="text-gray-600">
                Every purchase supports sustainable practices, fair wages, and environmentally conscious 
                creation processes that respect our planet.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl text-amber-500 mb-4">
                <i className="ri-global-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Preservation</h3>
              <p className="text-gray-600">
                We help preserve traditional techniques and cultural heritage by connecting master craftspeople 
                with new generations of appreciative customers.
              </p>
            </Card>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-star-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality First</h3>
                  <p className="text-gray-600">
                    We carefully curate every product to ensure exceptional craftsmanship and attention to detail.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity</h3>
                  <p className="text-gray-600">
                    Every item is genuinely handmade by skilled artisans using traditional or innovative techniques.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-team-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600">
                    We foster connections between creators and customers, building a supportive global community.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-scales-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Trade</h3>
                  <p className="text-gray-600">
                    We ensure artisans receive fair compensation for their time, skill, and creative output.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-recycle-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
                  <p className="text-gray-600">
                    We prioritize eco-friendly materials and processes that minimize environmental impact.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="ri-lightbulb-line text-amber-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We embrace new technologies and methods that enhance the artisan experience and customer journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Highlight */}
        <section className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to supporting artisans and celebrating handmade craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-user-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarah Mitchell</h3>
              <p className="text-amber-600 font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Former textile artist with 15 years of experience in traditional crafts and sustainable business practices.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-user-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marcus Chen</h3>
              <p className="text-amber-600 font-medium mb-3">Head of Artisan Relations</p>
              <p className="text-gray-600 text-sm">
                Passionate about connecting cultures through craft, with expertise in international trade and cultural preservation.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-user-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Elena Rodriguez</h3>
              <p className="text-amber-600 font-medium mb-3">Head of Customer Experience</p>
              <p className="text-gray-600 text-sm">
                Dedicated to creating meaningful connections between customers and the stories behind each handmade piece.
              </p>
            </Card>
          </div>
        </section>

        {/* Community Impact */}
        <section className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we're making a positive difference in communities around the world
            </p>
          </div>
          
          <Card className="p-8 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl text-amber-600 mb-4">
                  <i className="ri-money-dollar-circle-line"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">$2.3M+</div>
                <div className="text-gray-600">Paid directly to artisans</div>
              </div>
              
              <div>
                <div className="text-4xl text-amber-600 mb-4">
                  <i className="ri-seedling-line"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">15 Programs</div>
                <div className="text-gray-600">Supporting sustainable practices</div>
              </div>
              
              <div>
                <div className="text-4xl text-amber-600 mb-4">
                  <i className="ri-graduation-cap-line"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">200+ Students</div>
                <div className="text-gray-600">Learning traditional crafts</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're an artisan looking to share your craft or a customer seeking authentic handmade treasures, 
              you're welcome in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="px-8">
                  <i className="ri-shopping-bag-line mr-2"></i>
                  Shop Now
                </Button>
              </Link>
              <Link href="/artisans">
                <Button variant="secondary" size="lg" className="px-8">
                  <i className="ri-user-add-line mr-2"></i>
                  Become an Artisan
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
