import { CheckCircle, Shield, Wrench, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Maintenance = () => {
  const plans = [
    {
      name: 'Basic',
      price: 2500,
      period: 'per year',
      description: 'Essential maintenance for small setups',
      cameras: 'Up to 4 cameras',
      features: [
        'Quarterly system check',
        'Camera lens cleaning',
        'DVR health check',
        'Cable inspection',
        'Phone support',
      ],
      popular: false,
    },
    {
      name: 'Standard',
      price: 5000,
      period: 'per year',
      description: 'Complete coverage for medium setups',
      cameras: 'Up to 8 cameras',
      features: [
        'Bi-monthly system check',
        'Camera lens cleaning',
        'DVR maintenance & backup',
        'Cable & connector replacement',
        'Priority phone support',
        'Free minor repairs',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: 10000,
      period: 'per year',
      description: 'Comprehensive care for large systems',
      cameras: 'Up to 16 cameras',
      features: [
        'Monthly system check',
        'Complete camera servicing',
        'DVR optimization & backup',
        'All cables & connectors included',
        '24/7 priority support',
        'Free repairs (parts extra)',
        'Remote monitoring setup',
        'Quarterly performance report',
      ],
      popular: false,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Wrench className="w-4 h-4" />
            Annual Maintenance Contracts
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Maintenance Plans</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Keep your CCTV system running at peak performance with our comprehensive maintenance plans.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card p-6 relative ${
                plan.popular ? 'border-primary glow-effect' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="font-display text-4xl font-bold gradient-text">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-muted-foreground text-sm"> /{plan.period}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                  <Shield className="w-3 h-3" />
                  {plan.cameras}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                >
                  Get This Plan
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-1">Quick Response</h4>
              <p className="text-sm text-muted-foreground">24-48 hour response for AMC customers</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-1">Certified Technicians</h4>
              <p className="text-sm text-muted-foreground">Trained professionals for all repairs</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-1">Dedicated Support</h4>
              <p className="text-sm text-muted-foreground">Priority helpline for AMC holders</p>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-border/50">
            <p className="text-muted-foreground mb-4">Need a custom plan for more cameras?</p>
            <Link to="/contact">
              <Button variant="accent">
                Contact for Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
