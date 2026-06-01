import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCategorias } from '../../hooks/useCategories';
import { useEtiquetas } from '../../hooks/useLabels';
import { GLOBAL_BRANDS } from '../../types/brands';

const CARD_COLORS = [
  '#3B82C4', '#F2C94C', '#EC5B8B', '#F2994A',
  '#9B6DFF', '#2F2F33', '#B5651D', '#1FA97A',
  '#E0533D', '#27AE60',
];

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function Home() {
  const categorias = useCategorias('');
  const etiquetas = useEtiquetas('');

  return (
    <View style={styles.container}>
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
        <Text style={styles.eyebrow}>CURATED FLAVORS</Text>
        <Text style={styles.title}>
          The art of <Text style={styles.titleAccent}>conscious</Text> discovery.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>View Library</Text>
          </Pressable>
        </View>

        {categorias.isLoading && (
          <View style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[styles.categoryCard, styles.skeleton]} />
            ))}
          </View>
        )}

        {categorias.isError && (
          <Text style={styles.sectionError}>No se pudieron cargar las categorías.</Text>
        )}

        {categorias.data && categorias.data.length > 0 && (
          <View style={styles.grid}>
            {categorias.data.map((cat, i) => (
              <Pressable
                key={cat}
                style={[styles.categoryCard, { backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }]}
                onPress={() => router.push(`/results/category/${encodeURIComponent(cat)}`)}
              >
                <Text style={styles.categoryName}>{capitalize(cat)}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, styles.blockTitle]}>Refine by Taste</Text>

        {etiquetas.isLoading && (
          <View style={styles.pillsRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[styles.pill, styles.pillSkeleton]} />
            ))}
          </View>
        )}

        {etiquetas.isError && (
          <Text style={styles.sectionError}>No se pudieron cargar las etiquetas.</Text>
        )}

        {etiquetas.data && etiquetas.data.length > 0 && (
          <View style={styles.pillsRow}>
            {etiquetas.data.map((label) => (
              <Pressable
                key={label}
                style={styles.pill}
                onPress={() => router.push(`/results/label/${encodeURIComponent(label)}`)}
              >
                <Text style={styles.pillText}>{label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, styles.blockTitle]}>Global Brands</Text>
        <Text style={styles.subtitle}>Explored through the lens of quality.</Text>

        <View style={styles.grid}>
          {GLOBAL_BRANDS.map((brand) => (
            <Pressable
              key={brand.query}
              style={styles.brandCard}
              onPress={() => router.push(`/results/brand/${encodeURIComponent(brand.query)}`)}
            >
              <View style={[styles.brandCircle, { backgroundColor: brand.color }]}>
                <Text style={styles.brandInitial}>{brand.name.charAt(0)}</Text>
              </View>
              <Text style={styles.brandName}>{brand.name}</Text>
            </Pressable>
          ))}
        </View>
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
  eyebrow: { fontSize: 12, fontWeight: '700', color: '#1B9E4B', letterSpacing: 1, marginTop: 8, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: '#1A1A1A', lineHeight: 38, marginBottom: 28 },
  titleAccent: { color: '#1B9E4B', fontStyle: 'italic' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  blockTitle: { marginTop: 16, marginBottom: 16 },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: -10, marginBottom: 16 },
  link: { fontSize: 14, color: '#1B9E4B', fontWeight: '600' },
  sectionError: { color: '#C0392B', fontSize: 14, paddingVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.05,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    justifyContent: 'flex-end',
  },
  categoryName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  skeleton: { backgroundColor: '#ECEDEF' },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { backgroundColor: '#E3F0DD', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  pillText: { color: '#3B6D2B', fontSize: 14, fontWeight: '600' },
  pillSkeleton: { width: 90, height: 38, backgroundColor: '#ECEDEF' },
  brandCard: {
    width: '48%',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    paddingVertical: 22,
    marginBottom: 14,
    alignItems: 'center',
    gap: 12,
  },
  brandCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  brandInitial: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  brandName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
});