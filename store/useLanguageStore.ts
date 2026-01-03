import { create } from 'zustand';

type Language = 'en' | 'es';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'login.title': 'Sign in to manage your company',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.btn': 'Sign In',
    'login.footer': "Don't have an account?",
    'login.create': 'Create Free Account',
    'register.title': 'Create your account',
    'register.subtitle': 'Start managing your business today',
    'register.name': 'Full Name',
    'register.btn': 'Create Account',
    'register.footer': 'Already have an account?',
    'register.login': 'Login here',

    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Company Profile',
    'nav.folders': 'Folders & Products',
    'nav.logout': 'Logout',
    'nav.mode.light': 'Light Mode',
    'nav.mode.dark': 'Dark Mode',

    // Dashboard
    'dash.title': 'Dashboard',
    'dash.subtitle': 'Overview of your business',
    'dash.totalFolders': 'Total Folders',
    'dash.totalProducts': 'Total Products',
    'dash.lowStock': 'Low Stock Alerts',
    'dash.profile': 'Profile Status',
    'dash.quickActions': 'Quick Actions',
    'dash.newProduct': 'New Product',
    'dash.newFolder': 'New Folder',
    'dash.recentActivity': 'Recent Activity',

    // Company
    'company.title': 'Company Profile',
    'company.identity': 'Identity',
    'company.contact': 'Contact',
    'company.location': 'Location',
    'company.fiscal': 'Fiscal',
    'company.save': 'Save Changes',
    'company.logo': 'Company Logo',
    'company.upload': 'Upload',

    // Folders
    'folders.title': 'Product Folders',
    'folders.subtitle': 'Organize your inventory in containers',
    'folders.search': 'Search folders...',
    'folders.create': 'Create New Folder',
    'folders.items': 'items',
    'folders.status.draft': 'Draft',
    'folders.status.published': 'Published',
    'folders.image': 'Cover Image URL',

    // Folder Details
    'details.editFolder': 'Edit Folder',
    'details.addProduct': 'Add Product',
    'details.editProduct': 'Edit Product',
    'details.products': 'Products',
    'details.table.product': 'Product',
    'details.table.sku': 'SKU',
    'details.table.stock': 'Stock',
    'details.table.price': 'Price',
    'details.table.type': 'Type',
    'details.table.actions': 'Actions',
    'details.empty': 'No products in this folder yet.',
    'details.delete': 'Delete',
    'details.edit': 'Edit',
    
    // Product Modal
    'product.images': 'Images',
    'product.addImage': 'Add Image URL',
    'product.primary': 'Primary',
    'product.remove': 'Remove',

    // Sorting & Filtering
    'sort.sortBy': 'Sort by',
    'sort.name': 'Name',
    'sort.price': 'Price',
    'sort.stock': 'Stock',
    'filter.allTypes': 'All Types',

    // Toasts
    'toast.productCreated': 'Product created successfully',
    'toast.productUpdated': 'Product updated successfully',
    'toast.productDeleted': 'Product deleted successfully',
    'toast.folderUpdated': 'Folder updated successfully',

    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.confirm': 'Are you sure?',
  },
  es: {
    // Auth
    'login.title': 'Inicia sesión para gestionar tu empresa',
    'login.email': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.btn': 'Iniciar Sesión',
    'login.footer': '¿No tienes cuenta?',
    'login.create': 'Crear Cuenta Gratis',
    'register.title': 'Crea tu cuenta',
    'register.subtitle': 'Comienza a gestionar tu negocio hoy',
    'register.name': 'Nombre Completo',
    'register.btn': 'Crear Cuenta',
    'register.footer': '¿Ya tienes cuenta?',
    'register.login': 'Inicia sesión aquí',

    // Sidebar
    'nav.dashboard': 'Panel Principal',
    'nav.profile': 'Perfil Empresa',
    'nav.folders': 'Carpetas y Productos',
    'nav.logout': 'Cerrar Sesión',
    'nav.mode.light': 'Modo Claro',
    'nav.mode.dark': 'Modo Oscuro',

    // Dashboard
    'dash.title': 'Panel Principal',
    'dash.subtitle': 'Resumen de tu negocio',
    'dash.totalFolders': 'Carpetas Totales',
    'dash.totalProducts': 'Productos Totales',
    'dash.lowStock': 'Alertas Stock Bajo',
    'dash.profile': 'Estado del Perfil',
    'dash.quickActions': 'Acciones Rápidas',
    'dash.newProduct': 'Nuevo Producto',
    'dash.newFolder': 'Nueva Carpeta',
    'dash.recentActivity': 'Actividad Reciente',

    // Company
    'company.title': 'Perfil de Empresa',
    'company.identity': 'Identidad',
    'company.contact': 'Contacto',
    'company.location': 'Ubicación',
    'company.fiscal': 'Fiscal',
    'company.save': 'Guardar Cambios',
    'company.logo': 'Logo Empresa',
    'company.upload': 'Subir',

    // Folders
    'folders.title': 'Carpetas de Productos',
    'folders.subtitle': 'Organiza tu inventario en contenedores',
    'folders.search': 'Buscar carpetas...',
    'folders.create': 'Crear Nueva Carpeta',
    'folders.items': 'items',
    'folders.status.draft': 'Borrador',
    'folders.status.published': 'Publicado',
    'folders.image': 'URL Imagen de Portada',

    // Folder Details
    'details.editFolder': 'Editar Carpeta',
    'details.addProduct': 'Añadir Producto',
    'details.editProduct': 'Editar Producto',
    'details.products': 'Productos',
    'details.table.product': 'Producto',
    'details.table.sku': 'SKU',
    'details.table.stock': 'Stock',
    'details.table.price': 'Precio',
    'details.table.type': 'Tipo',
    'details.table.actions': 'Acciones',
    'details.empty': 'Aún no hay productos en esta carpeta.',
    'details.delete': 'Eliminar',
    'details.edit': 'Editar',

    // Product Modal
    'product.images': 'Imágenes',
    'product.addImage': 'Añadir URL Imagen',
    'product.primary': 'Principal',
    'product.remove': 'Quitar',

    // Sorting & Filtering
    'sort.sortBy': 'Ordenar por',
    'sort.name': 'Nombre',
    'sort.price': 'Precio',
    'sort.stock': 'Stock',
    'filter.allTypes': 'Todos los tipos',

    // Toasts
    'toast.productCreated': 'Producto creado con éxito',
    'toast.productUpdated': 'Producto actualizado con éxito',
    'toast.productDeleted': 'Producto eliminado con éxito',
    'toast.folderUpdated': 'Carpeta actualizada con éxito',

    // Common
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.loading': 'Cargando...',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.confirm': '¿Estás seguro?',
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    // @ts-ignore
    return translations[lang][key] || key;
  }
}));
