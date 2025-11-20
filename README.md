# 🍽️ Yemek Ruleti

Yakınındaki restoranları bulup rulet çevirerek ne yiyeceğine karar veren mobil uygulama.

## 🚀 Özellikler

- 📍 Konum bazlı restoran arama
- 🎯 Mesafe filtresi (500m, 1km, 2km, 5km)
- 🍕 Kategori bazlı filtreleme
- 🎰 İnteraktif rulet animasyonu
- ⭐ Restoran detayları (rating, mesafe, fotoğraflar)

## 📱 Platform Desteği

✅ **iOS** (iPhone & iPad) - App Store'a yayınlanabilir  
✅ **Android** (Telefon & Tablet) - Google Play'e yayınlanabilir  
✅ **Web** (isteğe bağlı)

Uygulama Expo kullanılarak geliştirilmiştir, bu sayede tek bir kod tabanından hem iOS hem Android için build alınabilir. Detaylı yayınlama rehberi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## 🐳 Docker ile Hızlı Başlangıç (Önerilen)

En kolay yöntem! Tüm servisleri tek komutla başlatın:

```bash
# Google Places API key'i ayarlayın
export GOOGLE_PLACES_API_KEY=your_api_key_here

# Tüm servisleri başlat (PostgreSQL + Backend + Frontend)
docker-compose up --build
```

Detaylı Docker rehberi için [DOCKER.md](./DOCKER.md) dosyasına bakın.

## 📋 Gereksinimler

### Docker ile (Önerilen)
- Docker
- Docker Compose
- Google Places API Key

### Manuel Kurulum
- Node.js 18+
- PostgreSQL 14+
- Google Places API Key
- Expo CLI (mobil geliştirme için)

## 🛠️ Kurulum

### 🐳 Docker ile (En Kolay)

1. **Google Places API Key'i ayarlayın:**
   ```bash
   export GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

2. **Tüm servisleri başlatın:**
   ```bash
   docker-compose up --build
   ```

3. **Uygulamaya erişin:**
   - Backend: http://localhost:3001
   - Frontend: Terminal'de QR kodu görünecek
   - Database: localhost:5432

Detaylı bilgi için [DOCKER.md](./DOCKER.md) dosyasına bakın.

### 📦 Manuel Kurulum

#### Backend

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun:
```bash
cp env.example .env
```

4. `.env` dosyasını düzenleyin:
```
DATABASE_URL="postgresql://user:password@localhost:5432/yemek_ruleti"
PORT=3001
GOOGLE_PLACES_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:19006
```

5. Veritabanını oluşturun ve migrate edin:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Backend'i başlatın:
```bash
npm run dev
```

#### Frontend

1. Frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Expo Go uygulaması ile QR kodu tarayın veya emülatörde çalıştırın.

## 📱 Kullanım

1. Uygulamayı açın ve konum izni verin
2. Mesafe seçin (500m, 1km, 2km, 5km)
3. İsteğe bağlı olarak kategori filtresi uygulayın
4. "Restoranları Bul" butonuna tıklayın
5. Ruleti çevirin ve seçilen restoranı görün!

## 🗄️ Veritabanı Yapısı

- **Restaurant**: Restoran bilgileri
- **Category**: Yemek kategorileri
- **RestaurantCategory**: Restoran-kategori ilişkisi

## 🔧 API Endpoints

### Restoranlar
- `GET /api/restaurants/nearby` - Yakındaki restoranları ara
- `GET /api/restaurants` - Filtrelenmiş restoranları getir
- `GET /api/restaurants/:id` - Tek restoran detayı

### Kategoriler
- `GET /api/categories` - Tüm kategorileri getir
- `GET /api/categories/:id` - Kategori detayı

## 📝 Notlar

- Google Places API key'i almak için [Google Cloud Console](https://console.cloud.google.com/) üzerinden Places API'yi etkinleştirin
- İlk çalıştırmada restoranlar Google Places API'den çekilir ve veritabanına kaydedilir
- Sonraki aramalarda veritabanından hızlıca getirilir

## 🎨 Teknolojiler

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React Native, Expo, TypeScript
- **API**: Google Places API
- **Containerization**: Docker, Docker Compose

## 📚 Dokümantasyon

- [DOCKER.md](./DOCKER.md) - Docker ile çalıştırma rehberi
- [SETUP.md](./SETUP.md) - Detaylı kurulum rehberi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - App Store/Play Store yayınlama
- [TESTING.md](./TESTING.md) - Test etme rehberi
- [ANDROID_STUDIO_GUIDE.md](./ANDROID_STUDIO_GUIDE.md) - Android Studio'da çalıştırma
- [QUICK_START.md](./QUICK_START.md) - Hızlı başlangıç

## 📄 Lisans

MIT
