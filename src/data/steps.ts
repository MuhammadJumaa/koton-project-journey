// Koton DX WebApp Projesi Oluşturma için 11 Adım

export interface Step {
  id: number;
  title: string;
  description: string;
  hint: string;
  link?: string;
}

export const steps: Step[] = [
  {
    id: 1,
    title: "Auth'da Proje Oluştur",
    description: "auth-dev.koton.com.tr adresine gidin ve yeni bir proje ekleyin. Proje ID ve Proje Kodu alacaksınız - bunları kaydedin! Proje Kodu benzersiz olmalıdır (örn: KTS, WMS, CRM).",
    hint: "Yeni projenizi oluşturmak için /pages/project sayfasına gidin",
    link: "https://auth-dev.koton.com.tr/pages/project"
  },
  {
    id: 2,
    title: "Rolleri Tanımla",
    description: "Projeniz için Admin, Yönetici, Kullanıcı, Misafir, Geliştirici gibi roller ekleyin. Her rol, uygulamanızda farklı yetki seviyelerine sahip olacaktır.",
    hint: "Projenizi oluşturduktan sonra /pages/role sayfasına gidin",
    link: "https://auth-dev.koton.com.tr/pages/role"
  },
  {
    id: 3,
    title: "Kaynakları Ekle",
    description: "Kaynak bölümünde menüler ve alanlar oluşturun. Bunlar, uygulamanızda hangi sayfaların ve işlemlerin var olduğunu tanımlar. Rota, kodunuzla tam olarak eşleşmelidir!",
    hint: "/pages/resource kullanın - rota isimleri büyük/küçük harfe duyarlıdır",
    link: "https://auth-dev.koton.com.tr/pages/resource"
  },
  {
    id: 4,
    title: "Kaynak İzinlerini Ayarla",
    description: "Her kaynak için GEDS izinlerini yapılandırın: Görüntüle, Ekle, Düzenle, Sil. Bu, her kaynakta hangi işlemlerin mümkün olduğunu belirler.",
    hint: "GEDS ayarlamak için /pages/resource-permission sayfasını ziyaret edin",
    link: "https://auth-dev.koton.com.tr/pages/resource-permission"
  },
  {
    id: 5,
    title: "Rolleri İzinlerle Eşleştir",
    description: "Her role izinler atayın. Örneğin, Admin tüm izinleri alırken, Misafir sadece Görüntüleme iznine sahip olabilir.",
    hint: "Rol-izin eşleştirmesi için /pages/role-permission kullanın",
    link: "https://auth-dev.koton.com.tr/pages/role-permission"
  },
  {
    id: 6,
    title: "Kullanıcıları Projeye Ekle",
    description: "Projenize kullanıcılar ekleyin. Bu adımda kullanıcıların projeye erişim hakkı tanımlanır.",
    hint: "Kullanıcıları projeye eklemek için /pages/user-project sayfasını kullanın",
    link: "https://auth-dev.koton.com.tr/pages/user-project"
  },
  {
    id: 7,
    title: "Kullanıcılara Rol Ata",
    description: "Projeye eklediğiniz kullanıcılara roller atayın. Her kullanıcı, atandığı role göre yetkilere sahip olacaktır.",
    hint: "Kullanıcı-rol eşleştirmesi için /pages/user-role sayfasını kullanın",
    link: "https://auth-dev.koton.com.tr/pages/user-role"
  },
  {
    id: 8,
    title: "Dilleri Ayarla",
    description: "Uygulamanızın destekleyeceği dilleri etkinleştirin: Türkçe (TR), İngilizce (EN), vb. Bu, yerelleştirme sistemi için gereklidir.",
    hint: "projects-languages sayfasında yapılandırın",
    link: "https://localization-dev.koton.com.tr/pages/projects-languages"
  },
  {
    id: 9,
    title: "Çevirileri Ekle",
    description: "Yerelleştirme anahtarları ve çevirilerini oluşturun. Örneğin: common.save Türkçe'de 'Kaydet', İngilizce'de 'Save' olur.",
    hint: "Format: anahtar.altanahtar (örn: common.save, menu.dashboard)",
    link: "https://localization-dev.koton.com.tr/pages/localizations"
  },
  {
    id: 10,
    title: "Yeni Sayfa Oluştur",
    description: "src/pages klasörüne yeni bir sayfa ekleyin ve rotaları güncelleyin. Rota yolu, Auth'da oluşturduğunuz kaynak adıyla eşleşmelidir!",
    hint: "Koddaki rota, Auth kaynak adıyla tam olarak eşleşmelidir"
  },
  {
    id: 11,
    title: "Permission Hook'unu Kullan",
    description: "Bileşenlerinizde erişim kontrolü için usePermission hook'unu kullanın. hasPermission('add'), hasPermission('edit'), vb. kontrol edin.",
    hint: "Import { usePermission } from '@/hooks/usePermission'"
  }
];

export const TOTAL_STEPS = steps.length;

// Helper to get step by ID
export const getStepById = (id: number): Step | undefined => {
  return steps.find(step => step.id === id);
};

// Avatar options for players
export const AVATAR_OPTIONS = ['🧙', '👨‍💻', '👩‍💻', '🦸', '🧑‍🚀', '🥷', '🧝', '🧛', '🤖', '👾'];

// Get random avatar
export const getRandomAvatar = (): string => {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};
