import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';
import { Mail, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        // Log it, but don't expose if the user exists or not if possible.
        // Actually, Supabase returns success even if user doesn't exist by default for security.
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50/50 py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Research<span className="text-blue-600">Tracker</span>
          </h1>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-xl border-gray-200/50 mx-4 sm:mx-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
            <p className="text-sm text-gray-500 text-center">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-100">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-100 text-center">
                <p className="font-medium">Check your email</p>
                <p className="mt-1">
                  If an account exists for <strong>{email}</strong>, you'll receive password-reset instructions shortly.
                </p>
                <div className="mt-6">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <Button type="submit" className="w-full h-11 text-base shadow-sm" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </Button>

                <div className="mt-4 text-center">
                  <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
