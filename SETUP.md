# 🚀 Kurulum Rehberi

## Adım 1: Gereksinimler

- Node.js 18 veya üzeri
- PostgreSQL 14 veya üzeri
- npm veya yarn
- Google Places API Key

## Adım 2: PostgreSQL Veritabanı Oluşturma

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE yemek_ruleti;

# Çıkış yap
\q
```

## Adım 3: Backend Kurulumu

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur (env.example dosyasını kopyala)
cp env.example .env

# .env dosyasını düzenle ve şu bilgileri ekle:
# - DATABASE_URL: PostgreSQL bağlantı string'iniz
# - GOOGLE_PLACES_API_KEY: Google Places API anahtarınız
# - PORT: Backend portu (varsayılan: 3001)
# - CORS_ORIGIN: Frontend URL'i (varsayılan: http://localhost:19006)

# Prisma migrate çalıştır
npx prisma migrate dev --name init

# Prisma client generate et
npx prisma generate

# Backend'i başlat
npm run dev
```

## Adım 4: Google Places API Key Alma

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. "APIs & Services" > "Library" bölümüne gidin
4. "Places API" arayın ve etkinleştirin
5. "Credentials" bölümünden yeni bir API key oluşturun
6. API key'i `.env` dosyasına ekleyin

## Adım 5: Frontend Kurulumu

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Expo CLI'yi global olarak yükle (eğer yoksa)
npm install -g expo-cli

# Uygulamayı başlat
npm start
```

## Adım 6: Mobil Cihazda Test Etme

### iOS (iPhone)
1. App Store'dan "Expo Go" uygulamasını indirin
2. Terminal'de görünen QR kodu Expo Go ile tarayın

### Android
1. Google Play'den "Expo Go" uygulamasını indirin
2. Terminal'de görünen QR kodu Expo Go ile tarayın

### Emülatör/Simülatör
- iOS Simulator: `npm run ios` (sadece macOS)
- Android Emulator: `npm run android`

## Adım 7: API Bağlantısını Kontrol Etme

Frontend'in backend'e bağlanabilmesi için:

1. Backend'in çalıştığından emin olun (http://localhost:3001)
2. Frontend'deki `src/services/api.ts` dosyasındaki `API_BASE_URL` değerini kontrol edin
3. Eğer farklı bir IP/port kullanıyorsanız, güncelleyin

**Not:** Fiziksel cihazda test ediyorsanız, `localhost` yerine bilgisayarınızın yerel IP adresini kullanmanız gerekebilir.

## Sorun Giderme

### Backend başlamıyor
- PostgreSQL'in çalıştığından emin olun
- `.env` dosyasındaki `DATABASE_URL` değerini kontrol edin
- Port 3001'in kullanılabilir olduğundan emin olun

### Frontend backend'e bağlanamıyor
- Backend'in çalıştığından emin olun
- CORS ayarlarını kontrol edin
- Fiziksel cihazda test ediyorsanız, `localhost` yerine IP adresi kullanın

### Konum izni verilmiyor
- iOS: Settings > Privacy > Location Services
- Android: Settings > Apps > Yemek Ruleti > Permissions > Location

### Google Places API hatası
- API key'in doğru olduğundan emin olun
- Places API'nin etkinleştirildiğinden emin olun
- API key'in kısıtlamalarını kontrol edin

## Geliştirme İpuçları

- Backend loglarını görmek için terminal'i kontrol edin
- Prisma Studio ile veritabanını görselleştirmek için: `npx prisma studio`
- Hot reload hem backend hem frontend'de aktif

