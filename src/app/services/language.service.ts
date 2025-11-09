import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'fr' | 'es' | 'de';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>(this.getInitialLanguage());
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Record<Language, Record<string, string>> = {
    en: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.records': 'Records',
      'nav.iot_panel': 'IoT Panel',
      'nav.add_sensor_data': 'Add Sensor Data',
      'nav.payments': 'Payments',
      'nav.family_portal': 'Family Portal',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',
      'nav.logout': 'Logout',
      'nav.profile': 'Profile',

      // Dashboard
      'dashboard.title': 'Smart Mortuary Management System',
      'dashboard.subtitle': 'Powered by Melakah Infotech Solutions',
      'dashboard.total_records': 'Total Records',
      'dashboard.all_records': 'All mortuary records',
      'dashboard.active_sensors': 'Active Sensors',
      'dashboard.cold_storage_online': 'Cold storage units online',
      'dashboard.pending_status': 'Pending Status',
      'dashboard.awaiting_identification': 'Awaiting identification',
      'dashboard.in_storage': 'In Storage',
      'dashboard.currently_stored': 'Currently stored',
      'dashboard.recent_records': 'Recent Mortuary Records',
      'dashboard.latest_records': 'Latest mortuary records and status updates',
      'dashboard.iot_monitoring': 'IoT Cold Storage Monitoring',
      'dashboard.realtime_monitoring': 'Real-time temperature and humidity monitoring',

      // Records
      'records.title': 'Mortuary Records',
      'records.search_name': 'Search Name',
      'records.filter_status': 'Filter by Status',
      'records.all_statuses': 'All Statuses',
      'records.pending': 'Pending',
      'records.in_storage': 'In Storage',
      'records.in_transit': 'In Transit',
      'records.released': 'Released',
      'records.storage_unit': 'Storage Unit',
      'records.all_units': 'All Units',
      'records.clear_filters': 'Clear Filters',
      'records.active_filters': 'Active filters',
      'records.full_name': 'Full Name',
      'records.status': 'Status',
      'records.storage_slot': 'Storage Slot',
      'records.family_contact': 'Family Contact',
      'records.actions': 'Actions',
      'records.view': 'View',
      'records.edit': 'Edit',
      'records.save': 'Save',
      'records.cancel': 'Cancel',
      'records.select_unit': 'Select Unit',
      'records.add_new_record': 'Add New Record',
      'records.add_first_record': 'Add First Record',
      'family_portal.title': 'Family Portal',
      'family_portal.subtitle': 'Track your loved one\'s information and receive updates',
      'family_portal.find_record': 'Find Record',
      'family_portal.record_id': 'Record ID',
      'family_portal.full_name': 'Full Name',
      'family_portal.search': 'Search Record',
      'family_portal.searching': 'Searching...',
      'family_portal.loading_data': 'Loading Data...',
      'family_portal.record_info': 'Record Information',
      'family_portal.record_details': 'Record Details',
      'family_portal.family_contact': 'Family Contact Information',
      'family_portal.financial_info': 'Financial Information',
      'family_portal.amount': 'Amount',
      'family_portal.payment_status': 'Payment Status',
      'family_portal.paid': 'Paid',
      'family_portal.unpaid': 'Unpaid',
      'family_portal.pending': 'Pending',
      'family_portal.invoice_id': 'Invoice ID',
      'family_portal.status_updates': 'Status Updates',
      'family_portal.record_created': 'Record Created',
      'family_portal.contact_us': 'Contact Us',

      // Common
      'common.loading': 'Loading...',
      'common.no_data': 'No data available',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.phone': 'Phone',
      'common.email': 'Email',
      'common.hours': 'Hours',
      'common.24_7_support': '24/7 Emergency Support'
    },
    fr: {
      // Navigation
      'nav.dashboard': 'Tableau de Bord',
      'nav.records': 'Registres',
      'nav.iot_panel': 'Panneau IoT',
      'nav.add_sensor_data': 'Ajouter Données Capteur',
      'nav.payments': 'Paiements',
      'nav.family_portal': 'Portail Familial',
      'nav.login': 'Connexion',
      'nav.signup': 'Inscription',
      'nav.logout': 'Déconnexion',
      'nav.profile': 'Profil',

      // Dashboard
      'dashboard.title': 'Système de Gestion Mortuaire Intelligent',
      'dashboard.subtitle': 'Propulsé par Melakah Infotech Solutions',
      'dashboard.total_records': 'Total des Registres',
      'dashboard.all_records': 'Tous les registres mortuaires',
      'dashboard.active_sensors': 'Capteurs Actifs',
      'dashboard.cold_storage_online': 'Unités de stockage froid en ligne',
      'dashboard.pending_status': 'Statut en Attente',
      'dashboard.awaiting_identification': 'En attente d\'identification',
      'dashboard.in_storage': 'En Stockage',
      'dashboard.currently_stored': 'Actuellement stocké',
      'dashboard.recent_records': 'Registres Mortuaires Récents',
      'dashboard.latest_records': 'Derniers registres et mises à jour de statut',
      'dashboard.iot_monitoring': 'Surveillance du Stockage Froid IoT',
      'dashboard.realtime_monitoring': 'Surveillance en temps réel de la température et de l\'humidité',

      // Records
      'records.title': 'Registres Mortuaires',
      'records.search_name': 'Rechercher Nom',
      'records.filter_status': 'Filtrer par Statut',
      'records.all_statuses': 'Tous les Statuts',
      'records.pending': 'En Attente',
      'records.in_storage': 'En Stockage',
      'records.in_transit': 'En Transit',
      'records.released': 'Libéré',
      'records.storage_unit': 'Unité de Stockage',
      'records.all_units': 'Toutes les Unités',
      'records.clear_filters': 'Effacer Filtres',
      'records.active_filters': 'Filtres actifs',
      'records.full_name': 'Nom Complet',
      'records.status': 'Statut',
      'records.storage_slot': 'Emplacement de Stockage',
      'records.family_contact': 'Contact Familial',
      'records.actions': 'Actions',
      'records.view': 'Voir',
      'records.edit': 'Modifier',
      'records.save': 'Sauvegarder',
      'records.cancel': 'Annuler',
      'records.select_unit': 'Sélectionner Unité',

      // Family Portal
      'family_portal.title': 'Portail Familial',
      'family_portal.subtitle': 'Suivez les informations de votre être cher et recevez des mises à jour',
      'family_portal.find_record': 'Trouver un Registre',
      'family_portal.record_id': 'ID du Registre',
      'family_portal.full_name': 'Nom Complet',
      'family_portal.search': 'Rechercher Registre',
      'family_portal.searching': 'Recherche...',
      'family_portal.loading_data': 'Chargement des Données...',
      'family_portal.record_info': 'Informations du Registre',
      'family_portal.record_details': 'Détails du Registre',
      'family_portal.family_contact': 'Informations de Contact Familial',
      'family_portal.financial_info': 'Informations Financières',
      'family_portal.amount': 'Montant',
      'family_portal.payment_status': 'Statut de Paiement',
      'family_portal.paid': 'Payé',
      'family_portal.unpaid': 'Non Payé',
      'family_portal.pending': 'En Attente',
      'family_portal.invoice_id': 'ID Facture',
      'family_portal.status_updates': 'Mises à Jour de Statut',
      'family_portal.record_created': 'Registre Créé',
      'family_portal.contact_us': 'Contactez-Nous',

      // Common
      'common.loading': 'Chargement...',
      'common.no_data': 'Aucune donnée disponible',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.phone': 'Téléphone',
      'common.email': 'Email',
      'common.hours': 'Heures',
      'common.24_7_support': 'Support d\'Urgence 24/7'
    },
    es: {
      // Navigation
      'nav.dashboard': 'Panel de Control',
      'nav.records': 'Registros',
      'nav.iot_panel': 'Panel IoT',
      'nav.add_sensor_data': 'Agregar Datos de Sensor',
      'nav.payments': 'Pagos',
      'nav.family_portal': 'Portal Familiar',
      'nav.login': 'Iniciar Sesión',
      'nav.signup': 'Registrarse',
      'nav.logout': 'Cerrar Sesión',
      'nav.profile': 'Perfil',

      // Dashboard
      'dashboard.title': 'Sistema de Gestión Mortuoria Inteligente',
      'dashboard.subtitle': 'Desarrollado por Melakah Infotech Solutions',
      'dashboard.total_records': 'Total de Registros',
      'dashboard.all_records': 'Todos los registros mortuorios',
      'dashboard.active_sensors': 'Sensores Activos',
      'dashboard.cold_storage_online': 'Unidades de almacenamiento frío en línea',
      'dashboard.pending_status': 'Estado Pendiente',
      'dashboard.awaiting_identification': 'Esperando identificación',
      'dashboard.in_storage': 'En Almacenamiento',
      'dashboard.currently_stored': 'Actualmente almacenado',
      'dashboard.recent_records': 'Registros Mortuorios Recientes',
      'dashboard.latest_records': 'Últimos registros y actualizaciones de estado',
      'dashboard.iot_monitoring': 'Monitoreo de Almacenamiento Frío IoT',
      'dashboard.realtime_monitoring': 'Monitoreo en tiempo real de temperatura y humedad',

      // Records
      'records.title': 'Registros Mortuorios',
      'records.search_name': 'Buscar Nombre',
      'records.filter_status': 'Filtrar por Estado',
      'records.all_statuses': 'Todos los Estados',
      'records.pending': 'Pendiente',
      'records.in_storage': 'En Almacenamiento',
      'records.in_transit': 'En Tránsito',
      'records.released': 'Liberado',
      'records.storage_unit': 'Unidad de Almacenamiento',
      'records.all_units': 'Todas las Unidades',
      'records.clear_filters': 'Limpiar Filtros',
      'records.active_filters': 'Filtros activos',
      'records.full_name': 'Nombre Completo',
      'records.status': 'Estado',
      'records.storage_slot': 'Espacio de Almacenamiento',
      'records.family_contact': 'Contacto Familiar',
      'records.actions': 'Acciones',
      'records.view': 'Ver',
      'records.edit': 'Editar',
      'records.save': 'Guardar',
      'records.cancel': 'Cancelar',
      'records.select_unit': 'Seleccionar Unidad',

      // Family Portal
      'family_portal.title': 'Portal Familiar',
      'family_portal.subtitle': 'Rastree la información de su ser querido y reciba actualizaciones',
      'family_portal.find_record': 'Buscar Registro',
      'family_portal.record_id': 'ID del Registro',
      'family_portal.full_name': 'Nombre Completo',
      'family_portal.search': 'Buscar Registro',
      'family_portal.searching': 'Buscando...',
      'family_portal.loading_data': 'Cargando Datos...',
      'family_portal.record_info': 'Información del Registro',
      'family_portal.record_details': 'Detalles del Registro',
      'family_portal.family_contact': 'Información de Contacto Familiar',
      'family_portal.financial_info': 'Información Financiera',
      'family_portal.amount': 'Monto',
      'family_portal.payment_status': 'Estado de Pago',
      'family_portal.paid': 'Pagado',
      'family_portal.unpaid': 'No Pagado',
      'family_portal.pending': 'Pendiente',
      'family_portal.invoice_id': 'ID de Factura',
      'family_portal.status_updates': 'Actualizaciones de Estado',
      'family_portal.record_created': 'Registro Creado',
      'family_portal.contact_us': 'Contáctenos',

      // Common
      'common.loading': 'Cargando...',
      'common.no_data': 'No hay datos disponibles',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.phone': 'Teléfono',
      'common.email': 'Correo Electrónico',
      'common.hours': 'Horas',
      'common.24_7_support': 'Soporte de Emergencia 24/7'
    },
    de: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.records': 'Aufzeichnungen',
      'nav.iot_panel': 'IoT-Panel',
      'nav.add_sensor_data': 'Sensordaten Hinzufügen',
      'nav.payments': 'Zahlungen',
      'nav.family_portal': 'Familienportal',
      'nav.login': 'Anmelden',
      'nav.signup': 'Registrieren',
      'nav.logout': 'Abmelden',
      'nav.profile': 'Profil',

      // Dashboard
      'dashboard.title': 'Intelligentes Leichenhallen-Management-System',
      'dashboard.subtitle': 'Unterstützt von Melakah Infotech Solutions',
      'dashboard.total_records': 'Gesamtanzahl Aufzeichnungen',
      'dashboard.all_records': 'Alle Leichenhallen-Aufzeichnungen',
      'dashboard.active_sensors': 'Aktive Sensoren',
      'dashboard.cold_storage_online': 'Kaltlager-Einheiten online',
      'dashboard.pending_status': 'Ausstehender Status',
      'dashboard.awaiting_identification': 'Warten auf Identifizierung',
      'dashboard.in_storage': 'Im Lager',
      'dashboard.currently_stored': 'Derzeit gelagert',
      'dashboard.recent_records': 'Kürzliche Leichenhallen-Aufzeichnungen',
      'dashboard.latest_records': 'Neueste Aufzeichnungen und Status-Updates',
      'dashboard.iot_monitoring': 'IoT-Kaltlager-Überwachung',
      'dashboard.realtime_monitoring': 'Echtzeit-Temperatur- und Feuchtigkeitsüberwachung',

      // Records
      'records.title': 'Leichenhallen-Aufzeichnungen',
      'records.search_name': 'Name Suchen',
      'records.filter_status': 'Nach Status Filtern',
      'records.all_statuses': 'Alle Status',
      'records.pending': 'Ausstehend',
      'records.in_storage': 'Im Lager',
      'records.in_transit': 'Im Transit',
      'records.released': 'Freigegeben',
      'records.storage_unit': 'Lager-Einheit',
      'records.all_units': 'Alle Einheiten',
      'records.clear_filters': 'Filter Löschen',
      'records.active_filters': 'Aktive Filter',
      'records.full_name': 'Vollständiger Name',
      'records.status': 'Status',
      'records.storage_slot': 'Lagerplatz',
      'records.family_contact': 'Familienkontakt',
      'records.actions': 'Aktionen',
      'records.view': 'Ansehen',
      'records.edit': 'Bearbeiten',
      'records.save': 'Speichern',
      'records.cancel': 'Abbrechen',
      'records.select_unit': 'Einheit Auswählen',

      // Family Portal
      'family_portal.title': 'Familienportal',
      'family_portal.subtitle': 'Verfolgen Sie die Informationen Ihres geliebten Menschen und erhalten Sie Updates',
      'family_portal.find_record': 'Aufzeichnung Finden',
      'family_portal.record_id': 'Aufzeichnungs-ID',
      'family_portal.full_name': 'Vollständiger Name',
      'family_portal.search': 'Aufzeichnung Suchen',
      'family_portal.searching': 'Suche...',
      'family_portal.loading_data': 'Daten Laden...',
      'family_portal.record_info': 'Aufzeichnungs-Informationen',
      'family_portal.record_details': 'Aufzeichnungs-Details',
      'family_portal.family_contact': 'Familien-Kontaktinformationen',
      'family_portal.financial_info': 'Finanzielle Informationen',
      'family_portal.amount': 'Betrag',
      'family_portal.payment_status': 'Zahlungsstatus',
      'family_portal.paid': 'Bezahlt',
      'family_portal.unpaid': 'Unbezahlt',
      'family_portal.pending': 'Ausstehend',
      'family_portal.invoice_id': 'Rechnungs-ID',
      'family_portal.status_updates': 'Status-Updates',
      'family_portal.record_created': 'Aufzeichnung Erstellt',
      'family_portal.contact_us': 'Kontaktieren Sie Uns',

      // Common
      'common.loading': 'Laden...',
      'common.no_data': 'Keine Daten verfügbar',
      'common.error': 'Fehler',
      'common.success': 'Erfolg',
      'common.phone': 'Telefon',
      'common.email': 'E-Mail',
      'common.hours': 'Stunden',
      'common.24_7_support': '24/7 Notfall-Support'
    }
  };

  constructor() {
    this.applyLanguage(this.currentLanguageSubject.value);
  }

  private getInitialLanguage(): Language {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'fr', 'es', 'de'].includes(savedLanguage)) {
      return savedLanguage as Language;
    }
    return 'en'; // Default to English
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
    this.applyLanguage(language);
  }

  private applyLanguage(language: Language): void {
    // This could be used to update document attributes or apply global language settings
    document.documentElement.lang = language;
  }

  translate(key: string): string {
    const currentLang = this.currentLanguageSubject.value;
    return this.translations[currentLang][key] || this.translations.en[key] || key;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' },
      { code: 'de', name: 'Deutsch' }
    ];
  }
}