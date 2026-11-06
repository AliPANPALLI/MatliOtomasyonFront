export interface Company {
  /** Kalıcı kimlik (seçim localStorage'da bununla saklanır). */
  id: string;
  name: string;
  /** /images/matli/ altındaki logo dosyası */
  logo: string;
}

/**
 * Şirket listesi.
 * NOT: İsimler logo dosya adlarından türetildi; resmi unvanlarla güncellenmeli.
 * İleride bu liste backend'den (kullanıcının yetkili olduğu şirketler) gelecek.
 */
export const COMPANIES: Company[] = [
  { id: 'matli', name: 'Matlı Yem', logo: 'matli-logo.png' },
  { id: 'omer-matli-akademi', name: 'Ömer Matlı Akademi', logo: 'OmerMatli-Akademi.png' },
  { id: 'agroglobal', name: 'Agroglobal', logo: 'agroglobal-logo.png' },
  { id: 'bagyurdu', name: 'Bağyurdu', logo: 'bagyurdu-logo.png' },
  { id: 'bandirma-besi', name: 'Bandırma Besi', logo: 'bandirma-besi-logo.png' },
  { id: 'beyaz-akaryakit-gida', name: 'Beyaz Akaryakıt Gıda', logo: 'beyaz-akaryakit-gida.png' },
  { id: 'bilgiyem', name: 'Bilgiyem', logo: 'bilgiyem-logo.png' },
  { id: 'burdan', name: 'Burdan', logo: 'burdan-logo.png' },
  { id: 'catido', name: 'Catido', logo: 'catido-logo.png' },
  { id: 'dogido', name: 'Dogido', logo: 'dogido-logo.png' },
  { id: 'hayvancilik-akademisi', name: 'Hayvancılık Akademisi', logo: 'hayvancilik-akademisi-logo.png' },
  { id: 'heg', name: 'HEG', logo: 'heg-logo.png' },
  { id: 'keskinoglu', name: 'Keskinoğlu', logo: 'keskinoglu-jpg.png' },
  { id: 'matli-enerji', name: 'Matlı Enerji', logo: 'matli-enerji.png' },
  { id: 'matli-lojistik', name: 'Matlı Lojistik', logo: 'matli-lojistik.png' },
  { id: 'mld', name: 'MLD', logo: 'mld-logo.png' },
  { id: 'omer-matli-sut-ciftligi', name: 'Ömer Matlı Süt Çiftliği', logo: 'omer-matli-sut-ciftligi.png' },
  { id: 'proyem-30', name: 'Proyem 3.0', logo: 'proyem-30-logo.png' },
  { id: 'proyem', name: 'Proyem', logo: 'proyem-logo.png' },
  { id: 'tarim-destek', name: 'Tarım Destek', logo: 'tarim-destek-logo.png' },
  { id: 'verim', name: 'Verim', logo: 'verim-logo.png' },
  { id: 'yem-destek', name: 'Yem Destek', logo: 'yem-destek-logo.png' },
  { id: 'yesilbeyaz', name: 'Yeşilbeyaz', logo: 'yesilbeyaz-logo.png' },
  { id: 'yorsan', name: 'Yorsan', logo: 'yorsan-logo-1920x1920-1.png' },
];
