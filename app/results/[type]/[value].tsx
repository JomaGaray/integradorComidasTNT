import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InfiniteFooter from '../../../components/InfiniteFooter';
import ProductCard from '../../../components/ProductCard';
import { useProductsInfinite } from '../../../hooks/useProductsInfinite';
import { SearchType } from '../../../services/productsService';

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const VALID_TYPES: SearchType[] = ['category', 'label', 'brand'];

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ type: string; value: string }>();
  const value = params.value ?? '';
  const type: SearchType = VALID_TYPES.includes(params.type as SearchType)
    ? (params.type as SearchType)
    : 'category';

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsInfinite(type, value);

  const [search, setSearch] = useState('');

  // "data.pages" es un ARRAY DE PÁGINAS: [{products:[...]}, {products:[...]}, ...].
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.count;

  // filtro local sobre lo ya cargado (no dispara mas requests)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }, [allProducts, search]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.topBar}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1B7A3D" />
          </Pressable>
          <Text style={styles.topTitle}>Digital Epicurean</Text>
          <Ionicons name="person-circle-outline" size={26} color="#1A1A1A" />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => item.id || String(i)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.title}>{capitalize(value)}</Text>
            <Text style={styles.count}>
              {totalCount !== undefined ? `${totalCount.toLocaleString()} ITEMS FOUND` : ' '}
            </Text>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#9AA0A6" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search within results..."
                placeholderTextColor="#9AA0A6"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
        )}
        // CLAVE del scroll infinito: cuando el usuario llega cerca del final,
        // pedimos la página siguiente (si hay y si no está ya cargando).
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && search.trim().length === 0) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          <InfiniteFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            hasItems={filtered.length > 0}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : isError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>No se pudieron cargar los productos.</Text>
              <Text style={styles.errorDetail}>
                {error instanceof Error ? error.message : 'Error desconocido'}
              </Text>
              <Pressable style={styles.retryBtn} onPress={() => refetch()}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.empty}>No se encontraron productos para “{value}”.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  headerSafe: { backgroundColor: '#FFFFFF' },
  topBar: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#1B7A3D' },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  listHeader: { paddingTop: 8 },
  title: { fontSize: 34, fontWeight: '800', color: '#1A1A1A' },
  count: { fontSize: 13, fontWeight: '600', color: '#9AA0A6', letterSpacing: 1, marginTop: 2, marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECEDF0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  skeletonCard: { height: 96, borderRadius: 16, backgroundColor: '#ECEDEF', marginBottom: 14 },
  empty: { color: '#6B7280', fontSize: 14, paddingVertical: 24, textAlign: 'center' },
  errorBox: { backgroundColor: '#FDECEA', borderRadius: 14, padding: 18, gap: 8 },
  errorText: { color: '#C0392B', fontWeight: '700', fontSize: 15 },
  errorDetail: { color: '#C0392B', fontSize: 13 },
  retryBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#C0392B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
});