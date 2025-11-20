# 📱 Android Studio'da Çalıştırma Rehberi

## 🎯 Adım Adım: Android Studio'da Test Etme

### 1️⃣ Android Studio'yu Açın ve Emülatör Oluşturun

1. **Android Studio'yu açın**
2. **More Actions** > **Virtual Device Manager** (veya Tools > Device Manager)
3. **Create Device** butonuna tıklayın
4. Bir telefon seçin (örn: **Pixel 5** veya **Pixel 6**)
5. **Next** butonuna tıklayın
6. System Image seçin:
   - **API Level 33** veya üzeri önerilir (Android 13+)
   - İndirilmemişse **Download** butonuna tıklayın
7. **Next** > **Finish**
8. Oluşturduğunuz emülatörün yanındaki **▶️ Play** butonuna tıklayarak başlatın

### 2️⃣ Expo Go'yu Emülatöre Yükleyin

Emülatör açıldıktan sonra:

**Yöntem A: Play Store'dan (Kolay)**
1. Emülatörde **Play Store** uygulamasını açın
2. "Expo Go" arayın
3. İndirin ve yükleyin

**Yöntem B: Komut Satırından**
```bash
# Terminal'de (emülatör çalışıyorken)
adb install -r ~/.expo/android-app-debug.apk
```

Veya Expo Go APK'sını manuel indirip sürükleyip bırakın.

### 3️⃣ Backend'i Başlatın

Terminal'de (veya IDE'de):

```bash
cd backend
npm install  # İlk kez çalıştırıyorsanız
npm run dev
```

Backend `http://localhost:3001` adresinde çalışmalı.

✅ **Kontrol:** Tarayıcıda `http://localhost:3001/api/health` adresine gidin, `{"status":"ok"}` görmelisiniz.

### 4️⃣ Frontend'i Başlatın

**Yeni bir terminal açın** (veya IDE'de yeni terminal):

```bash
cd frontend
npm install  # İlk kez çalıştırıyorsanız
npm start
```

Veya direkt Android emülatöründe açmak için:

```bash
cd frontend
npm run android
```

### 5️⃣ Emülatörde Açın

Terminal'de şu seçeneklerden birini görürsünüz:

```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

**`a` tuşuna basın** veya terminal'de **"a"** yazıp Enter'a basın.

Uygulama otomatik olarak Android Studio emülatöründe açılacak!

## 🔧 Alternatif: Manuel Başlatma

Eğer otomatik açılmazsa:

1. Expo Go uygulamasını emülatörde açın
2. Terminal'de görünen **QR kodu** tarayın
3. Veya terminal'deki **URL'i** Expo Go'ya girin

## 📋 Hızlı Kontrol Listesi

- [ ] Android Studio yüklü
- [ ] Emülatör oluşturuldu ve çalışıyor
- [ ] Expo Go emülatöre yüklendi
- [ ] Backend çalışıyor (`npm run dev` in backend/)
- [ ] Frontend başlatıldı (`npm start` in frontend/)
- [ ] Terminal'de `a` tuşuna basıldı

## 🐛 Sorun Giderme

### "Emülatör açılmıyor"
- Android Studio > Tools > SDK Manager > SDK Tools
- "Android Emulator" seçili olduğundan emin olun
- Emülatörü yeniden başlatın

### "Expo Go yüklenmiyor"
- Emülatörde Play Store'dan Expo Go'yu indirin
- Veya: `adb devices` komutu ile emülatörün bağlı olduğundan emin olun

### "Backend'e bağlanamıyor"
- Backend'in çalıştığından emin olun: `http://localhost:3001/api/health`
- `frontend/src/services/api.ts` dosyasında Android için `10.0.2.2:3001` kullanıldığından emin olun
- Emülatörün çalıştığından emin olun

### "npm start çalışmıyor"
```bash
cd frontend
npx expo start --clear
```

### "Metro bundler hatası"
```bash
cd frontend
rm -rf node_modules
npm install
npx expo start --clear
```

## 🎯 Özet Komutlar

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
# Sonra 'a' tuşuna bas
```

## 💡 İpuçları

- **Hot Reload:** Kod değişikliklerinde otomatik yenilenir
- **Developer Menu:** Emülatörde iki parmakla ekrana dokunun veya `Cmd+M` (Mac) / `Ctrl+M` (Windows/Linux)
- **Logs:** Terminal'de tüm logları görebilirsiniz
- **Reload:** Developer menu'den "Reload" seçeneğini kullanabilirsiniz

## 🚀 Başarılı!

Uygulama emülatörde açıldıysa:
1. Konum izni verin
2. Mesafe seçin
3. Restoranları bulun
4. Ruleti çevirin!

