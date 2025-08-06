import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase'; // ✅ make sure this path is correct

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationEnabled, setNotificationEnabled] = React.useState(true);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await supabase.auth.signOut(); // ✅ real logout
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>App Settings</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>👤 Profile</Text>
      </TouchableOpacity>

      <View style={styles.option}>
        <Text style={styles.optionText}>🔔 Notifications</Text>
        <Switch
          value={isNotificationEnabled}
          onValueChange={() => setNotificationEnabled(!isNotificationEnabled)}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>🌗 Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
        />
      </View>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>🌐 Language</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff5e5e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
