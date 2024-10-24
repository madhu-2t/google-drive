import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
      phone_no: phone_no,
    };

    try {
      const response = await fetch('http://localhost:4000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        const folder = result.user.folder;
        // Navigate to the folder list component, passing the folder data in state
        navigate('/folders', { state: { folder } });
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_no}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
