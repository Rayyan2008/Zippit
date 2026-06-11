import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Confirmed — Thank You</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>

      <div className="min-h-screen bg-cream text-ink flex flex-col">
        <Header cartCount={0} />
        
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rouge/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-rouge" />
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl tracking-tightest text-ink mb-4">
              Order confirmed
            </h1>
            
            <p className="text-lg text-ink/70 leading-relaxed mb-8">
              Thank you for your purchase. You will receive an email confirmation shortly with your order details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-ink text-cream hover:bg-ink/90">
                <Link to="/">Continue shopping</Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;