import React from 'react';
import VaultManagementSection from '@/app/components/admin/VaultManagementSection';

export const metadata = {
  title: 'Admin Vault | Materials Management',
  description: 'Manage session materials and clean documents in the secure vault.',
};

export default function AdminVaultPage() {
  return (
    <div className="container mx-auto py-8">
      <VaultManagementSection />
    </div>
  );
}
