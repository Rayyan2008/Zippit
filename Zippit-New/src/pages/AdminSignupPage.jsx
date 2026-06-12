import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import bcrypt from 'bcryptjs';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AdminSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      // Check if admin already exists
      const storedAdmins = localStorage.getItem('admin_users');
      const admins = storedAdmins ? JSON.parse(storedAdmins) : [];

      if (admins.find((u) => u.email === email)) {
        setError('An admin account with this email already exists');
        setIsLoading(false);
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new admin user
      const newAdmin = {
        id: `admin_${Date.now()}`,
        name,
        email,
        passwordHash,
        authMethod: 'email',
        createdAt: new Date().toISOString(),
      };

      admins.push(newAdmin);
      localStorage.setItem('admin_users', JSON.stringify(admins));

      // Login user
      login({
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        authMethod: 'email',
        loginTime: new Date().toISOString(),
      });

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
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
        // Create new admin user via Google
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
      console.error('Google signup error:', error);
      setError('Google signup failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
            Zippit Admin
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Create your admin account
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
              text="signup_with"
              width="100%"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
