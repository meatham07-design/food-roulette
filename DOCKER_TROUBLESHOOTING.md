# 🐛 Docker Sorun Giderme

## "read-only file system" Hatası

Bu hata Docker'ın container oluştururken dosya sistemine yazamamasından kaynaklanır.

### Çözüm 1: Docker Desktop'u Yeniden Başlatın

1. **Docker Desktop'u kapatın** (tamamen çıkış yapın)
2. **Docker Desktop'u tekrar açın**
3. Docker'ın tamamen başlamasını bekleyin
4. Tekrar deneyin:
   ```bash
   docker-compose up --build
   ```

### Çözüm 2: Docker'ı Temizleyin

```bash
# Çalışan container'ları durdurun
docker-compose down

# Kullanılmayan container'ları, image'ları ve volume'ları temizle
docker system prune -a --volumes

# Tekrar deneyin
docker-compose up --build
```

### Çözüm 3: Disk Alanını Kontrol Edin

```bash
# Disk kullanımını kontrol et
docker system df

# Eğer disk doluysa, temizlik yapın
docker system prune -a --volumes
```

### Çözüm 4: Docker Desktop Ayarlarını Kontrol Edin

1. Docker Desktop > Settings > Resources
2. Disk image size'ı kontrol edin (en az 20GB önerilir)
3. Memory ve CPU ayarlarını kontrol edin

### Çözüm 5: Container'ları Manuel Temizleme

```bash
# Tüm container'ları durdur
docker stop $(docker ps -aq)

# Tüm container'ları sil
docker rm $(docker ps -aq)

# Tüm image'ları sil (dikkatli!)
docker rmi $(docker images -q)

# Volume'ları temizle
docker volume prune

# Sonra tekrar deneyin
docker-compose up --build
```

### Çözüm 6: Docker Desktop'u Tamamen Yeniden Yükleyin (Mac)

Eğer yukarıdakiler işe yaramazsa:

1. Docker Desktop'u kaldırın (Applications klasöründen)
2. Tüm Docker dosyalarını temizleyin:
   ```bash
   # macOS - Terminal'de çalıştırın
   rm -rf ~/Library/Containers/com.docker.docker
   rm -rf ~/.docker
   rm -rf ~/Library/Application\ Support/Docker\ Desktop
   ```
3. Docker Desktop'u [yeniden indirin ve yükleyin](https://www.docker.com/products/docker-desktop)
4. Docker Desktop'u açın ve tamamen başlamasını bekleyin
5. Tekrar deneyin:
   ```bash
   docker-compose up --build
   ```

## Hızlı Çözüm (Önerilen Sıra)

```bash
# 1. Container'ları durdur
docker-compose down

# 2. Docker'ı temizle
docker system prune -f

# 3. Docker Desktop'u restart et (manuel)

# 4. Tekrar başlat
docker-compose up --build
```

## Alternatif: Container'ları Tek Tek Başlatma

Eğer hala sorun varsa, servisleri tek tek başlatabilirsiniz:

```bash
# 1. Sadece database'i başlat
docker-compose up postgres -d

# 2. Database'in hazır olmasını bekleyin (10-15 saniye)
sleep 15

# 3. Backend'i başlat
docker-compose up backend -d

# 4. Frontend'i başlat
docker-compose up frontend -d
```

## Logları Kontrol Etme

```bash
# Tüm servislerin loglarını görüntüle
docker-compose logs

# Sadece backend logları
docker-compose logs backend

# Sadece frontend logları
docker-compose logs frontend

# Sadece database logları
docker-compose logs postgres
```

## Docker Durumunu Kontrol Etme

```bash
# Container'ların durumunu görüntüle
docker-compose ps

# Tüm container'ları listele
docker ps -a

# Docker sistem bilgisi
docker info

# Disk kullanımı
docker system df
```

