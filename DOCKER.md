# 🐳 Docker ile Çalıştırma Rehberi

Bu rehber, uygulamayı Docker ve Docker Compose kullanarak kolayca çalıştırmanızı sağlar.

## 📋 Gereksinimler

- [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop) yüklü olmalı
- Docker Compose Docker Desktop ile birlikte gelir
- Mac'te en az 4GB RAM ve 20GB disk alanı önerilir

## 🚀 Hızlı Başlangıç

### 1. Google Places API Key'i Ayarlayın

`.env.docker` dosyasını düzenleyin veya environment variable olarak ekleyin:

```bash
# .env.docker dosyasını düzenleyin
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

Veya direkt komut satırında:

```bash
export GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

### 2. Tüm Servisleri Başlatın

```bash
# Proje root dizininde
docker-compose up --build
```

Bu komut:
- PostgreSQL veritabanını başlatır
- Backend'i build eder ve çalıştırır
- Frontend'i build eder ve çalıştırır
- Tüm servisleri aynı network'te birleştirir

### 3. Servisleri Arka Planda Çalıştırma

```bash
docker-compose up -d --build
```

## 📱 Uygulamaya Erişim

### Backend API
- **URL:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health
- **API Docs:** http://localhost:3001/api/restaurants/nearby

### Frontend (Expo)
- **Metro Bundler:** http://localhost:19000
- **Expo Dev Tools:** http://localhost:19001
- **QR Code:** Terminal'de görünecek

### PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database:** yemek_ruleti
- **User:** yemekruleti
- **Password:** yemekruleti123

## 🛠️ Komutlar

### Servisleri Başlatma
```bash
docker-compose up
```

### Servisleri Durdurma
```bash
docker-compose down
```

### Servisleri Durdurma (Volumes ile)
```bash
docker-compose down -v
```

### Logları Görüntüleme
```bash
# Tüm servisler
docker-compose logs -f

# Sadece backend
docker-compose logs -f backend

# Sadece frontend
docker-compose logs -f frontend

# Sadece database
docker-compose logs -f postgres
```

### Servisleri Yeniden Build Etme
```bash
docker-compose up --build
```

### Sadece Belirli Servisi Başlatma
```bash
# Sadece database
docker-compose up postgres

# Database + Backend
docker-compose up postgres backend
```

### Container'lara Erişim
```bash
# Backend container'ına giriş
docker-compose exec backend sh

# Frontend container'ına giriş
docker-compose exec frontend sh

# Database'e bağlanma
docker-compose exec postgres psql -U yemekruleti -d yemek_ruleti
```

## 🔧 Yapılandırma

### Environment Variables

`docker-compose.yml` dosyasında environment variable'ları düzenleyebilirsiniz:

```yaml
backend:
  environment:
    GOOGLE_PLACES_API_KEY: ${GOOGLE_PLACES_API_KEY}
    PORT: 3001
    # ...

frontend:
  environment:
    EXPO_PUBLIC_API_URL: http://localhost:3001/api
    # ...
```

### Port Değiştirme

`docker-compose.yml` dosyasında port mapping'leri değiştirebilirsiniz:

```yaml
backend:
  ports:
    - "3001:3001"  # Host:Container

frontend:
  ports:
    - "19000:19000"
```

## 📊 Servis Durumu

### Tüm Container'ları Listeleme
```bash
docker-compose ps
```

### Container İstatistikleri
```bash
docker stats
```

## 🗄️ Veritabanı İşlemleri

### Prisma Migrations
```bash
# Backend container'ında migration çalıştırma
docker-compose exec backend npx prisma migrate dev

# Prisma Studio'yu açma
docker-compose exec backend npx prisma studio
# Sonra http://localhost:5555 adresine gidin
```

### Veritabanını Sıfırlama
```bash
# Container'ları ve volumes'ları sil
docker-compose down -v

# Tekrar başlat
docker-compose up --build
```

## 🐛 Sorun Giderme

### "Port already in use"
```bash
# Port'u kullanan process'i bulun
# macOS/Linux
lsof -i :3001
lsof -i :5432

# Windows
netstat -ano | findstr :3001

# Port'u değiştirin veya process'i durdurun
```

### "Container başlamıyor"
```bash
# Logları kontrol edin
docker-compose logs backend
docker-compose logs frontend

# Container'ı yeniden build edin
docker-compose up --build --force-recreate
```

### "Database bağlantı hatası"
```bash
# Database'in hazır olduğunu kontrol edin
docker-compose exec postgres pg_isready -U yemekruleti

# Backend'in database'e bağlanabildiğini kontrol edin
docker-compose exec backend sh
# Container içinde:
# npx prisma db pull
```

### "Frontend backend'e bağlanamıyor"
- `EXPO_PUBLIC_API_URL` environment variable'ının doğru olduğundan emin olun
- Backend'in çalıştığını kontrol edin: `docker-compose ps`
- Network'ün doğru olduğundan emin olun

### "Node modules sorunları"
```bash
# Container'ları durdurun
docker-compose down

# Volume'ları temizleyin
docker-compose down -v

# Yeniden build edin
docker-compose up --build
```

## 🔄 Development Workflow

### Hot Reload

Docker Compose volume mapping sayesinde hot reload çalışır:
- Backend: Kod değişikliklerinde otomatik yenilenir
- Frontend: Expo hot reload aktif

### Kod Değişiklikleri

1. Kodunuzu düzenleyin
2. Backend otomatik yenilenecek (tsx watch)
3. Frontend otomatik yenilenecek (Expo)

### Yeni Paket Ekleme

```bash
# Backend'e paket ekleme
docker-compose exec backend npm install package-name

# Frontend'e paket ekleme
docker-compose exec frontend npm install package-name

# Container'ı yeniden başlatın
docker-compose restart backend  # veya frontend
```

## 📦 Production Build

Production için optimize edilmiş build:

```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build
```

(Production compose dosyası oluşturulabilir)

## 🎯 Özet Komutlar

```bash
# Başlat
docker-compose up --build

# Arka planda başlat
docker-compose up -d --build

# Durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Yeniden başlat
docker-compose restart
```

## ✅ Kontrol Listesi

- [ ] Docker yüklü ve çalışıyor
- [ ] Docker Compose yüklü
- [ ] Google Places API key ayarlandı
- [ ] `docker-compose up --build` komutu çalıştırıldı
- [ ] Backend http://localhost:3001 adresinde çalışıyor
- [ ] Frontend http://localhost:19000 adresinde çalışıyor
- [ ] Database bağlantısı başarılı

## 🎉 Başarılı!

Artık tüm servisler Docker ile çalışıyor:
- ✅ PostgreSQL Database
- ✅ Backend API
- ✅ Frontend Expo

Mobil cihazınızda Expo Go ile QR kodu tarayarak test edebilirsiniz!

