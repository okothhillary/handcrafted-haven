'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl text-green-500 mb-4">
                    <i className="ri-check-double-line"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="artisan">Become an Artisan</option>
                      <option value="order">Order Support</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="ri-mail-line text-amber-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">hello@handcraftedhaven.com</p>
                    <p className="text-gray-600">support@handcraftedhaven.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="ri-phone-line text-amber-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="ri-map-pin-line text-amber-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">
                      123 Artisan Way<br />
                      Craft District, CD 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Support */}
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Quick Help?</h3>
              <p className="text-gray-600 mb-6">
                Check out our frequently asked questions or browse our help center for instant answers.
              </p>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <i className="ri-question-line mr-2"></i>
                  FAQ & Help Center
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <i className="ri-chat-3-line mr-2"></i>
                  Live Chat Support
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <i className="ri-book-open-line mr-2"></i>
                  Order Tracking
                </Button>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-6">
                Stay connected with our community and get the latest updates on new artisans and products.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="ri-facebook-fill"></i>
                </div>
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors cursor-pointer">
                  <i className="ri-instagram-line"></i>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors cursor-pointer">
                  <i className="ri-twitter-line"></i>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer">
                  <i className="ri-pinterest-line"></i>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl text-amber-500 mb-4">
                <i className="ri-time-line"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl text-amber-500 mb-4">
                <i className="ri-shield-check-line"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Protected</h3>
              <p className="text-gray-600">
                Your information is secure and will never be shared with third parties.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl text-amber-500 mb-4">
                <i className="ri-customer-service-2-line"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600">
                Our team is passionate about helping you find the perfect handcrafted items.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
