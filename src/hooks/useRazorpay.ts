import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  listenerId: string;
  listenerName: string;
  bookingType: 'voice' | 'video';
  amount: number;
  userEmail: string;
  userName: string;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    if (document.getElementById('razorpay-script')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);
  }, []);

  const initiatePayment = async ({
    listenerId,
    listenerName,
    bookingType,
    amount,
    userEmail,
    userName,
    onSuccess,
    onError,
  }: RazorpayOptions) => {
    if (!scriptLoaded) {
      onError('Payment gateway not loaded');
      return;
    }

    setLoading(true);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to continue');
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            listener_id: listenerId,
            booking_type: bookingType,
            amount,
          },
        }
      );

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BaatCheet',
        description: `${bookingType === 'video' ? 'Video' : 'Voice'} session with ${listenerName}`,
        order_id: orderData.order_id,
        prefill: {
          email: userEmail,
          name: userName,
        },
        theme: {
          color: '#38bdf8',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  listener_id: listenerId,
                  booking_type: bookingType,
                  amount,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              throw new Error(verifyError?.message || 'Payment verification failed');
            }

            onSuccess(verifyData.booking_id);
          } catch (error: any) {
            onError(error.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        onError(response.error.description || 'Payment failed');
        setLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      onError(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return { initiatePayment, loading, scriptLoaded };
}
