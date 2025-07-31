'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSignup = async () => {
  if (!form.name || !form.email || !form.password) {
    setSuccessMessage("All fields are required");
    return;
  }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage("User created successfully, please login.");
      setTimeout(() => router.push('/auth/login'), 2000);
      setForm({ name: '', email: '', password: '', role: 'user' }); // Reset form
    } else {
      setSuccessMessage(data.message || "Failed to create user");
    }
  } catch (error) {
    console.error(error);
    setSuccessMessage('Something went wrong. Please try again.');
  }
};


  return (
    <div>
      {successMessage && <p style={{ color: successMessage.includes("successfully") ? 'green' : 'red' }}>{successMessage}</p>}
      <h1>Signup</h1>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button onClick={handleSignup}>Register</button>
    </div>
  );
}
