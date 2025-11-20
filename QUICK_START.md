# ⚡ Hızlı Başlangıç - Android Studio'da Test

## 🎯 En Kolay Yöntem (Önerilen)

### 1. Android Studio Emülatörü Hazırlama

1. **Android Studio'yu açın**
2. **Tools > Device Manager** (veya More Actions > Virtual Device Manager)
3. **Create Device** butonuna tıklayın
4. Bir telefon seçin (örn: Pixel 5)
5. System Image seçin (API 33 veya üzeri önerilir)
6. **Finish** ile oluşturun
7. **Play** butonu ile emülatörü başlatın

### 2. Expo Go'yu Emülatöre Yükleme

Emülatör açıldıktan sonra:

```bash
# Emülatör çalışıyorken
adb install -r ~/.expo/android-app-debug.apk
```

Veya Play Store'dan Expo Go'yu indirin (emülatörde Play Store açık olmalı).

### 3. Backend'i Başlatın

```bash
cd backend
npm run dev
```

Backend `http://localhost:3001` adresinde çalışmalı.

### 4. Frontend'i Başlatın

Yeni bir terminal açın:

```bash
cd frontend
npm start
```

### 5. Android Emülatöründe Açın

Terminal'de `a` tuşuna basın veya:

```bash
npm run android
```

Uygulama otomatik olarak emülatörde açılacak!

## 🔧 Alternatif: Development Build (Native)

Eğer Expo Go yerine native build istiyorsanız:

```bash
cd frontend

# Development build oluştur
eas build --profile development --platform android

# Build tamamlandıktan sonra APK'yı indirin
# Emülatöre yükleyin:
adb install path/to/your-app.apk
```

## 📱 Fiziksel Android Cihazda Test

1. **USB Debugging'i açın:**
   - Settings > About Phone > Build Number'a 7 kez tıklayın
   - Settings > Developer Options > USB Debugging'i açın

2. **Telefonu bilgisayara bağlayın**

3. **Bilgisayarınızın IP adresini bulun:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   Örnek: `192.168.1.100`

4. **API URL'ini güncelleyin:**
   `frontend/src/services/api.ts` dosyasında:
   ```typescript
   if (Platform.OS === 'android') {
     return 'http://192.168.1.100:3001/api'; // IP'nizi buraya yazın
   }
   ```

5. **Frontend'i başlatın:**
   ```bash
   cd frontend
   npm start
   ```

6. **Telefonda Expo Go ile QR kodu tarayın**

## 🐛 Sorun Giderme

### "Metro bundler başlamıyor"
```bash
cd frontend
npx expo start --clear
```

### "Backend'e bağlanamıyor"
- Backend'in çalıştığından emin olun: `http://localhost:3001/api/health`
- Android emülatörü için `10.0.2.2` kullanıldığından emin olun
- Fiziksel cihaz için bilgisayarınızın IP adresini kullanın

### "Emülatör açılmıyor"
- Android Studio > Tools > SDK Manager > SDK Tools
- "Android Emulator" seçili olduğundan emin olun
- Emülatörü yeniden başlatın

### "Expo Go yüklenmiyor"
- Emülatörde Play Store'dan Expo Go'yu indirin
- Veya: `adb install` komutu ile yükleyin

## ✅ Hızlı Kontrol Listesi

- [ ] Android Studio yüklü
- [ ] Emülatör oluşturuldu ve çalışıyor
- [ ] Expo Go emülatöre yüklendi
- [ ] Backend çalışıyor (`npm run dev` in backend/)
- [ ] Frontend başlatıldı (`npm start` in frontend/)
- [ ] Terminal'de `a` tuşuna basıldı veya `npm run android` çalıştırıldı

## 🎉 Başarılı!

Uygulama emülatörde açıldıysa, artık test edebilirsiniz:
- Konum izni verin
- Restoranları arayın
- Ruleti çevirin!

