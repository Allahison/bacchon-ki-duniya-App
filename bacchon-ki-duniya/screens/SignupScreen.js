import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return 'Strong';
    return 'Medium';
  };

  const showTopToast = (message, type = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'top',
      visibilityTime: 2500,
      autoHide: true,
      topOffset: 60,
    });
  };

  const signup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showTopToast('❗ Please fill in all fields');
      return;
    }

    if (!isEmailValid(email)) {
      showTopToast('📧 Invalid email format');
      return;
    }

    if (password.length < 6) {
      showTopToast('🔐 Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showTopToast('❌ Passwords do not match');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showTopToast(`🚫 Signup Failed: ${error.message}`);
    } else {
      const user = data.user;
      if (user) {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          avatar_url: '',
        });
      }

      showTopToast('✅ Signup Successful! Please check your email.', 'success');
      navigation.navigate('Login');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000ff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#e0f7fa" />

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          ✨ Create Account
        </Animatable.Text>

        <Animatable.Image
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          source={require('../assets/downloadb.png')}
          style={{ height: 140, width: 140, alignSelf: 'center', marginBottom: 20 }}
        />

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <Text style={styles.strength}>
            Password Strength: {getPasswordStrength(password)}
          </Text>
        )}

        <View style={styles.inputWrapper}>
          <Ionicons name="checkmark-done-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={signup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    backgroundColor: '#e0f7fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004d40',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  strength: {
    color: '#555',
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#004d40',
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
