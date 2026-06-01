import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProductCard from '../../components/ProductCard';
import { useBusqueda } from '../../hooks/useSearch';

export default function SearchScreen() {
  const [text, setText] = useState('');
  const [term, setTerm] = useState('');

  // Debounce: esperamos 350ms sin tipear antes de disparar la búsqueda.
  useEffect(() => {
    const t = setTimeout(() => setTerm(text), 350);
    return () => clearTimeout(t);
  }, [text]);

  const { data, isLoading, isError, error } = useBusqueda(term);
  const products = data?.products ?? [];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9AA0A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search juices, craft sodas, teas..."
            placeholderTextColor="#9AA0A6"
            value={text}
            onChangeText={setText}
            autoCorrect={false}
            returnKeyType="search"
          />
          {text.length > 0 && (
            <Ionicons name="close-circle" size={18} color="#C4C7CC" onPress={() => setText('')} />
          )}
        </View>
      </SafeAreaView>

      <FlatList
        data={products}
        keyExtractor={(item, i) => item.id || String(i)}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
        )}
        ListEmptyComponent={
          term.trim().length <= 1 ? (
            <Text style={styles.hint}>Escribí algo para buscar productos.</Text>
          ) : isLoading ? (
            <View>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : isError ? (
            <Text style={styles.error}>
              {error instanceof Error ? error.message : 'Error en la búsqueda'}
            </Text>
          ) : (
            <Text style={styles.hint}>Sin resultados para “{term}”.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  headerSafe: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginTop: 8, marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECEDF0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },

  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  hint: { color: '#6B7280', fontSize: 14, textAlign: 'center', paddingVertical: 32 },
  error: { color: '#C0392B', fontSize: 14, textAlign: 'center', paddingVertical: 32 },
  skeletonCard: { height: 96, borderRadius: 16, backgroundColor: '#ECEDEF', marginBottom: 14 },
});