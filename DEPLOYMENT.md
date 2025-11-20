# 📱 App Store ve Google Play'e Yayınlama Rehberi

Bu uygulama **hem iOS App Store hem de Google Play Store'da** çalışır! Expo kullandığımız için her iki platform için de aynı kod tabanından build alabilirsiniz.

## ✅ Platform Desteği

- ✅ **iOS** (iPhone & iPad)
- ✅ **Android** (Telefon & Tablet)
- ✅ **Web** (isteğe bağlı)

## 🚀 Production Build Alma

### Ön Hazırlık

1. **Expo Account Oluşturun**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **EAS Project ID Oluşturun**
   ```bash
   cd frontend
   eas init
   ```
   Bu komut `app.json` dosyasına `projectId` ekleyecektir.

### iOS Build (App Store)

#### 1. Apple Developer Account
- [Apple Developer Program](https://developer.apple.com/programs/)'a kaydolun ($99/yıl)
- Xcode yüklü bir Mac gerekir (sadece ilk kez sertifika oluştururken)

#### 2. iOS Build Oluşturma
```bash
cd frontend
eas build --platform ios
```

#### 3. App Store'a Yükleme
```bash
eas submit --platform ios
```

Veya manuel olarak:
1. Build tamamlandıktan sonra `.ipa` dosyasını indirin
2. [App Store Connect](https://appstoreconnect.apple.com/)'e giriş yapın
3. Yeni uygulama oluşturun
4. Build'i yükleyin ve inceleme için gönderin

### Android Build (Google Play)

#### 1. Google Play Developer Account
- [Google Play Console](https://play.google.com/console) hesabı oluşturun ($25 tek seferlik)

#### 2. Android Build Oluşturma
```bash
cd frontend
eas build --platform android
```

#### 3. Google Play'e Yükleme
```bash
eas submit --platform android
```

Veya manuel olarak:
1. Build tamamlandıktan sonra `.aab` (App Bundle) dosyasını indirin
2. [Google Play Console](https://play.google.com/console)'a giriş yapın
3. Yeni uygulama oluşturun
4. Production veya Internal Testing'e yükleyin

## 📋 Gerekli Asset'ler

Uygulamayı yayınlamadan önce şu dosyaları oluşturmanız gerekiyor:

### iOS için:
- `assets/icon.png` - 1024x1024px (App Store icon)
- `assets/splash.png` - Splash screen

### Android için:
- `assets/adaptive-icon.png` - 1024x1024px (Adaptive icon)
- `assets/icon.png` - 1024x1024px

### Oluşturma:
```bash
# Icon oluşturmak için (1024x1024px PNG)
# Splash screen oluşturmak için (1242x2436px PNG)
```

## 🔧 Yapılandırma

### app.json Ayarları

**iOS:**
- `bundleIdentifier`: `com.yemekruleti.app` (benzersiz olmalı)
- `buildNumber`: Her yeni build'de artırılmalı

**Android:**
- `package`: `com.yemekruleti.app` (benzersiz olmalı)
- `versionCode`: Her yeni build'de artırılmalı

### Backend URL'i Production'a Ayarlama

`frontend/src/services/api.ts` dosyasında:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://your-production-api.com/api'; // Production URL'inizi buraya ekleyin
```

## 📝 Store Listesi İçin Gerekli Bilgiler

### App Store (iOS)
- Uygulama adı: Yemek Ruleti
- Kategori: Food & Drink
- Açıklama: Yakınındaki restoranları bulup rulet çevirerek ne yiyeceğine karar ver
- Ekran görüntüleri (iPhone ve iPad için)
- Privacy Policy URL (gerekli)

### Google Play (Android)
- Uygulama adı: Yemek Ruleti
- Kategori: Food & Drink
- Kısa açıklama: Yakınındaki restoranları bul ve rulet çevir
- Uzun açıklama: Detaylı açıklama
- Ekran görüntüleri (telefon ve tablet için)
- Privacy Policy URL (gerekli)

## 🎯 Build Tipleri

### Development Build
Test için, Expo Go olmadan çalışır:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Build
Internal testing için:
```bash
eas build --profile preview --platform android  # APK oluşturur
```

### Production Build
Store'a yüklemek için:
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## 🔐 Sertifikalar ve Keys

EAS Build otomatik olarak yönetir:
- iOS: Provisioning profiles ve certificates
- Android: Signing keys

İlk build'de EAS otomatik oluşturur ve güvenli şekilde saklar.

## 📊 Build Durumunu Takip Etme

```bash
eas build:list
```

## ⚠️ Önemli Notlar

1. **Backend URL**: Production'da backend'inizin public bir URL'i olmalı (Heroku, AWS, DigitalOcean vb.)

2. **Google Places API**: Production'da API key'inizin kısıtlamalarını ayarlayın:
   - iOS bundle ID'yi ekleyin
   - Android package name'i ekleyin
   - HTTP referrer kısıtlamaları

3. **Privacy Policy**: Konum verisi topladığınız için Privacy Policy sayfası gerekli

4. **Version Management**: Her yeni build'de version ve build number'ı artırın

5. **Test**: Production build'i yayınlamadan önce mutlaka test edin

## 🆘 Sorun Giderme

### Build başarısız oluyor
- `eas build:list` ile logları kontrol edin
- `eas build:view` ile detaylı logları görün

### Sertifika sorunları
- EAS otomatik yönetir, manuel müdahale genelde gerekmez
- Sorun olursa: `eas credentials` komutunu kullanın

### API bağlantı sorunları
- Production URL'in doğru olduğundan emin olun
- CORS ayarlarını kontrol edin
- SSL sertifikasının geçerli olduğundan emin olun

## 📚 Daha Fazla Bilgi

- [Expo EAS Build Dokümantasyonu](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

