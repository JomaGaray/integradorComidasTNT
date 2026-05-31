// app/index.tsx
// HOME. Por ahora nos enfocamos en las CATEGORÍAS dinámicas (vienen de la API).
// El resto de las secciones del mockup (Refine by Taste, Global Brands, tab bar)
// las sumamos en pasos siguientes.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCategorias } from '../hooks/useCategorias';

// Paleta que rotamos para pintar las tarjetas (la API solo nos da el nombre).
const CARD_COLORS = [
  '#3B82C4', '#F2C94C', '#EC5B8B', '#F2994A',
  '#9B6DFF', '#2F2F33', '#B5651D', '#1FA97A',
  '#E0533D', '#27AE60',
]; 

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Home() {
  // "" => sugerencias generales. Si querés filtrar, pasale un término, ej: useCategorias('Bebidas')
  const { data: categories, isLoading, isError, error, refetch } = useCategorias('');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <Pressable hitSlop={10}>
            <Ionicons name="menu" size={26} color="#1A1A1A" />
          </Pressable>
          <Text style={styles.headerTitle}>Digital Epicurean</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="person-circle-outline" size={28} color="#1A1A1A" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* INTRO */}
        <Text style={styles.eyebrow}>CURATED FLAVORS</Text>
        <Text style={styles.title}>
          The art of <Text style={styles.titleAccent}>conscious</Text> discovery.
        </Text>

        {/* CATEGORÍAS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable hitSlop={8}>
            
            <Text style={styles.link}>View Library</Text>
          </Pressable>
        </View>

        {/* Estado: cargando */}
        {isLoading && (
          <View style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[styles.categoryCard, styles.skeleton]} />
            ))}
          </View>
        )}

        {/* Estado: error */}
        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              No se pudieron cargar las categorías.
            </Text>
            <Text style={styles.errorDetail}>
              {error instanceof Error ? error.message : 'Error desconocido'}
            </Text>
            <Pressable style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* Estado: datos OK */}
        {categories && categories.length > 0 && (
          <View style={styles.grid}>
            {categories.map((cat, i) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryCard,
                  { backgroundColor: CARD_COLORS[i % CARD_COLORS.length] },
                ]}
                onPress={() => router.push(`/category/${encodeURIComponent(cat)}`)}
              >
                <Text style={styles.categoryName}>{capitalize(cat)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Estado: vacío */}
        {categories && categories.length === 0 && (
          <Text style={styles.empty}>No hay categorías para mostrar.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  headerSafe: { backgroundColor: '#FFFFFF' },
  header: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1B7A3D' },

  content: { paddingHorizontal: 20, paddingBottom: 40 },

  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B9E4B',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 38,
    marginBottom: 28,
  },
  titleAccent: {
    color: '#1B9E4B',
    fontStyle: 'italic',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  link: { fontSize: 14, color: '#1B9E4B', fontWeight: '600' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.05,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    justifyContent: 'flex-end',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skeleton: {
    backgroundColor: '#ECEDEF',
  },

  empty: { color: '#6B7280', fontSize: 14, paddingVertical: 20 },

  errorBox: {
    backgroundColor: '#FDECEA',
    borderRadius: 14,
    padding: 18,
    alignItems: 'flex-start',
    gap: 8,
  },
  errorText: { color: '#C0392B', fontWeight: '700', fontSize: 15 },
  errorDetail: { color: '#C0392B', fontSize: 13 },
  retryBtn: {
    marginTop: 6,
    backgroundColor: '#C0392B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
});