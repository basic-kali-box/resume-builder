import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <Star className="w-6 h-6" />,
      features: [
        '2 AI-enhanced resumes',
        'Basic templates',
        'PDF download',
        'Standard support'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      name: 'Premium',
      price: '$4.99',
      period: 'per month',
      description: 'For professionals who want the best',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Unlimited AI-enhanced resumes',
        'Premium templates',
        'Advanced AI optimization',
        'ATS-friendly formatting',
        'Priority support',
        'Multiple export formats',
        'Resume analytics'
      ],
      buttonText: 'Start Premium',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$14.99',
      period: 'per month',
      description: 'For teams and organizations',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Everything in Premium',
        'Team collaboration',
        'Bulk resume generation',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Advanced analytics'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.name === 'Free') {
      navigate('/register');
    } else if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:mehdibenlekhale@gmail.com?subject=Enterprise Plan Inquiry';
    } else {
      // For Premium plan - you can integrate with your payment processor here
      console.log('Premium plan selected');
      // For now, redirect to contact
      window.location.href = 'mailto:mehdibenlekhale@gmail.com?subject=Premium Plan Subscription';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Unlock the full potential of AI-powered resume building.
            Create professional resumes that get you noticed.
          </p>
          <p className="text-lg text-blue-600 font-medium">
            ✨ Start with 2 free AI enhancements • No credit card required
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mx-auto">
                  <div className="text-blue-600">
                    {plan.icon}
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900 text-center">
                  {plan.name}
                </h3>

                <p className="mt-2 text-gray-600 text-center text-sm">
                  {plan.description}
                </p>

                <div className="mt-8 text-center">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-lg">
                    {plan.period}
                  </span>
                  {plan.name === 'Free' && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      No credit card required
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="ml-3 text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`mt-8 w-full py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our AI Resume Builder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    What happens after my free trials?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    After using your 2 free AI enhancements, you'll need to upgrade to Premium
                    to continue using AI features and access advanced templates.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    Can I cancel anytime?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, you can cancel your subscription at any time. You'll continue to have
                    access to Premium features until the end of your billing period.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    Do you offer refunds?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    We offer a 30-day money-back guarantee. If you're not satisfied,
                    contact us for a full refund.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    Need help choosing?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Contact our support team at{' '}
                    <a
                      href="mailto:mehdibenlekhale@gmail.com"
                      className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors"
                    >
                      mehdibenlekhale@gmail.com
                    </a>
                    {' '}for personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    Is my data secure?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, we use enterprise-grade security to protect your personal information
                    and resume data. Your privacy is our top priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-blue-600 transition-colors">
                    What file formats are supported?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    You can download your resume in PDF format, and upload existing resumes
                    in PDF or DOCX format for AI enhancement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Trusted by Job Seekers Worldwide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                <p className="text-gray-600 text-sm">Free AI Enhancements</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-600 text-sm">ATS-Friendly Templates</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600 text-sm">Customer Support</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                🔒 Your data is secure • 💳 No hidden fees • ⚡ Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
