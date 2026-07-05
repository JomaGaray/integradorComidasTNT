import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props = {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  hasItems: boolean;
};

export default function InfiniteFooter({ isFetchingNextPage, hasNextPage, hasItems }: Props) {
  if (isFetchingNextPage) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator size="small" color="#1B9E4B" />
      </View>
    );
  }
  if (!hasNextPage && hasItems) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.text}>No hay más resultados</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 20, alignItems: 'center' },
  text: { fontSize: 13, color: '#9AA0A6' },
});