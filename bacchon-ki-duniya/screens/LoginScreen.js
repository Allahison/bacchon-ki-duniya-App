import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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

  const isLockedOut = () => {
    if (!lockoutTime) return false;
    return new Date() < new Date(lockoutTime);
  };

  const login = async () => {
    if (isLockedOut()) {
      showTopToast('Too many failed attempts. Please try again later.');
      return;
    }

    if (!email || !password) {
      showTopToast('Please enter email and password');
      return;
    }

    if (!validateEmail(email)) {
      emailRef.current.shake(800);
      showTopToast('Invalid email format');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      passwordRef.current.shake(800);
      showTopToast(`Login Failed: ${error.message}`);
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);

      if (attempts >= 5) {
        const lockUntil = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 min lock
        setLockoutTime(lockUntil);
        showTopToast('Too many failed attempts. Locked for 5 minutes.');
      }
    } else {
      showTopToast('✅ Logged in successfully!', 'success');
      setLoginAttempts(0);
      navigation.replace('Home');
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      showTopToast('Enter a valid email to reset password');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      showTopToast('Error sending reset email');
    } else {
      showTopToast('Reset email sent!', 'success');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f8e9' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f8e9" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            👋 Welcome Back
          </Animatable.Text>

          <Animatable.Image
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            source={require('../assets/downloadb.png')}
            style={{ height: 140, width: 140, alignSelf: 'center', marginBottom: 20 }}
          />

          <Animatable.View ref={emailRef} style={styles.inputWrapper}>
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
          </Animatable.View>

          <Animatable.View ref={passwordRef} style={styles.inputWrapper}>
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
          </Animatable.View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 15 }}>
            <Text style={{ color: '#33691e', textAlign: 'center', textDecorationLine: 'underline' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
            Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    backgroundColor: '#f1f8e9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#33691e',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#aed581',
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
  button: {
    backgroundColor: '#558b2f',
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
    color: '#33691e',
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
