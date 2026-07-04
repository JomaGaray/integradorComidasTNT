import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getProductByCode } from '@/services/productService';
import InfiniteFooter from '../../components/InfiniteFooter';
import ProductCard from '../../components/ProductCard';
import { useSearchInfinite } from '../../hooks/useSearchInfinite';

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';


type ScanState = 'idle' | 'loading' | 'found' | 'not_found';
 
export default function SearchScreen() {
  // ----- Búsqueda por texto -----
  const [text, setText] = useState('');
  const [term, setTerm] = useState('');
 
  useEffect(() => {
    const t = setTimeout(() => setTerm(text), 350);
    return () => clearTimeout(t);
  }, [text]);
 
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchInfinite(term);
 
  const products = useMemo(() => data?.pages.flatMap((p) => p.products) ?? [], [data]);
 
  // ----- Escáner de barras -----
  const [modalVisible, setModalVisible] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
 
  const handleOpenModal = () => {
    setScanState('idle');
    setScannedCode(null);
    setModalVisible(true);
  };
 
  const handleCloseModal = () => {
    setModalVisible(false);
  };
 
  const handleRetry = () => {
    setScanState('idle');
    setScannedCode(null);
  };
 
  const handleBarcodeScan = async (result: BarcodeScanningResult) => {
    if (scanState !== 'idle') return;
 
    setScanState('loading');
    setScannedCode(result.data);
 
    try {
      await getProductByCode(result.data);
      setScanState('found');
    } catch {
      setScanState('not_found');
    }
  };
 
  const handleGoToProduct = () => {
    if (!scannedCode) return;
    handleCloseModal();
    router.push(`/product/${scannedCode}`);
  };
 
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.title}>Search</Text>
 
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9AA0A6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Ej: jugos, orgánico, ferrero..."
              placeholderTextColor="#9AA0A6"
              value={text}
              onChangeText={setText}
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
 
          <Pressable
            style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
            onPress={handleOpenModal}
          >
            <Ionicons name="barcode-outline" size={26} color="#FFFFFF" />
          </Pressable>
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
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListFooterComponent={
          <InfiniteFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            hasItems={products.length > 0}
          />
        }
        ListEmptyComponent={
          term.trim().length <= 1 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={48} color="#C4C7CC" />
              <Text style={styles.emptyTitle}>Buscá productos</Text>
              <Text style={styles.emptyText}>
                Escribí algo para buscar, o escaneá un código de barras.
              </Text>
            </View>
          ) : isLoading ? (
            <View>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : isError ? (
            <Text style={styles.errorText}>
              {error instanceof Error ? error.message : 'Error en la búsqueda'}
            </Text>
          ) : (
            <Text style={styles.emptyText}>Sin resultados para "{term}".</Text>
          )
        }
      />
 
      {/* MODAL: Escáner de código de barras */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escanear código de barras</Text>
            <Pressable onPress={handleCloseModal} hitSlop={10}>
              <Ionicons name="close" size={28} color="#1A1A1A" />
            </Pressable>
          </View>
 
          {!permission ? (
            <View style={styles.permissionBox}>
              <ActivityIndicator size="large" color="#1B9E4B" />
            </View>
          ) : !permission.granted && permission.canAskAgain ? (
            <View style={styles.permissionBox}>
              <Ionicons name="camera-outline" size={64} color="#C4C7CC" />
              <Text style={styles.permissionText}>
                Necesitamos permiso para usar la cámara
              </Text>
              <Pressable style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>Solicitar permiso</Text>
              </Pressable>
            </View>
          ) : !permission.granted && !permission.canAskAgain ? (
            <View style={styles.permissionBox}>
              <Ionicons name="settings-outline" size={64} color="#C4C7CC" />
              <Text style={styles.permissionText}>
                El permiso de cámara fue denegado.{'\n'}Habilitalo desde Ajustes.
              </Text>
              <Pressable style={styles.permissionBtn} onPress={Linking.openSettings}>
                <Text style={styles.permissionBtnText}>Ir a Ajustes</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanState === 'idle' ? handleBarcodeScan : undefined}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'ean13',
                    'ean8',
                    'upc_e',
                    'upc_a',
                    'qr',
                    'code128',
                    'code39',
                    'code93',
                    'itf14',
                    'codabar',
                    'pdf417',
                    'datamatrix',
                    'aztec',
                  ],
                }}
              />
 
              {scanState === 'loading' && (
                <View style={styles.cameraOverlay}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.overlayText}>Buscando producto…</Text>
                </View>
              )}
            </View>
          )}
 
          {(scanState === 'found' || scanState === 'not_found') && (
            <View style={[styles.resultCard, scanState === 'not_found' && styles.resultCardError]}>
              {scanState === 'found' ? (
                <>
                  <Ionicons name="checkmark-circle" size={36} color="#16a34a" />
                  <Text style={styles.resultTitle}>Producto encontrado</Text>
                  <Text style={styles.resultCode}>{scannedCode}</Text>
                  <View style={styles.resultActions}>
                    <Pressable style={styles.goButton} onPress={handleGoToProduct}>
                      <Text style={styles.goButtonText}>Ver producto</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>
                    <Pressable style={styles.retryButton} onPress={handleRetry}>
                      <Text style={styles.retryText}>Volver a escanear</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="warning-outline" size={36} color="#ef4444" />
                  <Text style={[styles.resultTitle, { color: '#ef4444' }]}>
                    Producto no encontrado
                  </Text>
                  <Text style={styles.resultCode}>{scannedCode}</Text>
                  <Text style={styles.resultSub}>
                    Este producto no está en la base de datos
                  </Text>
                  <Pressable style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryText}>Volver a escanear</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
 
  headerSafe: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginTop: 8, marginBottom: 12 },
 
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECEDF0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
 
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1B9E4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonPressed: { opacity: 0.8 },
 
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
 
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptyText: { fontSize: 14, color: '#9AA0A6', textAlign: 'center', paddingHorizontal: 32 },
  errorText: { color: '#C0392B', fontSize: 14, textAlign: 'center', paddingVertical: 32 },
  skeletonCard: { height: 96, borderRadius: 16, backgroundColor: '#ECEDEF', marginBottom: 14 },
 
  modalContainer: { flex: 1, backgroundColor: '#F4F5F7' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#F4F5F7',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
 
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  permissionText: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  permissionBtn: {
    marginTop: 8,
    backgroundColor: '#1B9E4B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
 
  cameraWrapper: { flex: 1, position: 'relative' },
  camera: { flex: 1 },
 
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  overlayText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
 
  resultCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  resultCardError: { borderWidth: 1, borderColor: '#FECACA' },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginTop: 4 },
  resultCode: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  resultSub: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  resultActions: { width: '100%', gap: 8, marginTop: 8 },
 
  goButton: {
    backgroundColor: '#1B9E4B',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  goButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
 
  retryButton: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  retryText: { color: '#1B9E4B', fontWeight: '600', fontSize: 14 },
});