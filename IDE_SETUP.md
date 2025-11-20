# 🛠️ IDE'den Çalıştırma (IntelliJ IDEA / WebStorm)

IDE'den uygulamayı çalıştırmak için run configuration'lar oluşturmanız gerekiyor.

## 📋 Run Configuration'ları Oluşturma

### Yöntem 1: Otomatik (Önerilen)

`.idea/runConfigurations/` klasöründe hazır configuration dosyaları var:
- `Backend.xml` - Backend server'ı başlatır
- `Frontend.xml` - Frontend Expo server'ı başlatır

IDE'yi yeniden başlattığınızda veya projeyi yeniden açtığınızda bu configuration'lar otomatik görünecektir.

### Yöntem 2: Manuel Oluşturma

#### Backend Configuration:

1. **Run/Debug Configurations** dialogunu açın (üstteki toolbar'dan)
2. **"+"** butonuna tıklayın
3. **"npm"** seçin
4. Şu ayarları yapın:
   - **Name:** `Backend`
   - **package.json:** `backend/package.json` seçin
   - **Command:** `run`
   - **Scripts:** `dev` seçin
5. **OK** butonuna tıklayın

#### Frontend Configuration:

1. **Run/Debug Configurations** dialogunu açın
2. **"+"** butonuna tıklayın
3. **"npm"** seçin
4. Şu ayarları yapın:
   - **Name:** `Frontend`
   - **package.json:** `frontend/package.json` seçin
   - **Command:** `start`
5. **OK** butonuna tıklayın

## 🚀 Çalıştırma

### Backend'i Başlatma:

1. Üst toolbar'dan **"Backend"** configuration'ını seçin
2. **Run** butonuna tıklayın (yeşil play butonu)
3. Backend `http://localhost:3001` adresinde çalışacak

### Frontend'i Başlatma:

1. Üst toolbar'dan **"Frontend"** configuration'ını seçin
2. **Run** butonuna tıklayın
3. Terminal'de Expo dev server açılacak
4. QR kodu göreceksiniz veya `a` tuşuna basarak Android emülatörde açabilirsiniz

## 🔄 İki Configuration'ı Aynı Anda Çalıştırma

1. **Run/Debug Configurations** dialogunu açın
2. **"+"** butonuna tıklayın
3. **"Compound"** seçin
4. **Name:** `Full Stack` yazın
5. **"+"** ile hem **Backend** hem **Frontend** configuration'larını ekleyin
6. **OK** butonuna tıklayın

Artık **"Full Stack"** configuration'ını çalıştırdığınızda hem backend hem frontend aynı anda başlayacak!

## 📝 Notlar

- Backend önce başlatılmalı (frontend backend'e bağlanır)
- Her configuration ayrı bir terminal/process'te çalışır
- Debug modunda breakpoint koyabilirsiniz
- Loglar IDE'nin Run penceresinde görünecektir

## 🐛 Sorun Giderme

### "Configuration bulunamadı"
- `.idea/runConfigurations/` klasörünün var olduğundan emin olun
- IDE'yi yeniden başlatın
- File > Invalidate Caches / Restart

### "npm komutu bulunamadı"
- Node.js'in yüklü olduğundan emin olun
- IDE Settings > Languages & Frameworks > Node.js'de Node interpreter'ı kontrol edin

### "Port zaten kullanılıyor"
- Backend zaten çalışıyorsa, önce durdurun
- Veya port'u değiştirin (`backend/.env` dosyasında)

