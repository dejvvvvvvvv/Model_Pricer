import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from '@/components/ui/WelcomeHeader';
import Header from '@/components/ui/Header';
import Container from '@/components/ui/Container';

const HostDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Načítání...</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <WelcomeHeader 
          name={user.displayName || 'hostiteli'}
          subtitle="Vítejte ve svém rozhraní. Zde spravujete svou tiskárnu a objednávky."
        />
        {/* Další obsah dashboardu přijde sem */}
      </Container>
    </>
  );
};

export default HostDashboard;