const THEME = {
  // Font Boyutları
  fontSizes: {
    h1: 24, // Ana başlık (örneğin, tamirci adı)
    h2: 18, // Bölüm başlıkları (örneğin, "İletişim Bilgileri")
    h3: 16, // Küçük başlıklar (örneğin, modal başlıkları)
    body: 15, // Gövde metni (örneğin, telefon, yorum)
    secondary: 13, // İkincil metin (örneğin, tarih, not)
    button: 15, // Buton metni
    placeholder: 14, // Input placeholder
    tag: 14, // Etiket veya küçük bilgi
  },

  // Font Ağırlıkları
  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "600",
    extraBold: "700",
  },

  // Satır Aralığı (Line Height)
  lineHeights: {
    h1: 32, // h1 için
    h2: 24, // h2 için
    body: 20, // Gövde metni
    secondary: 18, // İkincil metin
  },

  // Boşluklar (Padding, Margin)
  spacing: {
    xs: 4, // Çok küçük boşluk
    sm: 8, // Küçük boşluk
    md: 12, // Orta boşluk
    lg: 16, // Büyük boşluk
    xl: 24, // Çok büyük boşluk
    xxl: 30, // Ekstra büyük boşluk
  },

  // Kart ve Eleman Boyutları
  sizes: {
    card: {
      borderRadius: 8, // Kart köşe yuvarlatma
      padding: 16, // Kart içi boşluk
      marginHorizontal: 16, // Kart kenar boşluğu
      elevation: 2, // Android gölge
      shadowOpacity: 0.1, // iOS gölge
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    button: {
      minWidth: 100, // Minimum buton genişliği
      maxWidth: "90%", // Maksimum buton genişliği
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 10, // Yuvarlatılmış buton
    },
    icon: {
      small: 16,
      medium: 20,
      large: 24,
      xlarge: 32, // Yıldızlar veya büyük ikonlar
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    input: {
      width: "90%", // Input genişliği
      height: 48, // Input yüksekliği
      borderRadius: 10,
      paddingHorizontal: 12,
    },
  },

  // Kenarlık
  border: {
    width: 1,
    color: "#E0E0E0", // COLORS.border ile eşleşiyor
  },
};

export default THEME;
