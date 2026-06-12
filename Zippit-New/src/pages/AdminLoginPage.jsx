import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TEMPORARY: Use dev login for development
      const devResult = devLogin(email, password);
      if (devResult.success) {
        // Refetch user from context to ensure it's updated
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          navigate('/admin/dashboard');
        }
        return;
      }

      // If dev login fails, show error
      setError(devResult.error || 'Login failed');
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userId = decoded.sub;

      // Get or create admin user
      const storedAdmins = localStorage.getItem('admin_users');
      let admins = storedAdmins ? JSON.parse(storedAdmins) : [];

      let adminUser = admins.find((u) => u.googleId === userId);

      if (!adminUser) {
        // Auto-create admin user on first Google login
        adminUser = {
          id: `admin_${userId}`,
          googleId: userId,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          authMethod: 'google',
          createdAt: new Date().toISOString(),
        };
        admins.push(adminUser);
        localStorage.setItem('admin_users', JSON.stringify(admins));
      }

      login({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        picture: adminUser.picture,
        authMethod: 'google',
        loginTime: new Date().toISOString(),
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
            Zippit Admin
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to manage your store
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              width="100%"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zippit.store"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/admin/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
