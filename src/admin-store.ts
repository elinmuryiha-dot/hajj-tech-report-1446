// Admin Store for managing credentials and dynamic content

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

export interface Image {
  id: string;
  title: string;
  description: string;
  url: string;
  uploadDate: string;
}

export interface GlobalSettings {
  logoUrl: string;
  heroImageUrl: string;
}

export interface Operation {
  id: string;
  title: string;
  description: string;
  order?: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  iconName: string;
  color: string;
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  details: string[];
}

export interface OrgUnit {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
}

const DEFAULT_ORG_UNITS: OrgUnit[] = [
  { id: 'org-1', name: 'وحدة الأدلة الجنائية بمجمع الطوارئ بالمعيصم', logoUrl: '', order: 1 },
  { id: 'org-2', name: 'وحدة الأدلة الجنائية بعرفة', logoUrl: '', order: 2 },
  { id: 'org-3', name: 'وحدة الأدلة الجنائية بالجمرات', logoUrl: '', order: 3 },
  { id: 'org-4', name: 'وحدات الأدلة الجنائية بالشرائع', logoUrl: '', order: 4 },
];

const DEFAULT_SETTINGS: GlobalSettings = {
  logoUrl: 'logo.png',
  heroImageUrl: 'hajj_hero.jpg'
};

const DEFAULT_STATS: Stat[] = [
  { id: '1', label: 'أجهزة مكتبية', value: 48, iconName: 'Monitor', color: 'text-brand-blue' },
  { id: '2', label: 'طابعات شبكية', value: 28, iconName: 'Printer', color: 'text-brand-gold' },
  { id: '3', label: 'هواتف شبكية', value: 21, iconName: 'Phone', color: 'text-brand-blue' },
  { id: '4', label: 'راوترات 5G', value: 11, iconName: 'Wifi', color: 'text-brand-gold' },
  { id: '5', label: 'أجهزة ميدانية', value: 288, iconName: 'Smartphone', color: 'text-brand-blue' },
];

const DEFAULT_UNITS: Unit[] = [
  {
    id: '911',
    name: 'المجمع الأمني 911',
    description: 'دعم جاهزية الموقع بأجهزة مكتبية وطابعات وراوترات 5G لضمان سرعة نقل البيانات.',
    details: [
      'تركيب 48 جهاز مكتبي',
      'تفعيل 21 هاتف شبكي',
      'استلام 11 راوتر STC 5G',
      'تفعيل جميع النقاط الشبكية'
    ]
  },
  {
    id: 'sharae',
    name: 'وحدة الشرائع',
    description: 'تكامل الأنظمة الأمنية والبوابة الداخلية للأمن العام.',
    details: [
      'تركيب 3 أجهزة مكتبية',
      'تركيب 3 طابعات',
      'تفعيل نظام CLAIMS',
      'نظام المراسلات الإلكترونية'
    ]
  },
  {
    id: 'maisim',
    name: 'مجمع المعيصم',
    description: 'رفع كفاءة الاتصال وضمان استقرار البنية التحتية للشبكة.',
    details: [
      'سرعة اتصال 30 ميغابت/ث',
      'تفعيل أنظمة مركز المعلومات الوطني NIC',
      'تشغيل أنظمة الأمن العام بالكامل',
      'تركيب شبكة مايفون للاتصال الرقمي'
    ]
  },
  {
    id: 'arafat',
    name: 'وحدة عرفة',
    description: 'تجهيزات موسعة لضمان التشغيل الكامل خلال يوم عرفة.',
    details: [
      'نظام المايكرويف الخاص بـ NIC',
      'تفعيل 28 نقطة شبكة داخلية',
      'تشغيل مودم STC 5G',
      'تركيب SD-WAN للأمن العام'
    ]
  },
  {
    id: 'jamarat',
    name: 'وحدة الجمرات',
    description: 'تغطية شبكية شاملة لدعم أعمال الأدلة الجنائية في الجمرات.',
    details: [
      'تركيب شبكة مايفون',
      'تشغيل شبكة الأمن العام',
      'ربط بمركز المعلومات الوطني'
    ]
  }
];

const DEFAULT_IMAGES: Image[] = [
  {
    id: '1',
    title: 'تجهيز مشعر عرفات',
    description: 'تركيب وتوصيل الأجهزة المكتبية وشبكات الاتصال في مشعر عرفات لعام 1446هـ.',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  },
  {
    id: '2',
    title: 'تجهيز مشعر مزدلفة',
    description: 'تجهيز غرف المراقبة والربط الشبكي الميداني لضمان استمرارية الخدمة.',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  },
  {
    id: '3',
    title: 'تجهيز مشعر منى',
    description: 'الأعمال الفنية والربط التقني في المواقع الميدانية بمشعر منى.',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  },
  {
    id: '4',
    title: 'الربط التقني المتقدم',
    description: 'تفعيل أنظمة الألياف البصرية والربط السلكي واللاسلكي عالي السرعة.',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  },
  {
    id: '5',
    title: 'الاختبارات الفنية',
    description: 'فحص جاهزية الأجهزة والأنظمة قبل انطلاق موسم الحج بمدة كافية.',
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  },
  {
    id: '6',
    title: 'الدعم التقني المستمر',
    description: 'تجهيز مكاتب الدعم الفني الميداني الموزعة في كافة المشاعر.',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    uploadDate: new Date().toISOString()
  }
];

const DEFAULT_OPERATIONS: Operation[] = [
  { id: 'op-1', title: 'تجهيز البنية التحتية', description: 'تم الانتهاء من تجهيز البنية التحتية لجميع المواقع وتمديد شبكات الألياف الضوئية.', order: 1 },
  { id: 'op-2', title: 'تفعيل الأنظمة الأمنية', description: 'تفعيل جميع الأنظمة الأمنية والدوائر التلفزيونية المغلقة وربطها بمركز القيادة والسيطرة.', order: 2 },
  { id: 'op-3', title: 'تشغيل شبكات الاتصال', description: 'تشغيل أنظمة الاتصال اللاسلكي وتوزيع الأجهزة على كافة الفرق الميدانية.', order: 3 },
];

class AdminStore {
  private images: Image[] = [];
  private settings: GlobalSettings = { ...DEFAULT_SETTINGS };
  private stats: Stat[] = [];
  private units: Unit[] = [];
  private orgUnits: OrgUnit[] = [];
  private operations: Operation[] = [];
  private credentials = { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const storedImages = localStorage.getItem('admin-images');
    if (storedImages) {
      this.images = JSON.parse(storedImages);
    } else {
      this.images = [...DEFAULT_IMAGES];
    }

    const storedSettings = localStorage.getItem('admin-settings');
    if (storedSettings) {
      this.settings = JSON.parse(storedSettings);
    } else {
      this.settings = { ...DEFAULT_SETTINGS };
    }

    const storedStats = localStorage.getItem('admin-stats');
    if (storedStats) {
      this.stats = JSON.parse(storedStats);
    } else {
      this.stats = [...DEFAULT_STATS];
    }

    const storedUnits = localStorage.getItem('admin-units');
    if (storedUnits) {
      this.units = JSON.parse(storedUnits);
    } else {
      this.units = [...DEFAULT_UNITS];
    }

    const storedOrgUnits = localStorage.getItem('admin-org-units');
    if (storedOrgUnits) {
      this.orgUnits = JSON.parse(storedOrgUnits);
    } else {
      this.orgUnits = [...DEFAULT_ORG_UNITS];
    }

    const storedOperations = localStorage.getItem('admin-operations');
    if (storedOperations) {
      this.operations = JSON.parse(storedOperations);
    } else {
      this.operations = [...DEFAULT_OPERATIONS];
    }
    
    const storedCredentials = localStorage.getItem('admin-credentials');
    if (storedCredentials) {
      this.credentials = JSON.parse(storedCredentials);
    }
    
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('admin-images', JSON.stringify(this.images));
    localStorage.setItem('admin-settings', JSON.stringify(this.settings));
    localStorage.setItem('admin-stats', JSON.stringify(this.stats));
    localStorage.setItem('admin-units', JSON.stringify(this.units));
    localStorage.setItem('admin-org-units', JSON.stringify(this.orgUnits));
    localStorage.setItem('admin-operations', JSON.stringify(this.operations));
    localStorage.setItem('admin-credentials', JSON.stringify(this.credentials));
  }

  // Settings
  getSettings(): GlobalSettings {
    return { ...this.settings };
  }

  updateSettings(settings: Partial<GlobalSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.saveToLocalStorage();
    return this.settings;
  }

  // Stats
  getAllStats(): Stat[] {
    return [...this.stats];
  }

  addStat(label: string, value: number, iconName: string = 'Activity', color: string = 'text-brand-blue'): Stat {
    const newStat: Stat = {
      id: Date.now().toString(),
      label,
      value,
      iconName,
      color,
    };
    this.stats.push(newStat);
    this.saveToLocalStorage();
    return newStat;
  }

  updateStat(id: string, label: string, value: number, iconName: string, color: string): Stat | null {
    const stat = this.stats.find(s => s.id === id);
    if (stat) {
      stat.label = label;
      stat.value = value;
      stat.iconName = iconName;
      stat.color = color;
      this.saveToLocalStorage();
      return stat;
    }
    return null;
  }

  deleteStat(id: string): boolean {
    const index = this.stats.findIndex(s => s.id === id);
    if (index !== -1) {
      this.stats.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Units
  getAllUnits(): Unit[] {
    return [...this.units];
  }

  addUnit(name: string, description: string, details: string[]): Unit {
    const newUnit: Unit = {
      id: Date.now().toString(),
      name,
      description,
      details,
    };
    this.units.push(newUnit);
    this.saveToLocalStorage();
    return newUnit;
  }

  updateUnit(id: string, name: string, description: string, details: string[]): Unit | null {
    const unit = this.units.find(u => u.id === id);
    if (unit) {
      unit.name = name;
      unit.description = description;
      unit.details = details;
      this.saveToLocalStorage();
      return unit;
    }
    return null;
  }

  deleteUnit(id: string): boolean {
    const index = this.units.findIndex(u => u.id === id);
    if (index !== -1) {
      this.units.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Images
  getAllImages(): Image[] {
    return [...this.images];
  }

  addImage(title: string, description: string, url: string): Image {
    const newImage: Image = {
      id: Date.now().toString(),
      title,
      description,
      url,
      uploadDate: new Date().toISOString()
    };
    this.images.push(newImage);
    this.saveToLocalStorage();
    return newImage;
  }

  updateImage(id: string, title: string, description: string, url: string): Image | null {
    const image = this.images.find(img => img.id === id);
    if (image) {
      image.title = title;
      image.description = description;
      image.url = url;
      this.saveToLocalStorage();
      return image;
    }
    return null;
  }

  deleteImage(id: string): boolean {
    const index = this.images.findIndex(img => img.id === id);
    if (index !== -1) {
      this.images.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Org Units
  getAllOrgUnits(): OrgUnit[] {
    return [...this.orgUnits].sort((a, b) => a.order - b.order);
  }

  addOrgUnit(name: string, logoUrl: string): OrgUnit {
    const maxOrder = this.orgUnits.reduce((max, u) => Math.max(max, u.order), 0);
    const newOrgUnit: OrgUnit = {
      id: Date.now().toString(),
      name,
      logoUrl,
      order: maxOrder + 1,
    };
    this.orgUnits.push(newOrgUnit);
    this.saveToLocalStorage();
    return newOrgUnit;
  }

  updateOrgUnit(id: string, name: string, logoUrl: string): OrgUnit | null {
    const unit = this.orgUnits.find(u => u.id === id);
    if (unit) {
      unit.name = name;
      unit.logoUrl = logoUrl;
      this.saveToLocalStorage();
      return unit;
    }
    return null;
  }

  deleteOrgUnit(id: string): boolean {
    const index = this.orgUnits.findIndex(u => u.id === id);
    if (index !== -1) {
      this.orgUnits.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Operations
  getAllOperations(): Operation[] {
    return [...this.operations].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  addOperation(title: string, description: string): Operation {
    const maxOrder = this.operations.reduce((max, op) => Math.max(max, op.order || 0), 0);
    const newOperation: Operation = {
      id: Date.now().toString(),
      title,
      description,
      order: maxOrder + 1,
    };
    this.operations.push(newOperation);
    this.saveToLocalStorage();
    return newOperation;
  }

  updateOperation(id: string, title: string, description: string): Operation | null {
    const op = this.operations.find(o => o.id === id);
    if (op) {
      op.title = title;
      op.description = description;
      this.saveToLocalStorage();
      return op;
    }
    return null;
  }

  deleteOperation(id: string): boolean {
    const index = this.operations.findIndex(o => o.id === id);
    if (index !== -1) {
      this.operations.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  updateCredentials(username: string, password: string) {
    this.credentials = { username, password };
    this.saveToLocalStorage();
  }

  verifyCredentials(username: string, password: string): boolean {
    return username === this.credentials.username && password === this.credentials.password;
  }
}

export const adminStore = new AdminStore();
