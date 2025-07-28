'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const router = useRouter();

// Function to handle Google login
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  // Function to handle email/password login
  const handleCredentialsLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {  
      setSuccessMessage("Email and password are required");
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Login successful");
        setLoginSuccess(true);
        // Redirect or perform any other action on successful login
        // how can i redirect to the page that was not allowed to access before login?
        setTimeout(() => router.push(callbackUrl), 2000);
        setForm({ email: '', password: '' }); // Reset form
      } else {
        setSuccessMessage(data.message || "Login failed");
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage('Something went wrong. Please try again.');
    }
  };
      
  return (
    <div>
      {successMessage && <p style={{ color: loginSuccess ? 'green' : 'red' }}>{successMessage}</p>}
      <h1>Login</h1>
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleCredentialsLogin}>Login</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
