import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { gradeColor } from '../lib/scores';
import { MyProduct } from '../transformers/search-products';

type Props = {
  product: MyProduct;
  onPress?: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="restaurant-outline" size={26} color="#B9BCC2" />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {!!product.brand && <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>}

        <View style={styles.badges}>
          {product.nutriScore && (
            <View style={[styles.nutriBadge, { backgroundColor: gradeColor(product.nutriScore) }]}>
              <Text style={styles.nutriText}>NUTRI-SCORE {product.nutriScore}</Text>
            </View>
          )}
          {product.ecoScore && (
            <View style={styles.ecoBadge}>
              <Text style={styles.ecoText}>ECO-SCORE {product.ecoScore}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#C4C7CC" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F1F2F4',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  brand: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AA0A6',
    letterSpacing: 0.3,
    marginTop: 2,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  nutriBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  nutriText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  ecoBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#DCEDD5',
  },
  ecoText: {
    color: '#3B6D2B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});