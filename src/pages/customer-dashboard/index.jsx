import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from '@/components/ui/WelcomeHeader';
import Container from '@/components/ui/Container';

const CustomerDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Načítání...</div>;
  }

  return (
    <>
      <Container>
        <WelcomeHeader 
          name={user.displayName || 'zákazníku'}
          subtitle="Zde naleznete přehled svých objednávek a nahraných modelů."
        />
        {/* Další obsah dashboardu přijde sem */}
      </Container>
    </>
  );
};

export default CustomerDashboard;