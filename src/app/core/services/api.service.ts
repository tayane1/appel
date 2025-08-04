import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tender, TenderStatus, TenderDocument, TenderType } from '../models/tender.model';
import { Supplier } from '../models/supplier.model';
import { User, UserRole } from '../models/user.model';
import { Advertisement, AdPosition, AdType } from '../models/advertisement.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  // Données mockées pour éviter les erreurs de connexion
  private mockTenders: Tender[] = [
    {
      id: '1',
      title: 'Construction d\'un pont sur la lagune Ébrié',
      description: 'Appel d\'offres pour la construction d\'un pont moderne reliant Abidjan à Grand-Bassam',
      reference: 'AO-2024-001',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'BTP & Construction',
      location: 'Abidjan, Côte d\'Ivoire',
      publishDate: new Date('2024-01-15'),
      deadline: new Date('2024-12-31'),
      estimatedAmount: 25000000,
      currency: 'FCFA',
      contactEmail: 'contact@btp.ci',
      contactPhone: '+225 27 22 49 12 34',
      documents: [
        {
          id: 'doc1',
          name: 'cahier-des-charges.pdf',
          url: '/documents/cahier-des-charges.pdf',
          size: 2048576,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-15')
        },
        {
          id: 'doc2',
          name: 'plans-techniques.pdf',
          url: '/documents/plans-techniques.pdf',
          size: 1048576,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-15')
        }
      ],
      organizationName: 'Ministère des Travaux Publics',
      requirements: ['Certification ISO 9001', 'Expérience minimum 10 ans', 'Capital social > 5M FCFA'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Fourniture de matériel informatique pour écoles',
      description: 'Acquisition d\'ordinateurs et équipements informatiques pour 50 écoles primaires',
      reference: 'AO-2024-002',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'Informatique & Technologies',
      location: 'Toutes les régions',
      publishDate: new Date('2024-01-10'),
      deadline: new Date('2024-11-30'),
      estimatedAmount: 5000000,
      currency: 'FCFA',
      contactEmail: 'contact@education.ci',
      contactPhone: '+225 27 22 49 56 78',
      documents: [
        {
          id: 'doc3',
          name: 'specifications-techniques.pdf',
          url: '/documents/specifications-techniques.pdf',
          size: 1536000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-10')
        }
      ],
      organizationName: 'Ministère de l\'Éducation',
      requirements: ['Garantie 3 ans', 'Support technique', 'Formation utilisateurs'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Services de nettoyage urbain',
      description: 'Prestation de services de nettoyage et d\'entretien des espaces publics',
      reference: 'AO-2024-003',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'Services',
      location: 'Abidjan',
      publishDate: new Date('2024-01-05'),
      deadline: new Date('2024-10-15'),
      estimatedAmount: 8000000,
      currency: 'FCFA',
      contactEmail: 'contact@mairie-abidjan.ci',
      contactPhone: '+225 27 22 49 90 12',
      documents: [
        {
          id: 'doc4',
          name: 'cahier-des-charges.pdf',
          url: '/documents/cahier-des-charges.pdf',
          size: 1024000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-05')
        }
      ],
      organizationName: 'Mairie d\'Abidjan',
      requirements: ['Équipements modernes', 'Personnel qualifié', 'Certification environnementale'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      title: 'Fourniture de médicaments essentiels',
      description: 'Acquisition de médicaments et produits pharmaceutiques pour hôpitaux publics',
      reference: 'AO-2024-004',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'Santé & Pharmaceutique',
      location: 'Côte d\'Ivoire',
      publishDate: new Date('2024-01-20'),
      deadline: new Date('2024-12-15'),
      estimatedAmount: 15000000,
      currency: 'FCFA',
      contactEmail: 'contact@sante.ci',
      contactPhone: '+225 27 22 49 34 56',
      documents: [
        {
          id: 'doc5',
          name: 'liste-medicaments.pdf',
          url: '/documents/liste-medicaments.pdf',
          size: 512000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-20')
        },
        {
          id: 'doc6',
          name: 'specifications.pdf',
          url: '/documents/specifications.pdf',
          size: 768000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-20')
        }
      ],
      organizationName: 'Ministère de la Santé',
      requirements: ['Autorisation ANEM', 'Bonnes pratiques de fabrication', 'Traçabilité'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '5',
      title: 'Installation de panneaux solaires',
      description: 'Équipement en énergie solaire de 100 centres de santé ruraux',
      reference: 'AO-2024-005',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'Énergie & Environnement',
      location: 'Zones rurales',
      publishDate: new Date('2024-01-12'),
      deadline: new Date('2024-11-20'),
      estimatedAmount: 12000000,
      currency: 'FCFA',
      contactEmail: 'contact@energie.ci',
      contactPhone: '+225 27 22 49 78 90',
      documents: [
        {
          id: 'doc7',
          name: 'specifications-techniques.pdf',
          url: '/documents/specifications-techniques.pdf',
          size: 2048000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-12')
        },
        {
          id: 'doc8',
          name: 'plan-installation.pdf',
          url: '/documents/plan-installation.pdf',
          size: 1536000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-12')
        }
      ],
      organizationName: 'Ministère de l\'Énergie',
      requirements: ['Certification énergétique', 'Maintenance préventive', 'Formation technique'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '6',
      title: 'Formation professionnelle en agriculture',
      description: 'Programme de formation pour 500 agriculteurs en techniques modernes',
      reference: 'AO-2024-006',
      type: TenderType.PUBLIC,
      status: TenderStatus.PUBLISHED,
      sector: 'Agriculture & Agroalimentaire',
      location: 'Régions agricoles',
      publishDate: new Date('2024-01-08'),
      deadline: new Date('2024-09-30'),
      estimatedAmount: 3000000,
      currency: 'FCFA',
      contactEmail: 'contact@agriculture.ci',
      contactPhone: '+225 27 22 49 12 34',
      documents: [
        {
          id: 'doc9',
          name: 'programme-formation.pdf',
          url: '/documents/programme-formation.pdf',
          size: 1024000,
          type: 'application/pdf',
          uploadDate: new Date('2024-01-08')
        }
      ],
      organizationName: 'Ministère de l\'Agriculture',
      requirements: ['Expertise agronomique', 'Méthodes pédagogiques', 'Suivi post-formation'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    }
  ];

  private mockSuppliers: Supplier[] = [
    {
      id: '1',
      companyName: 'BTP Excellence SARL',
      description: 'Entreprise leader dans la construction et les travaux publics',
      tagline: 'Excellence en construction',
      sector: 'BTP & Construction',
      subSectors: ['Construction', 'Rénovation', 'Infrastructure'],
      contactPerson: 'Moussa Koné',
      email: 'contact@btp-excellence.ci',
      phone: '+225 27 22 49 12 34',
      address: 'Cocody, Abidjan',
      city: 'Abidjan',
      website: 'https://btp-excellence.ci',
      logo: 'assets/images/suppliers/btp-excellence.png',
      images: ['assets/images/suppliers/btp-1.jpg', 'assets/images/suppliers/btp-2.jpg'],
      services: ['Construction', 'Rénovation', 'Infrastructure'],
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      yearsOfExperience: 15,
      isVerified: true,
      isFeatured: true,
      rating: 4.8,
      reviewsCount: 45,
      projects: [
        {
          title: 'Pont de la lagune',
          description: 'Construction d\'un pont moderne',
          year: 2023,
          client: 'Ministère des TP',
          value: 50000000
        }
      ],
      satisfiedClients: 120,
      successRate: 98,
      verificationStatus: 'verified',
      createdAt: new Date('2020-03-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      companyName: 'Tech Solutions CI',
      description: 'Spécialiste en solutions informatiques et digitales',
      tagline: 'Innovation technologique',
      sector: 'Informatique & Technologies',
      subSectors: ['Développement', 'Infrastructure', 'Consulting'],
      contactPerson: 'Fatou Diallo',
      email: 'info@techsolutions.ci',
      phone: '+225 27 22 49 56 78',
      address: 'Plateau, Abidjan',
      city: 'Abidjan',
      website: 'https://techsolutions.ci',
      logo: 'assets/images/suppliers/tech-solutions.png',
      images: ['assets/images/suppliers/tech-1.jpg'],
      services: ['Développement web', 'Infrastructure IT', 'Consulting'],
      certifications: ['Microsoft Partner', 'Cisco Certified'],
      yearsOfExperience: 8,
      isVerified: true,
      isFeatured: true,
      rating: 4.6,
      reviewsCount: 32,
      projects: [
        {
          title: 'Système de gestion',
          description: 'Développement d\'un ERP',
          year: 2023,
          client: 'Entreprise ABC',
          value: 25000000
        }
      ],
      satisfiedClients: 85,
      successRate: 95,
      verificationStatus: 'verified',
      createdAt: new Date('2018-07-20'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      companyName: 'Pharma Plus',
      description: 'Distributeur de produits pharmaceutiques de qualité',
      tagline: 'Santé et bien-être',
      sector: 'Santé & Pharmaceutique',
      subSectors: ['Distribution', 'Import', 'Logistique'],
      contactPerson: 'Dr. Aminata Traoré',
      email: 'contact@pharmaplus.ci',
      phone: '+225 27 22 49 90 12',
      address: 'Marcory, Abidjan',
      city: 'Abidjan',
      website: 'https://pharmaplus.ci',
      logo: 'assets/images/suppliers/pharma-plus.png',
      images: ['assets/images/suppliers/pharma-1.jpg'],
      services: ['Distribution pharmaceutique', 'Import', 'Logistique'],
      certifications: ['ANEM', 'ISO 13485'],
      yearsOfExperience: 12,
      isVerified: true,
      isFeatured: true,
      rating: 4.7,
      reviewsCount: 28,
      projects: [
        {
          title: 'Fourniture hôpitaux',
          description: 'Distribution de médicaments',
          year: 2023,
          client: 'Ministère de la Santé',
          value: 35000000
        }
      ],
      satisfiedClients: 95,
      successRate: 97,
      verificationStatus: 'verified',
      createdAt: new Date('2015-11-10'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      companyName: 'Green Energy Solutions',
      description: 'Expert en énergies renouvelables et solutions écologiques',
      tagline: 'Énergie verte pour l\'avenir',
      sector: 'Énergie & Environnement',
      subSectors: ['Solaire', 'Éolien', 'Efficacité énergétique'],
      contactPerson: 'Kouassi Jean',
      email: 'info@greenenergy.ci',
      phone: '+225 27 22 49 34 56',
      address: 'Bouaké, Vallée du Bandama',
      city: 'Bouaké',
      website: 'https://greenenergy.ci',
      logo: 'assets/images/suppliers/green-energy.png',
      images: ['assets/images/suppliers/green-1.jpg'],
      services: ['Installation solaire', 'Audit énergétique', 'Maintenance'],
      certifications: ['Certification énergétique', 'ISO 50001'],
      yearsOfExperience: 6,
      isVerified: true,
      isFeatured: true,
      rating: 4.5,
      reviewsCount: 18,
      projects: [
        {
          title: 'Centres de santé solaires',
          description: 'Installation panneaux solaires',
          year: 2023,
          client: 'Ministère de l\'Énergie',
          value: 20000000
        }
      ],
      satisfiedClients: 45,
      successRate: 92,
      verificationStatus: 'verified',
      createdAt: new Date('2019-05-12'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: '5',
      companyName: 'Agro Services Pro',
      description: 'Services agricoles et conseils en agroalimentaire',
      tagline: 'Excellence agricole',
      sector: 'Agriculture & Agroalimentaire',
      subSectors: ['Conseil', 'Formation', 'Équipements'],
      contactPerson: 'Mariam Ouattara',
      email: 'contact@agroservices.ci',
      phone: '+225 27 22 49 78 90',
      address: 'Yamoussoukro, Lacs',
      city: 'Yamoussoukro',
      website: 'https://agroservices.ci',
      logo: 'assets/images/suppliers/agro-services.png',
      images: ['assets/images/suppliers/agro-1.jpg'],
      services: ['Conseil agricole', 'Formation', 'Équipements'],
      certifications: ['Certification biologique', 'HACCP'],
      yearsOfExperience: 10,
      isVerified: true,
      isFeatured: true,
      rating: 4.4,
      reviewsCount: 25,
      projects: [
        {
          title: 'Formation agriculteurs',
          description: 'Programme de formation',
          year: 2023,
          client: 'Ministère de l\'Agriculture',
          value: 8000000
        }
      ],
      satisfiedClients: 75,
      successRate: 94,
      verificationStatus: 'verified',
      createdAt: new Date('2017-02-28'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: '6',
      companyName: 'Transport Express CI',
      description: 'Services de transport et logistique professionnels',
      tagline: 'Transport rapide et sûr',
      sector: 'Transport & Logistique',
      subSectors: ['Transport', 'Logistique', 'Stockage'],
      contactPerson: 'Sékou Bamba',
      email: 'info@transportexpress.ci',
      phone: '+225 27 22 49 12 34',
      address: 'Port-Bouët, Abidjan',
      city: 'Abidjan',
      website: 'https://transportexpress.ci',
      logo: 'assets/images/suppliers/transport-express.png',
      images: ['assets/images/suppliers/transport-1.jpg'],
      services: ['Transport de marchandises', 'Logistique', 'Stockage'],
      certifications: ['ISO 9001', 'Certification transport'],
      yearsOfExperience: 7,
      isVerified: true,
      isFeatured: true,
      rating: 4.3,
      reviewsCount: 22,
      projects: [
        {
          title: 'Logistique portuaire',
          description: 'Services de transport portuaire',
          year: 2023,
          client: 'Port d\'Abidjan',
          value: 15000000
        }
      ],
      satisfiedClients: 60,
      successRate: 90,
      verificationStatus: 'verified',
      createdAt: new Date('2018-09-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  // Méthodes pour les publicités
  private mockAdvertisements: Advertisement[] = [
    {
      id: '1',
      title: '🚀 Services Premium CI-Tender',
      description: 'Accédez à des fonctionnalités avancées : alertes personnalisées, analyses détaillées, et support prioritaire',
      imageUrl: 'assets/images/ads/premium-services.jpg',
      linkUrl: '/premium',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 156,
      impressionCount: 2340,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: '🏆 Fournisseurs Vérifiés',
      description: 'Découvrez notre annuaire de 1500+ fournisseurs certifiés et qualifiés pour vos projets',
      imageUrl: 'assets/images/ads/verified-suppliers.jpg',
      linkUrl: '/suppliers',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 89,
      impressionCount: 1890,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      title: '📊 Formation Appels d\'Offres',
      description: 'Formation certifiante en gestion d\'appels d\'offres - 15-17 août 2024 à Abidjan',
      imageUrl: 'assets/images/ads/formation.jpg',
      linkUrl: '/formation',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-20'),
      clickCount: 234,
      impressionCount: 3450,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01')
    },
    {
      id: '4',
      title: '💼 Cabinet Conseil BTP',
      description: 'Expertise en construction et travaux publics - Accompagnement complet de vos projets',
      imageUrl: 'assets/images/ads/cabinet-btp.jpg',
      linkUrl: '/cabinet-btp',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 67,
      impressionCount: 1230,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01')
    },
    {
      id: '5',
      title: '🔔 Alertes Email Gratuites',
      description: 'Recevez les nouveaux appels d\'offres directement dans votre boîte mail',
      imageUrl: 'assets/images/ads/email-alerts.jpg',
      linkUrl: '/alerts',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 445,
      impressionCount: 5670,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '6',
      title: '🏢 Assurance Entreprise',
      description: 'Protégez votre entreprise avec nos solutions d\'assurance adaptées aux PME',
      imageUrl: 'assets/images/ads/assurance.jpg',
      linkUrl: '/assurance',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 123,
      impressionCount: 2100,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01')
    },
    {
      id: '7',
      title: '📱 Application Mobile CI-Tender',
      description: 'Téléchargez notre app mobile pour suivre les appels d\'offres en temps réel',
      imageUrl: 'assets/images/ads/mobile-app.jpg',
      linkUrl: '/mobile-app',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 567,
      impressionCount: 7890,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: '8',
      title: '⚡ Énergie Solaire',
      description: 'Solutions d\'énergie renouvelable pour entreprises et collectivités',
      imageUrl: 'assets/images/ads/solar-energy.jpg',
      linkUrl: '/solar-energy',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 89,
      impressionCount: 1450,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01')
    },
    {
      id: '9',
      title: '🎓 Université des Affaires',
      description: 'Formation continue en management et gestion d\'entreprise - Inscriptions ouvertes',
      imageUrl: 'assets/images/ads/university.jpg',
      linkUrl: '/university',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-10-31'),
      clickCount: 178,
      impressionCount: 2340,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-08-01')
    },
    {
      id: '10',
      title: '🚛 Transport & Logistique',
      description: 'Services de transport et logistique pour vos marchandises en Côte d\'Ivoire',
      imageUrl: 'assets/images/ads/transport.jpg',
      linkUrl: '/transport',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 134,
      impressionCount: 1890,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '11',
      title: '💻 Solutions Informatiques',
      description: 'Développement sur mesure, maintenance et conseil en informatique',
      imageUrl: 'assets/images/ads/it-solutions.jpg',
      linkUrl: '/it-solutions',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      clickCount: 256,
      impressionCount: 3450,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '12',
      title: '🏥 Équipements Médicaux',
      description: 'Fourniture d\'équipements médicaux et hospitaliers de qualité',
      imageUrl: 'assets/images/ads/medical-equipment.jpg',
      linkUrl: '/medical-equipment',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-12-31'),
      clickCount: 78,
      impressionCount: 1230,
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: '13',
      title: '🎯 Solutions Marketing Digital',
      description: 'Stratégies marketing digital pour booster votre visibilité en ligne',
      imageUrl: 'assets/images/ads/digital-marketing.jpg',
      linkUrl: '/digital-marketing',
      type: AdType.BANNER,
      position: AdPosition.MIDDLE,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 189,
      impressionCount: 2780,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '14',
      title: '🏗️ Matériaux de Construction',
      description: 'Fourniture de matériaux de construction de haute qualité à prix compétitifs',
      imageUrl: 'assets/images/ads/construction-materials.jpg',
      linkUrl: '/construction-materials',
      type: AdType.BANNER,
      position: AdPosition.MIDDLE,
      isActive: true,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 145,
      impressionCount: 2100,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: '15',
      title: '🌿 Solutions Écologiques',
      description: 'Équipements et services respectueux de l\'environnement pour votre entreprise',
      imageUrl: 'assets/images/ads/eco-solutions.jpg',
      linkUrl: '/eco-solutions',
      type: AdType.BANNER,
      position: AdPosition.MIDDLE,
      isActive: true,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 167,
      impressionCount: 2450,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01')
    },
    {
      id: '16',
      title: 'Promouvez votre entreprise',
      description: 'Faites-vous connaître auprès de milliers de professionnels',
      imageUrl: 'assets/images/ads/promote-business.jpg',
      linkUrl: '/promote-business',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      clickCount: 234,
      impressionCount: 3450,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '17',
      title: 'Développez votre visibilité',
      description: 'Atteignez des milliers de professionnels qualifiés',
      imageUrl: 'assets/images/ads/visibility.jpg',
      linkUrl: '/visibility',
      type: AdType.BANNER,
      position: AdPosition.MIDDLE,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 189,
      impressionCount: 2780,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '18',
      title: 'Boostez vos affaires',
      description: 'Connectez-vous avec des professionnels de votre secteur',
      imageUrl: 'assets/images/ads/boost-business.jpg',
      linkUrl: '/boost-business',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 145,
      impressionCount: 2100,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '19',
      title: '🌱 Agriculture Moderne',
      description: 'Technologies et équipements agricoles pour améliorer votre productivité',
      imageUrl: 'assets/images/ads/agriculture.jpg',
      linkUrl: '/agriculture',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-12-31'),
      clickCount: 145,
      impressionCount: 2100,
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-05-15')
    },
    {
      id: '14',
      title: '🏗️ Matériaux de Construction',
      description: 'Fourniture de matériaux de construction de qualité pour vos projets',
      imageUrl: 'assets/images/ads/construction-materials.jpg',
      linkUrl: '/construction-materials',
      type: AdType.BANNER,
      position: AdPosition.BOTTOM,
      isActive: true,
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-12-31'),
      clickCount: 167,
      impressionCount: 2340,
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15')
    },
    {
      id: '15',
      title: '📈 Conseil en Finance',
      description: 'Accompagnement financier et comptable pour entreprises et associations',
      imageUrl: 'assets/images/ads/financial-advice.jpg',
      linkUrl: '/financial-advice',
      type: AdType.BANNER,
      position: AdPosition.TOP,
      isActive: true,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-12-31'),
      clickCount: 98,
      impressionCount: 1560,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '16',
      title: '🏗️ Matériaux Premium',
      description: 'Fourniture de matériaux de construction de haute qualité',
      imageUrl: 'assets/images/ads/premium-materials.jpg',
      linkUrl: '/premium-materials',
      type: AdType.BANNER,
      position: AdPosition.LEFT,
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 234,
      impressionCount: 3450,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '17',
      title: '🚛 Transport Express',
      description: 'Services de transport rapide et sécurisé pour vos marchandises',
      imageUrl: 'assets/images/ads/express-transport.jpg',
      linkUrl: '/express-transport',
      type: AdType.BANNER,
      position: AdPosition.RIGHT,
      isActive: true,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 189,
      impressionCount: 2780,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '18',
      title: '💼 Cabinet Juridique',
      description: 'Conseil juridique spécialisé en droit des marchés publics',
      imageUrl: 'assets/images/ads/legal-advice.jpg',
      linkUrl: '/legal-advice',
      type: AdType.BANNER,
      position: AdPosition.LEFT,
      isActive: true,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 145,
      impressionCount: 2100,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01')
    },
    {
      id: '19',
      title: '🌿 Solutions Écologiques',
      description: 'Équipements et services respectueux de l\'environnement',
      imageUrl: 'assets/images/ads/eco-solutions.jpg',
      linkUrl: '/eco-solutions',
      type: AdType.BANNER,
      position: AdPosition.RIGHT,
      isActive: true,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 167,
      impressionCount: 2450,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01')
    },
    {
      id: '20',
      title: '📊 Formation Continue',
      description: 'Formations professionnelles certifiantes en ligne',
      imageUrl: 'assets/images/ads/online-training.jpg',
      linkUrl: '/online-training',
      type: AdType.BANNER,
      position: AdPosition.LEFT,
      isActive: true,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      clickCount: 123,
      impressionCount: 1890,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01')
    }
  ];

  constructor(private http: HttpClient) {}

  // Méthodes pour les appels d'offres
  getTenders(): Observable<Tender[]> {
    return of(this.mockTenders);
  }

  getTender(id: string): Observable<Tender | null> {
    const tender = this.mockTenders.find(t => t.id === id);
    return of(tender || null);
  }

  getRecentTenders(limit: number = 6): Observable<Tender[]> {
    const recentTenders = this.mockTenders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    return of(recentTenders);
  }

  searchTenders(query: string): Observable<Tender[]> {
    const filteredTenders = this.mockTenders.filter(tender =>
      tender.title.toLowerCase().includes(query.toLowerCase()) ||
      tender.description.toLowerCase().includes(query.toLowerCase()) ||
      tender.sector.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredTenders);
  }

  // Méthodes pour les fournisseurs
  getSuppliers(): Observable<Supplier[]> {
    return of(this.mockSuppliers);
  }

  getSupplier(id: string): Observable<Supplier | null> {
    const supplier = this.mockSuppliers.find(s => s.id === id);
    return of(supplier || null);
  }

  getFeaturedSuppliers(limit: number = 6): Observable<Supplier[]> {
    const featuredSuppliers = this.mockSuppliers
      .filter(s => s.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    return of(featuredSuppliers);
  }

  searchSuppliers(query: string): Observable<Supplier[]> {
    const filteredSuppliers = this.mockSuppliers.filter(supplier =>
      supplier.companyName.toLowerCase().includes(query.toLowerCase()) ||
      supplier.description.toLowerCase().includes(query.toLowerCase()) ||
      supplier.sector.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredSuppliers);
  }

  // Méthodes pour les utilisateurs (admin uniquement)
  getUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@ci-tender.com',
        firstName: 'Admin',
        lastName: 'CI-Tender',
        fullName: 'Admin CI-Tender',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
    return of(mockUsers);
  }

  // Méthodes pour les publicités
  getAdvertisements(): Observable<Advertisement[]> {
    return of(this.mockAdvertisements);
  }

  getAdvertisementsByPosition(position: AdPosition): Observable<Advertisement[]> {
    const filteredAds = this.mockAdvertisements.filter(ad => {
      const isPositionMatch = ad.position === position;
      const isActive = ad.isActive;
      const isDateValid = new Date() >= ad.startDate && new Date() <= new Date('2025-12-31');
      
      return isPositionMatch && isActive && isDateValid;
    });
    
    return of(filteredAds);
  }

  getRandomAdvertisement(position: AdPosition): Observable<Advertisement | null> {
    return this.getAdvertisementsByPosition(position).pipe(
      map(ads => {
        if (ads.length === 0) {
          // Créer une publicité par défaut
          const defaultAd: Advertisement = {
            id: 'default-' + position,
            title: 'Promouvez votre entreprise',
            description: 'Faites-vous connaître auprès de milliers de professionnels',
            imageUrl: '',
            linkUrl: '/promote',
            type: AdType.BANNER,
            position: position,
            isActive: true,
            startDate: new Date(),
            endDate: new Date('2025-12-31'),
            clickCount: 0,
            impressionCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          return defaultAd;
        }
        const randomIndex = Math.floor(Math.random() * ads.length);
        return ads[randomIndex];
      })
    );
  }

  // Méthodes CRUD pour l'administration (simulées)
  createTender(tender: Partial<Tender>): Observable<Tender> {
    const newTender: Tender = {
      id: (this.mockTenders.length + 1).toString(),
      ...tender,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Tender;
    this.mockTenders.push(newTender);
    return of(newTender);
  }

  updateTender(id: string, updates: Partial<Tender>): Observable<Tender> {
    const index = this.mockTenders.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTenders[index] = { ...this.mockTenders[index], ...updates, updatedAt: new Date() };
      return of(this.mockTenders[index]);
    }
    throw new Error('Tender not found');
  }

  deleteTender(id: string): Observable<void> {
    const index = this.mockTenders.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTenders.splice(index, 1);
    }
    return of(void 0);
  }
} 