/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { UserProfile } from './types';
import { Header } from './components/Header';
import { BottomNavigation, ScreenId } from './components/BottomNavigation';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { InventoryScreen } from './components/screens/InventoryScreen';
import { SalesScreen } from './components/screens/SalesScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { AcademyScreen } from './components/screens/AcademyScreen';
import { DigitalToolsScreen } from './components/screens/DigitalToolsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { SyncStatusModal } from './components/SyncStatusModal';
import { UserSwitchModal } from './components/UserSwitchModal';
import { exportAndroidProjectZip } from './utils/zipExporter';
import { ACADEMY_MODULES } from './data/academyModulesData';

export default function App() {
  const [, setTick] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [isDeviceMode, setIsDeviceMode] = useState<boolean>(false);

  // Modals State
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isUserSwitchOpen, setIsUserSwitchOpen] = useState(false);

  // Re-render when storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentUser: UserProfile = storage.getCurrentUser();
  const isOnline: boolean = storage.isOnline();
  const pendingSyncCount: number = storage.getPendingSyncCount();

  // Metrics for badges
  const userProducts = storage.getProducts(currentUser.id);
  const lowStockCount = userProducts.filter((p) => p.stock <= p.minStockAlert).length;
  
  const allAcademyLessons = ACADEMY_MODULES.flatMap((m) => m.lessons);
  const userCompletedLessons = storage.getLessonProgress(currentUser.id);
  const trainingPercent =
    allAcademyLessons.length > 0
      ? Math.round((userCompletedLessons.length / allAcademyLessons.length) * 100)
      : 0;
  const userCertificates = storage.getCertificates(currentUser.id);

  const handleExportZip = async () => {
    try {
      await exportAndroidProjectZip();
    } catch (err) {
      console.error('Error exporting zip:', err);
      alert('Error al generar el archivo .zip del proyecto Android.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col font-sans text-slate-800">
      
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
        onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenUserSwitchModal={() => setIsUserSwitchOpen(true)}
        onExportZip={handleExportZip}
        isDeviceMode={isDeviceMode}
        onToggleDeviceMode={() => setIsDeviceMode(!isDeviceMode)}
      />

      {/* Main Content Area (Wrapped in Android Device Frame or Responsive View) */}
      <main className="flex-1 flex flex-col">
        <AndroidDeviceFrame isDeviceMode={isDeviceMode} isOnline={isOnline}>
          <div className="flex-1 flex flex-col pb-16">
            {currentScreen === 'welcome' && (
              <WelcomeScreen
                currentUser={currentUser}
                onNavigate={setCurrentScreen}
                onOpenUserSwitch={() => setIsUserSwitchOpen(true)}
                onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
                onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
              />
            )}

            {currentScreen === 'inventory' && (
              <InventoryScreen currentUser={currentUser} />
            )}

            {currentScreen === 'sales' && (
              <SalesScreen currentUser={currentUser} />
            )}

            {currentScreen === 'training' && (
              <AcademyScreen currentUser={currentUser} />
            )}

            {currentScreen === 'tools' && (
              <DigitalToolsScreen currentUser={currentUser} />
            )}

            {currentScreen === 'reports' && (
              <ReportsScreen currentUser={currentUser} />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                currentUser={currentUser}
                onNavigate={setCurrentScreen}
                onOpenUserSwitch={() => setIsUserSwitchOpen(true)}
                onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
                onExportZip={handleExportZip}
              />
            )}
          </div>

          {/* Sticky Bottom Navigation with 7 primary destinations */}
          <div className="sticky bottom-0 left-0 right-0 z-20">
            <BottomNavigation
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
              inventoryCount={userProducts.length}
              lowStockCount={lowStockCount}
              trainingProgressPercent={trainingPercent}
              certificateCount={userCertificates.length}
            />
          </div>
        </AndroidDeviceFrame>
      </main>

      {/* Global Modals */}
      <AndroidCodeModal
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
        onExportZip={handleExportZip}
      />

      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
        onOpenAndroidCode={() => {
          setIsProjectInfoOpen(false);
          setIsAndroidCodeOpen(true);
        }}
        onExportZip={handleExportZip}
      />

      <SyncStatusModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isOnline={isOnline}
      />

      <UserSwitchModal
        isOpen={isUserSwitchOpen}
        onClose={() => setIsUserSwitchOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
