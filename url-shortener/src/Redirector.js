// Redirector.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Redirector() {
  const { code } = useParams();

  useEffect(() => {
    async function fetchAndRedirect() {
      try {
        const res = await axios.get(`http://localhost:5000/expand/${code}`);
        window.location.href = res.data.url;
      } catch (err) {
        alert('Link expired or invalid');
      }
    }

    fetchAndRedirect();
  }, [code]);

  return <p>Redirecting...</p>;
}
