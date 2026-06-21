import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import DesignManager from '../components/admin/DesignManager';
import ContactManager from '../components/admin/ContactManager';
import BackupManager from '../components/admin/BackupManager';
import AdminNotice from '../components/admin/AdminNotice';
import { TextManager } from '../components/admin/TextManager';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('textos'); // Cambiar el tab inicial si se desea

  const renderContent = () => {
    switch (activeTab) {
      case 'textos': return <TextManager />;
      case 'obras': return <ProductManager />;
      case 'categorias': return <CategoryManager />;
      case 'diseno': return <DesignManager />;
      case 'contacto': return <ContactManager />;
      case 'respaldo': return <BackupManager />;
      default: return <ProductManager />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AdminNotice />
      <div className="bg-white shadow rounded-lg p-6">
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
