# 🧪 Uygulamayı Test Etme Rehberi

Uygulamayı test etmek için birkaç farklı yöntem var. Size en uygun olanı seçin:

## 🚀 Yöntem 1: Expo Go (En Kolay - Önerilen)

Bu yöntem en hızlı ve kolay yoldur. Fiziksel cihazınızda veya emülatörde test edebilirsiniz.

### Adımlar:

1. **Expo Go uygulamasını indirin:**
   - [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. **Backend'i başlatın:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Frontend'i başlatın:**
   ```bash
   cd frontend
   npm start
   ```

4. **QR kodu tarayın:**
   - Terminal'de görünen QR kodu Expo Go ile tarayın
   - Veya terminal'de `a` tuşuna basarak Android emülatörde açın
   - Veya terminal'de `i` tuşuna basarak iOS simülatörde açın

### Android Studio Emülatöründe:

1. Android Studio'yu açın
2. AVD Manager'dan bir emülatör oluşturun/başlatın
3. Expo Go'yu emülatöre yükleyin
4. `npm start` komutundan sonra terminal'de `a` tuşuna basın

## 🎯 Yöntem 2: Android Studio Emülatörü (Native Build)

Android Studio'da direkt çalıştırmak için development build oluşturmanız gerekir.

### Ön Hazırlık:

1. **Android Studio'yu yükleyin:**
   - [Android Studio](https://developer.android.com/studio) indirin
   - Android SDK ve emülatör kurulumunu tamamlayın

2. **EAS CLI'yi yükleyin:**
   ```bash
   npm install -g eas-cli
   ```

3. **Expo hesabı oluşturun (ücretsiz):**
   ```bash
   eas login
   ```

### Development Build Oluşturma:

```bash
cd frontend

# Development build oluştur (Android)
eas build --profile development --platform android

# Build tamamlandıktan sonra APK'yı indirin
# Android Studio emülatörüne veya fiziksel cihaza yükleyin
```

### Android Studio'da Çalıştırma:

1. **APK'yı yükleyin:**
   ```bash
   # Emülatör çalışıyorken
   adb install path/to/your-app.apk
   ```

2. **Veya Android Studio'dan:**
   - File > Open > APK dosyasını seçin
   - Run > Run 'app'

## 📱 Yöntem 3: Fiziksel Cihazda Test

### Android Telefon:

1. **USB Debugging'i açın:**
   - Settings > About Phone > Build Number'a 7 kez tıklayın
   - Settings > Developer Options > USB Debugging'i açın

2. **Telefonu bilgisayara bağlayın**

3. **Expo Go ile:**
   ```bash
   cd frontend
   npm start
   # Terminal'de 'a' tuşuna basın veya QR kodu tarayın
   ```

4. **Veya Development Build:**
   ```bash
   # Build aldıktan sonra
   adb install path/to/your-app.apk
   ```

## 🖥️ Yöntem 4: Web'de Test (Hızlı Prototip)

Web'de de çalışır ama bazı özellikler (konum servisi) sınırlı olabilir:

```bash
cd frontend
npm run web
```

Tarayıcıda `http://localhost:19006` adresinde açılır.

## ⚡ Hızlı Başlangıç (Önerilen)

En hızlı test için:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal açıldığında:
# - 'a' tuşuna bas = Android emülatör/cihaz
# - 'i' tuşuna bas = iOS simülatör (sadece macOS)
# - QR kodu tarayın = Fiziksel cihaz
```

## 🔧 Android Studio Emülatör Kurulumu

Eğer Android Studio'da emülatör yoksa:

1. **Android Studio'yu açın**
2. **Tools > Device Manager**
3. **Create Device** butonuna tıklayın
4. **Phone** kategorisinden bir cihaz seçin (örn: Pixel 5)
5. **System Image** seçin (API 33 veya üzeri önerilir)
6. **Finish** ile oluşturun
7. **Play** butonu ile başlatın

## 📋 Gereksinimler Kontrol Listesi

### Backend için:
- [ ] PostgreSQL çalışıyor
- [ ] `.env` dosyası doğru yapılandırılmış
- [ ] Google Places API key eklenmiş
- [ ] Backend `http://localhost:3001` adresinde çalışıyor

### Frontend için:
- [ ] Node.js yüklü
- [ ] `npm install` çalıştırıldı
- [ ] Backend'e bağlanabiliyor (API URL kontrolü)

### Android Studio için:
- [ ] Android Studio yüklü
- [ ] Android SDK yüklü
- [ ] Emülatör oluşturuldu ve çalışıyor
- [ ] Expo Go emülatöre yüklendi (Yöntem 1 için)

## 🐛 Sorun Giderme

### "Metro bundler başlamıyor"
```bash
cd frontend
npx expo start --clear
```

### "Backend'e bağlanamıyor"
- Backend'in çalıştığından emin olun
- `frontend/src/services/api.ts` dosyasındaki `API_BASE_URL` değerini kontrol edin
- Fiziksel cihazda test ediyorsanız, `localhost` yerine bilgisayarınızın IP adresini kullanın

### "Android emülatör açılmıyor"
- Android Studio > Tools > SDK Manager > SDK Tools
- "Android Emulator" seçili olduğundan emin olun
- Emülatörü yeniden başlatın

### "Konum izni verilmiyor"
- Emülatörde: Settings > Location > High accuracy
- Fiziksel cihazda: Settings > Apps > Yemek Ruleti > Permissions > Location

### "Expo Go'da uygulama açılmıyor"
- Aynı WiFi ağında olduğunuzdan emin olun
- Veya `tunnel` modunu kullanın: `npx expo start --tunnel`

## 🎯 Önerilen Test Akışı

1. **İlk test:** Expo Go ile fiziksel cihazda (en kolay)
2. **Geliştirme:** Expo Go ile emülatörde
3. **Production test:** Development build ile

## 📱 API URL'i Fiziksel Cihaz İçin Ayarlama

Fiziksel cihazda test ederken, `localhost` çalışmaz. Şu adımları izleyin:

1. **Bilgisayarınızın IP adresini bulun:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **`frontend/src/services/api.ts` dosyasını düzenleyin:**
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://YOUR_IP_ADDRESS:3001/api'  // Örn: http://192.168.1.100:3001/api
     : 'https://your-production-api.com/api';
   ```

3. **Backend CORS ayarlarını kontrol edin:**
   - `backend/.env` dosyasında `CORS_ORIGIN` değerini güncelleyin

## 🚀 Hızlı Komutlar

```bash
# Backend başlat
cd backend && npm run dev

# Frontend başlat (yeni terminal)
cd frontend && npm start

# Android emülatörde aç (frontend terminalinde 'a' tuşu)
# iOS simülatörde aç (frontend terminalinde 'i' tuşu - sadece macOS)
# QR kodu göster (frontend terminalinde otomatik)
```

## 💡 İpuçları

- **Hot Reload:** Kod değişikliklerinde otomatik yenilenir
- **Developer Menu:** Cihazda iki parmakla ekrana dokunun veya `Cmd+D` (iOS) / `Cmd+M` (Android)
- **Logs:** Terminal'de tüm logları görebilirsiniz
- **Network Inspector:** Developer menu'den network isteklerini görebilirsiniz

