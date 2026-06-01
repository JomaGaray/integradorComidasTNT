import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScoreCard from '../../components/ScoreCard';
import { useFavorites } from '../../context/FavoritesContext';
import { useProductByCode } from '../../hooks/useProducts';
import { gradeColor, novaColor } from '../../lib/scores';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const code = id ?? '';

  const { data: product, isLoading, isError, error, refetch } = useProductByCode(code);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1B7A3D" />
          </Pressable>
          <Text style={styles.headerTitle}>Digital Epicurean</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="share-social-outline" size={22} color="#1B7A3D" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* CARGANDO */}
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1B9E4B" />
          <Text style={styles.centeredText}>Cargando producto…</Text>
        </View>
      )}

      {/* ERROR */}
      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'No se pudo cargar el producto'}
          </Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {/* DATOS OK */}
      {product && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View>
            <View style={[styles.hero, { backgroundColor: product.heroColor }]}>
              {product.imageUrl ? (
                <Image source={{ uri: product.imageUrl }} style={styles.heroImage} resizeMode="contain" />
              ) : (
                <View style={styles.heroPlaceholder}>
                  <Ionicons name="cafe-outline" size={64} color="rgba(255,255,255,0.85)" />
                </View>
              )}
            </View>

            <View style={[styles.card, styles.headerCard]}>
              {!!product.brand && <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>}
              <Text style={styles.name}>{product.name}</Text>

              <View style={styles.scoresRow}>
                {product.nutriScore && (
                  <ScoreCard
                    label="Nutri-Score"
                    value={product.nutriScore}
                    color={gradeColor(product.nutriScore)}
                  />
                )}
                {typeof product.novaGroup === 'number' &&
                  product.novaGroup >= 1 &&
                  product.novaGroup <= 4 && (
                    <ScoreCard
                      label="NOVA Group"
                      value={String(product.novaGroup)}
                      color={novaColor(product.novaGroup as 1 | 2 | 3 | 4)}
                    />
                  )}
                {product.ecoScore && (
                  <ScoreCard
                    label="Eco-Score"
                    value={product.ecoScore}
                    color={gradeColor(product.ecoScore)}
                    leaf
                  />
                )}
              </View>

              {product.highlights.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.highlightsRow}
                >
                  {product.highlights.map((h) => (
                    <View key={h.label} style={styles.highlightChip}>
                      <Text style={styles.highlightLabel}>{h.label}</Text>
                      <Text style={styles.highlightValue}>{h.value}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            <Pressable
              style={styles.favButton}
              onPress={() => toggleFavorite(product.id)}
              hitSlop={8}
              accessibilityLabel={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Ionicons
                name={isFavorite(product.id) ? 'heart' : 'heart-outline'}
                size={26}
                color={isFavorite(product.id) ? '#1B9E4B' : '#9AA0A6'}
              />
            </Pressable>
          </View>

          {/* Ingredientes + alérgenos */}
          {(product.ingredients !== '—' || product.allergens) && (
            <View style={styles.card}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="leaf" size={18} color="#1B9E4B" />
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              <Text style={styles.bodyText}>{product.ingredients}</Text>

              {product.allergens && (
                <View style={styles.allergenBox}>
                  <Ionicons name="warning" size={18} color="#C0392B" />
                  <View style={styles.allergenTextWrap}>
                    <Text style={styles.allergenTitle}>ALLERGEN INFORMATION</Text>
                    <Text style={styles.allergenText}>{product.allergens}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {product.nutrition.rows.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.nutritionTitle}>
                Nutritional Values{' '}
                <Text style={styles.nutritionPer}>({product.nutrition.perLabel})</Text>
              </Text>
              {product.nutrition.rows.map((row, i) => (
                <View
                  key={`${row.label}-${i}`}
                  style={[styles.nutritionRow, i > 0 && styles.nutritionRowBorder]}
                >
                  <Text style={[styles.nutritionLabel, row.indented && styles.nutritionLabelIndented]}>
                    {row.indented ? `— of which ${row.label}` : row.label}
                  </Text>
                  <Text style={styles.nutritionValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const HERO_HEIGHT = 380;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },

  headerSafe: { backgroundColor: '#fff' },
  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1B7A3D' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  centeredText: { color: '#6B7280', fontSize: 14 },

  scrollContent: { paddingBottom: 40 },

  hero: {
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: { width: '70%', height: '85%' },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },

  favButton: {
    position: 'absolute',
    right: 24,
    top: HERO_HEIGHT - 28, // borde entre el hero y la tarjeta
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  headerCard: { marginTop: -28 },

  brand: { fontSize: 12, fontWeight: '700', color: '#1B9E4B', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', lineHeight: 34, marginBottom: 18 },

  scoresRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },

  highlightsRow: { gap: 10, paddingRight: 4 },
  highlightChip: {
    backgroundColor: '#E8F0E5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 84,
  },
  highlightLabel: { fontSize: 10, fontWeight: '700', color: '#5C715A', letterSpacing: 0.5, marginBottom: 4 },
  highlightValue: { fontSize: 16, fontWeight: '700', color: '#2C3A2A' },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  bodyText: { fontSize: 14, lineHeight: 21, color: '#4B5563' },

  allergenBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  allergenTextWrap: { flex: 1 },
  allergenTitle: { fontSize: 11, fontWeight: '800', color: '#C0392B', letterSpacing: 0.5, marginBottom: 3 },
  allergenText: { fontSize: 13, lineHeight: 19, color: '#C0392B' },

  nutritionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  nutritionPer: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  nutritionRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  nutritionLabel: { fontSize: 15, color: '#374151' },
  nutritionLabelIndented: { fontStyle: 'italic', color: '#6B7280', paddingLeft: 14 },
  nutritionValue: { fontSize: 15, fontWeight: '700', color: '#111827' },

  errorText: { color: '#C0392B', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  retryBtn: { backgroundColor: '#C0392B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '700' },
});