import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../../components/ProductCard';
import { useFavorites } from '../../context/FavoritesContext';
import { useFavoritos } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { favorites, isFavorite } = useFavorites();
  const { data, isLoading, isError, error, refetch } = useFavoritos();

  const products = (data?.products ?? []).filter((p) => isFavorite(p.id));

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.count}>
          {favorites.length} {favorites.length === 1 ? 'GUARDADO' : 'GUARDADOS'}
        </Text>
      </SafeAreaView>

      <FlatList
        data={products}
        keyExtractor={(item, i) => item.id || String(i)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
        )}
        ListEmptyComponent={
          favorites.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="heart-outline" size={48} color="#C4C7CC" />
              <Text style={styles.emptyTitle}>Todavía no marcaste favoritos</Text>
              <Text style={styles.emptyText}>
                Tocá el corazón en el detalle de un producto y va a aparecer acá.
              </Text>
            </View>
          ) : isLoading ? (
            <View>
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : isError ? (
            <Text style={styles.error}>
              {error instanceof Error ? error.message : 'No se pudieron cargar los favoritos'}
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  headerSafe: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginTop: 8 },
  count: { fontSize: 12, fontWeight: '600', color: '#9AA0A6', letterSpacing: 1, marginTop: 2 },

  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },

  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptyText: { fontSize: 14, color: '#9AA0A6', textAlign: 'center', paddingHorizontal: 32 },

  error: { color: '#C0392B', fontSize: 14, textAlign: 'center', paddingVertical: 32 },
  skeletonCard: { height: 96, borderRadius: 16, backgroundColor: '#ECEDEF', marginBottom: 14 },
});