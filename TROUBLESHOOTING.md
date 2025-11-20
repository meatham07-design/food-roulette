# 🔧 Sorun Giderme Rehberi

## "Restoranları Bul" Butonu Çalışmıyor

### 1. Backend Çalışıyor mu?

**Kontrol:**
```bash
# Terminal'de backend loglarını kontrol edin
docker-compose logs backend

# Veya backend'in çalıştığını kontrol edin
curl http://localhost:3001/api/health
```

**Beklenen cevap:**
```json
{"status":"ok","message":"Yemek Ruleti API is running"}
```

**Çözüm:**
- Backend çalışmıyorsa: `docker-compose up backend` veya `cd backend && npm run dev`

### 2. API URL Doğru mu?

**Kontrol:**
- Frontend console'da (Expo Go'da shake gesture → "Debug Remote JS") API URL'i kontrol edin
- Android emülatör: `http://10.0.2.2:3001/api`
- iOS Simulator: `http://localhost:3001/api`
- Fiziksel cihaz: Bilgisayarınızın IP adresi (örn: `http://192.168.1.100:3001/api`)

**Çözüm:**
`frontend/src/services/api.ts` dosyasında API URL'ini kontrol edin.

### 3. Google Places API Key Var mı?

**Kontrol:**
```bash
# Backend loglarında API key hatası var mı?
docker-compose logs backend | grep -i "api key"
```

**Çözüm:**
```bash
# Environment variable olarak ayarlayın
export GOOGLE_PLACES_API_KEY=your_actual_api_key_here

# Docker ile çalıştırıyorsanız
docker-compose down
GOOGLE_PLACES_API_KEY=your_key docker-compose up --build
```

### 4. Konum İzni Verilmiş mi?

**Kontrol:**
- Uygulama açıldığında konum izni isteniyor mu?
- Settings'te konum izni verilmiş mi?

**Çözüm:**
- iOS: Settings > Privacy > Location Services > Yemek Ruleti
- Android: Settings > Apps > Yemek Ruleti > Permissions > Location

### 5. Network Hatası

**Hata:** "Backend'e bağlanılamıyor"

**Çözümler:**

#### Docker Kullanıyorsanız:
```bash
# Backend container'ının çalıştığını kontrol edin
docker-compose ps

# Backend loglarını kontrol edin
docker-compose logs backend

# Backend'i yeniden başlatın
docker-compose restart backend
```

#### Manuel Çalıştırıyorsanız:
```bash
# Backend'in çalıştığını kontrol edin
cd backend
npm run dev

# Port 3001'in kullanılabilir olduğundan emin olun
lsof -i :3001
```

### 6. CORS Hatası

**Hata:** "CORS policy" veya "Access-Control-Allow-Origin"

**Çözüm:**
`backend/src/index.ts` dosyasında CORS ayarlarını kontrol edin:
```typescript
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:19006', 'http://localhost:19000', 'http://localhost:19001'];
```

### 7. Console Loglarını Kontrol Etme

**Expo Go'da:**
1. Cihazı sallayın (shake gesture)
2. "Debug Remote JS" seçin
3. Chrome DevTools açılır
4. Console sekmesinde hataları görün

**Veya Terminal'de:**
```bash
# Frontend loglarını görüntüle
docker-compose logs frontend

# Backend loglarını görüntüle
docker-compose logs backend
```

### 8. Adım Adım Debug

1. **Konum alınıyor mu?**
   - Console'da "🔍 Restoran aranıyor..." mesajını görüyor musunuz?
   - Yoksa konum izni sorunu var

2. **API isteği gönderiliyor mu?**
   - Console'da "🚀 API Request" mesajını görüyor musunuz?
   - Yoksa buton onClick çalışmıyor

3. **Backend cevap veriyor mu?**
   - Console'da "✅ API Response" mesajını görüyor musunuz?
   - Yoksa network/backend sorunu var

4. **Hata var mı?**
   - Console'da "❌ API Error" mesajını görüyor musunuz?
   - Hata mesajına göre çözüm uygulayın

## Hızlı Test

```bash
# 1. Backend health check
curl http://localhost:3001/api/health

# 2. Backend loglarını kontrol
docker-compose logs backend | tail -20

# 3. Frontend loglarını kontrol
docker-compose logs frontend | tail -20

# 4. Tüm servisleri yeniden başlat
docker-compose restart
```

## Yaygın Hatalar ve Çözümleri

### "Network Error"
- Backend çalışmıyor → `docker-compose up backend`
- Yanlış API URL → `frontend/src/services/api.ts` dosyasını kontrol edin
- Firewall sorunu → Port 3001'in açık olduğundan emin olun

### "Google Places API error"
- API key eksik → Environment variable olarak ayarlayın
- API key yanlış → Google Cloud Console'dan kontrol edin
- Places API etkin değil → Google Cloud Console'da etkinleştirin

### "Database error"
- Database çalışmıyor → `docker-compose up postgres`
- Migration yapılmamış → `docker-compose exec backend npx prisma db push`

### "Timeout"
- Google Places API yavaş → Timeout süresini artırdık (30 saniye)
- Network yavaş → İnternet bağlantınızı kontrol edin

