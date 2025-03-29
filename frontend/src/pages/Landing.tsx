import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Shield, Users, CheckCircle, ArrowRight, Stethoscope, Heart, MessageSquare, Star, Activity } from 'lucide-react';
export default function Landing() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-reveal').forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const features = [
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with top doctors in just a few clicks',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Access your medical records and appointments anytime, anywhere',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security',
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Chat with your healthcare providers securely through our platform',
    },
  ];

  const benefits = ['Find and book appointments with qualified doctors', 'Access your complete medical history', 'Receive appointment reminders', 'Secure messaging with healthcare providers', 'Digital prescriptions and test results', "Manage family members' health records"];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'>
      {/* Hero Section */}
      <div className='relative overflow-hidden min-h-screen flex items-center'>
        <div className='absolute inset-0 space-gradient'></div>
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full filter blur-3xl'></div>
          <div className='absolute top-40 right-20 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl'></div>
          <div className='absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full filter blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 relative'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex items-center justify-center mb-6'>
              <div className='floating'>
                <Heart className='w-16 h-16 text-pink-500' />
              </div>
              <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-4'>Meddok</h1>
            </div>
            <p className='text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed'>Your trusted healthcare companion for seamless doctor appointments and medical record management</p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <button onClick={() => navigate('/login')} className='glow-effect px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 w-full sm:w-auto'>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='container mx-auto px-4 py-20'>
        <div className='text-center mb-16 scroll-reveal'>
          <h2 className='text-3xl font-bold text-white mb-4'>Why Choose Meddok?</h2>
          <p className='text-gray-400'>Experience healthcare management like never before</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => (
            <div key={index} className='feature-card glass-effect rounded-xl p-6 text-center relative scroll-reveal' style={{ animationDelay: `${index * 100}ms` }}>
              <div className='w-16 h-16 mx-auto mb-4 p-3 bg-indigo-500/20 rounded-lg floating'>
                <feature.icon className='w-full h-full text-indigo-400' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>{feature.title}</h3>
              <p className='text-gray-400'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className='container mx-auto px-4 py-20'>
        <div className='max-w-5xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='scroll-reveal'>
              <h2 className='text-3xl font-bold text-white mb-6'>Everything You Need for Better Healthcare Management</h2>
              <div className='space-y-4'>
                {benefits.map((benefit, index) => (
                  <div key={index} className='flex items-center space-x-3 transform hover:translate-x-2 transition-transform duration-300'>
                    <CheckCircle className='w-6 h-6 text-green-400 flex-shrink-0' />
                    <span className='text-gray-300'>{benefit}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')} className='mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center group'>
                Join Now
                <ArrowRight className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform' />
              </button>
            </div>
            <div className='relative scroll-reveal'>
              <div className='aspect-square rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300'>
                <img src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' alt='Doctor using digital tablet' className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent'></div>
              </div>
              <div className='absolute -bottom-6 -right-6 bg-indigo-600/90 rounded-lg p-4 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300'>
                <div className='flex items-center space-x-2'>
                  <Users className='w-6 h-6 text-white' />
                  <div className='text-white'>
                    <div className='text-2xl font-bold'>10,000+</div>
                    <div className='text-sm'>Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='container mx-auto px-4 py-20'>
        <div className='max-w-4xl mx-auto glass-effect rounded-2xl p-12 text-center relative overflow-hidden scroll-reveal'>
          <div className='absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm'></div>
          <div className='absolute inset-0'>
            <div className='absolute top-0 left-0 w-24 h-24 bg-indigo-500 rounded-full filter blur-3xl opacity-20'></div>
            <div className='absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20'></div>
          </div>
          <div className='relative'>
            <div className='flex justify-center mb-6'>
              <div className='floating'>
                <Stethoscope className='w-16 h-16 text-indigo-400' />
              </div>
            </div>
            <h2 className='text-3xl font-bold text-white mb-4'>Ready to Transform Your Healthcare Experience?</h2>
            <p className='text-gray-300 mb-8'>Join thousands of users who have already discovered the convenience of managing their healthcare with Meddok</p>
            <button onClick={() => navigate('/register')} className='glow-effect px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300'>
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
