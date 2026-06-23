import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('nsla_user');
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return <div style={{ padding: '40px', textAlign: 'center' }}>Loading NSLA CarShip...</div>;
}
