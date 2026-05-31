// components/ScoreCard.tsx
// Las tarjetas grandes de score que se ven en el detalle (Nutri-Score, NOVA, Eco-Score).

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  /** Etiqueta superior, ej: "NUTRI-SCORE" */
  label: string;
  /** Texto del recuadro de color, ej: "A" o "1" */
  value: string;
  /** Color de fondo del recuadro */
  color: string;
  /** Muestra una hojita (lo usamos en Eco-Score) */
  leaf?: boolean;
};

export default function ScoreCard({ label, value, color, leaf }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, { backgroundColor: color }]}>
        <Text style={styles.value}>{value}</Text>
        {leaf && <Ionicons name="leaf" size={16} color="#fff" style={styles.leaf} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  box: {
    minWidth: 44,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  leaf: {
    marginLeft: 4,
  },
});