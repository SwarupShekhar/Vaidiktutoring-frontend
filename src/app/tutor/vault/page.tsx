'use client';

import React from 'react';
import VaultManagementSection from '@/app/components/admin/VaultManagementSection';
import ProtectedClient from '@/app/components/ProtectedClient';

export default function TutorVaultPage() {
  return (
    <ProtectedClient roles={['tutor']}>
      <div className="container mx-auto py-8">
        <VaultManagementSection />
      </div>
    </ProtectedClient>
  );
}
