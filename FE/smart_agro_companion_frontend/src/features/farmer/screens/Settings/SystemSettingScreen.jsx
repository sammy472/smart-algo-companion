import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AnimatedSwipeRightHint } from '@/src/features/farmer/components/animated-swipe-right-indicator';
import { SafeAreaView } from 'react-native-safe-area-context';

// Translations configuration
const translations = {
  en: {
    title: 'System Settings',
    device: 'Device Preferences',
    display: 'Display',
    darkMode: 'Dark Mode',
    sound: 'Sound & Vibration',
    battery: 'Battery',
    storage: 'Storage',
    connectivity: 'Connectivity',
    wifi: 'Wi-Fi',
    bluetooth: 'Bluetooth',
    location: 'Location',
    mobileNetwork: 'Mobile Network',
    notifications: 'Notifications',
    dnd: 'Do Not Disturb',
    appNotifications: 'App Notifications',
    security: 'Security & Privacy',
    biometric: 'Biometric Login',
    screenLock: 'Screen Lock',
    encryption: 'Encryption',
    deviceAdmin: 'Device Administrators',
    system: 'System',
    updates: 'System Update',
    language: 'Language & Input',
    backup: 'Backup & Restore',
    developer: 'Developer Options',
    advanced: 'Advanced',
    factoryReset: 'Factory Reset',
    connected: 'Connected',
    disabled: 'Disabled',
    on: 'On',
    off: 'Off',
    enabled: 'Enabled',
    simSettings: 'SIM 1 Settings',
    customizeAlerts: 'Customize alerts',
    schedule: 'Schedule',
    manageApps: 'Manage per app',
    setup: 'Set up',
    pattern: 'Pattern',
    encrypted: 'Device encrypted',
    activeAdmins: '2 active',
    lastBackup: 'Last backup: Today',
    eraseData: 'Erase all data',
    currentLanguage: 'English',
    selectLanguage: 'Select Language',
    cancel: 'Cancel',
  },
  es: {
    title: 'Configuración del Sistema',
    device: 'Preferencias',
    display: 'Pantalla',
    darkMode: 'Modo Oscuro',
    sound: 'Sonido y Vibración',
    battery: 'Batería',
    storage: 'Almacenamiento',
    connectivity: 'Conectividad',
    wifi: 'Wi-Fi',
    bluetooth: 'Bluetooth',
    location: 'Ubicación',
    mobileNetwork: 'Red Móvil',
    notifications: 'Notificaciones',
    dnd: 'No Molestar',
    appNotifications: 'Notificaciones de Apps',
    security: 'Seguridad y Privacidad',
    biometric: 'Inicio Biométrico',
    screenLock: 'Bloqueo de Pantalla',
    encryption: 'Encriptación',
    deviceAdmin: 'Administradores',
    system: 'Sistema',
    updates: 'Actualizaciones',
    language: 'Idioma y Entrada',
    backup: 'Respaldo y Restauración',
    developer: 'Opciones de Desarrollador',
    advanced: 'Avanzado',
    factoryReset: 'Restablecer de Fábrica',
    connected: 'Conectado',
    disabled: 'Desactivado',
    on: 'Activado',
    off: 'Desactivado',
    enabled: 'Habilitado',
    simSettings: 'Configuración SIM 1',
    customizeAlerts: 'Personalizar alertas',
    schedule: 'Programar',
    manageApps: 'Administrar por app',
    setup: 'Configurar',
    pattern: 'Patrón',
    encrypted: 'Dispositivo encriptado',
    activeAdmins: '2 activos',
    lastBackup: 'Último respaldo: Hoy',
    eraseData: 'Borrar todos los datos',
    currentLanguage: 'Español',
    selectLanguage: 'Seleccionar Idioma',
    cancel: 'Cancelar',
  },
  fr: {
    title: 'Paramètres du système',
    device: 'Préférences',
    display: 'Affichage',
    darkMode: 'Mode sombre',
    sound: 'Son et vibration',
    battery: 'Batterie',
    storage: 'Stockage',
    connectivity: 'Connectivité',
    wifi: 'Wi-Fi',
    bluetooth: 'Bluetooth',
    location: 'Localisation',
    mobileNetwork: 'Réseau mobile',
    notifications: 'Notifications',
    dnd: 'Ne pas déranger',
    appNotifications: 'Notifications des applications',
    security: 'Sécurité et confidentialité',
    biometric: 'Connexion biométrique',
    screenLock: 'Verrouillage écran',
    encryption: 'Chiffrement',
    deviceAdmin: 'Administrateurs',
    system: 'Système',
    updates: 'Mises à jour',
    language: 'Langue et saisie',
    backup: 'Sauvegarde et restauration',
    developer: 'Options développeur',
    advanced: 'Avancé',
    factoryReset: 'Réinitialisation',
    connected: 'Connecté',
    disabled: 'Désactivé',
    on: 'Activé',
    off: 'Désactivé',
    enabled: 'Activé',
    simSettings: 'Paramètres SIM 1',
    customizeAlerts: 'Personnaliser les alertes',
    schedule: 'Programmer',
    manageApps: 'Gérer par application',
    setup: 'Configurer',
    pattern: 'Modèle',
    encrypted: 'Appareil chiffré',
    activeAdmins: '2 actifs',
    lastBackup: 'Dernière sauvegarde: Aujourd\'hui',
    eraseData: 'Effacer toutes les données',
    currentLanguage: 'Français',
    selectLanguage: 'Choisir la langue',
    cancel: 'Annuler',
  }
};

const SystemSettingScreen = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [showLangModal, setShowLangModal] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    wifi: true,
    bluetooth: false,
    location: true,
    notifications: true,
    batterySaver: false,
    autoUpdate: true,
  });

  const t = translations[currentLang];

  const SettingsSection = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t[title]}</Text>
      {children}
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    value, 
    onPress, 
    isSwitch = false, 
    switchValue, 
    onValueChange 
  }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemLeft}>
        <MaterialIcons name={icon} size={24} color="#666" />
        <Text style={styles.itemTitle}>{t[title]}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: "#392867" }}
          thumbColor="#f4f3f4"
        />
      ) : (
        <View style={styles.itemRight}>
          <Text style={styles.itemValue}>{t[value] || value}</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );

  const LanguageModal = () => (
    <Modal
      transparent
      visible={showLangModal}
      animationType="slide"
      onRequestClose={() => setShowLangModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t.selectLanguage}</Text>
          
          {Object.keys(translations).map((lang) => (
            <Pressable
              key={lang}
              style={styles.langItem}
              onPress={() => {
                setCurrentLang(lang);
                setShowLangModal(false);
              }}
            >
              <Text style={styles.langText}>
                {translations[lang].currentLanguage}
              </Text>
              {currentLang === lang && (
                <MaterialIcons name="check" size={24} color="#392867" />
              )}
            </Pressable>
          ))}
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowLangModal(false)}
          >
            <Text style={styles.cancelText}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <AnimatedSwipeRightHint />
      <Text style={styles.headerTitle}>{t.title}</Text>

      <LanguageModal />

      <SettingsSection title="device">
        <SettingsItem
          icon="brightness-6"
          title="display"
          value="darkMode"
          isSwitch
          switchValue={settings.darkMode}
          onValueChange={(val) => setSettings({ ...settings, darkMode: val })}
        />
        <SettingsItem
          icon="volume-up"
          title="sound"
          value="customizeAlerts"
          onPress={() => alert(t.sound)}
        />
        <SettingsItem
          icon="battery-charging-full"
          title="battery"
          value={`${settings.batterySaver ? 'Saver' : 'Normal'} mode`}
          isSwitch
          switchValue={settings.batterySaver}
          onValueChange={(val) => setSettings({ ...settings, batterySaver: val })}
        />
        <SettingsItem
          icon="storage"
          title="storage"
          value="64 GB / 128 GB"
          onPress={() => alert(t.storage)}
        />
      </SettingsSection>

      <SettingsSection title="connectivity">
        <SettingsItem
          icon="wifi"
          title="wifi"
          value={settings.wifi ? "connected" : "disabled"}
          isSwitch
          switchValue={settings.wifi}
          onValueChange={(val) => setSettings({ ...settings, wifi: val })}
        />
        <SettingsItem
          icon="bluetooth"
          title="bluetooth"
          value={settings.bluetooth ? "on" : "off"}
          isSwitch
          switchValue={settings.bluetooth}
          onValueChange={(val) => setSettings({ ...settings, bluetooth: val })}
        />
        <SettingsItem
          icon="location-on"
          title="location"
          value={settings.location ? "enabled" : "disabled"}
          isSwitch
          switchValue={settings.location}
          onValueChange={(val) => setSettings({ ...settings, location: val })}
        />
        <SettingsItem
          icon="network-cell"
          title="mobileNetwork"
          value="simSettings"
          onPress={() => alert(t.mobileNetwork)}
        />
      </SettingsSection>

      <SettingsSection title="notifications">
        <SettingsItem
          icon="notifications"
          title="notifications"
          value="customizeAlerts"
          isSwitch
          switchValue={settings.notifications}
          onValueChange={(val) => setSettings({ ...settings, notifications: val })}
        />
        <SettingsItem
          icon="do-not-disturb"
          title="dnd"
          value="schedule"
          onPress={() => alert(t.dnd)}
        />
        <SettingsItem
          icon="apps"
          title="appNotifications"
          value="manageApps"
          onPress={() => alert(t.appNotifications)}
        />
      </SettingsSection>

      <SettingsSection title="security">
        <SettingsItem
          icon="fingerprint"
          title="biometric"
          value="setup"
          onPress={() => alert(t.biometric)}
        />
        <SettingsItem
          icon="lock"
          title="screenLock"
          value="pattern"
          onPress={() => alert(t.screenLock)}
        />
        <SettingsItem
          icon="enhanced-encryption"
          title="encryption"
          value="encrypted"
          onPress={() => alert(t.encryption)}
        />
        <SettingsItem
          icon="admin-panel-settings"
          title="deviceAdmin"
          value="activeAdmins"
          onPress={() => alert(t.deviceAdmin)}
        />
      </SettingsSection>

      <SettingsSection title="system">
        <SettingsItem
          icon="update"
          title="updates"
          value="Android 14"
          onPress={() => alert(t.updates)}
        />
        <SettingsItem
          icon="language"
          title="language"
          value="currentLanguage"
          onPress={() => setShowLangModal(true)}
        />
        <SettingsItem
          icon="backup"
          title="backup"
          value="lastBackup"
          onPress={() => alert(t.backup)}
        />
        <SettingsItem
          icon="developer-mode"
          title="developer"
          value="disabled"
          onPress={() => alert(t.developer)}
        />
      </SettingsSection>

      <SettingsSection title="advanced">
        <SettingsItem
          icon="warning"
          title="factoryReset"
          value="eraseData"
          onPress={() => {
            alert(t.factoryReset);
          }}
        />
      </SettingsSection>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
  },
  sectionContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
  itemValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  langText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    color: '#392867',
    fontWeight: '500',
  },
});

export default  SystemSettingScreen;