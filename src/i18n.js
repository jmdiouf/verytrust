import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH
// ─────────────────────────────────────────────────────────────────────────────
const fr = {
  // Navbar
  nav_home: 'Accueil',
  nav_verify: 'Vérifier',
  nav_reviewers: 'Vérificateurs',
  nav_editors: 'Émetteurs',
  nav_login: 'Connexion',
  nav_cta: 'Commencer',
  logout: 'Déconnexion',

  // Dashboard sidebar
  nav_overview: "Vue d'ensemble",
  nav_my_certs: 'Mes certificats',
  nav_new_cert: 'Nouveau certificat',
  nav_api_keys: 'Clés API',
  nav_profile: 'Mon profil',
  dash_connected_as: 'Connecté en tant que',

  // Landing — hero
  hero_eyebrow: 'Standard africain de certification',
  hero_title: 'Un document certifié,',
  hero_title_em: 'zéro question.',
  hero_sub: "VeryTrust permet aux professionnels réglementés d'émettre des documents certifiés vérifiables instantanément partout en Afrique.",
  hero_cta1: 'Émettre un certificat',
  hero_cta2: 'Vérifier un document',

  // Landing — stats
  stat1: 'pays africains',
  stat2: 'documents certifiés',
  stat3: 'langues supportées',
  stat4: 'vérification',

  // Landing — levels
  levels_eyebrow: 'Niveaux de certification',
  levels_title: 'Quatre niveaux de confiance, une seule plateforme.',
  bronze_desc: "Logiciels et outils certifiés VeryTrust. Entrée dans l'écosystème de confiance.",
  silver_desc: 'Expert-comptable certifié par VeryTrust après évaluation de son portefeuille client.',
  gold_desc: 'Commissaire aux Comptes avec quota strict par pays. Le standard le plus exigeant.',
  platinum_desc: "Cabinet international ayant passé l'audit complet VeryTrust. Reconnaissance panafricaine.",

  // Landing — sectors
  sectors_eyebrow: 'Professions couvertes',
  sectors_title: 'Un label. Toutes les professions réglementées.',
  sector_0_name: 'Experts-Comptables',
  sector_0_desc: 'États financiers, bilans, comptes de résultat',
  sector_1_name: 'Avocats',
  sector_1_desc: 'Contrats, actes juridiques, avis de droit',
  sector_2_name: 'Experts Fiscaux',
  sector_2_desc: 'Déclarations, conseils et optimisations',
  sector_3_name: 'Experts Immobiliers',
  sector_3_desc: 'Évaluations et certificats de valeur',
  sector_4_name: 'Commissaires aux Comptes',
  sector_4_desc: "Rapports d'audit et certification légale",
  sector_5_name: 'Auditeurs Internes',
  sector_5_desc: 'Rapports IIA, conformité et contrôle interne',
  sector_6_name: 'Notaires',
  sector_6_desc: 'Actes notariés et certification patrimoniale',
  sector_7_name: 'Ingénieurs-Conseils',
  sector_7_desc: 'Expertises techniques et rapports certifiés',

  // Landing — CTA band
  cta_title: 'Prêt à certifier vos documents ?',
  cta_sub: 'Rejoignez les professionnels qui font confiance à VeryTrust pour sécuriser leurs documents.',
  cta_btn: 'Créer un compte gratuit',

  // Document types
  doc_bilan: 'Bilan',
  doc_compte_resultat: 'Compte de résultat',
  doc_audit: "Rapport d'audit",
  doc_fiscal: 'Déclaration fiscale',
  doc_juridique: 'Acte juridique',
  doc_evaluation: "Rapport d'évaluation",
  doc_autre: 'Autre document',

  // Verify page
  verify_placeholder: 'Entrez un identifiant VeryTrust (ex : VT-2026-A3B7C2D1)',
  verify_btn: 'Vérifier',
  verify_loading: 'Vérification en cours...',
  verify_empty_title: 'Vérifier un document',
  verify_empty_desc: "Entrez l'identifiant VeryTrust inscrit sur le document (format VT-AAAA-XXXXXXXX) ou scannez le QR code.",
  verify_invalid_title: 'Document Invalide',
  verify_invalid_desc: "Ce certificat est invalide ou n'existe pas dans notre base de données. Vérifiez l'identifiant et réessayez.",
  verify_authentic_title: 'Document Authentique',
  verify_authentic_desc: 'Ce document a été enregistré et scellé. Toute modification le rendrait invalide.',
  verify_label_company: 'Entreprise',
  verify_label_type: 'Type de document',
  verify_label_date: 'Certifié le',
  verify_label_id: 'Identifiant',
  verify_label_by: 'Certifié par',
  verify_certified_platform: 'Plateforme certifiée VeryTrust',
  verify_fiscal_year: '· Exercice {{year}}',
  verify_share_title: 'Partager ce certificat',
  verify_share_desc: "Scannez pour vérifier ou partagez l'URL directe.",
  verify_copy_url: "⎘ Copier l'URL",
  verify_copied: '✓ Copié !',
  verify_download: "↓ Télécharger l'attestation de vérification",
  verify_disclaimer: "VeryTrust certifie l'authenticité du processus, non l'exactitude du contenu. La responsabilité des chiffres incombe au professionnel signataire.",

  // Plan level labels
  plan_bronze_label: 'Associate',
  plan_silver_label: 'Certified',
  plan_gold_label: 'Fellow · CAC',
  plan_platinum_label: 'Grand Cabinet',
  plan_bronze_desc: 'Logiciel ou outil certifié VeryTrust',
  plan_silver_desc: 'Expert-comptable certifié VeryTrust',
  plan_gold_desc: 'Commissaire aux Comptes certifié VeryTrust',
  plan_platinum_desc: 'Cabinet international certifié VeryTrust',

  // Dashboard — overview
  dash_title: 'Tableau de bord',
  dash_welcome: 'Bienvenue, {{name}}',
  dash_cert_level: 'Votre niveau de certification',
  dash_domain: 'Domaine :',
  dash_certs_issued: 'Certificats émis',
  dash_verifications: 'Vérifications',
  dash_active_level: 'Niveau actif',
  dash_recent_certs: 'Certificats récents',
  dash_no_certs: "Aucun certificat émis pour l'instant",

  // Dashboard — certificates tab
  dash_my_certs: 'Mes certificats',
  dash_no_certs_yet: 'Aucun certificat émis',

  // Dashboard — new cert tab
  dash_issue_cert: 'Émettre un certificat',
  dash_cert_success: 'Certificat émis !',
  dash_seal_for_pdf: 'Sceau à intégrer dans votre PDF',
  dash_download_seal: '↓ Télécharger le sceau SVG',
  dash_copy_svg: '⎘ Copier le SVG',
  dash_svg_copied: '✓ SVG copié !',
  dash_qr_code: 'QR code de vérification',
  dash_download_qr: '↓ Télécharger PNG',
  dash_copy_url: "⎘ Copier l'URL",
  dash_url_copied: '✓ Copié !',
  dash_see_certs: 'Voir mes certificats',
  dash_new_cert_btn: 'Nouveau certificat',
  dash_company_label: "Nom de l'entreprise",
  dash_ref_label: 'Référence (NINEA, RC...)',
  dash_year_label: 'Exercice fiscal',
  dash_type_label: 'Type de document',
  dash_referentiel_label: 'Référentiel comptable',
  dash_submit_cert: 'Émettre le certificat',
  dash_cert_company: 'Entreprise :',
  dash_cert_type: 'Type :',
  dash_cert_date: 'Certifié le :',
  dash_cert_url: 'URL vérification :',

  // Dashboard — API tab
  dash_api_title: 'Intégration API',
  dash_api_key_label: 'Votre clé API',
  dash_api_copy: 'Copier',
  dash_api_copied: '✓ Copié',
  dash_api_warning: "Ne partagez jamais cette clé publiquement. Elle donne accès à l'émission de certificats en votre nom.",
  dash_api_example: "Exemple d'intégration",

  // Dashboard — profile tab
  dash_profile_title: 'Mon profil',
  dash_row_email: 'Email',
  dash_row_org: 'Organisation',
  dash_row_domain: 'Domaine',
  dash_row_level: 'Niveau',
  dash_row_since: 'Membre depuis',
  dash_2fa_title: 'Authentification à double facteur',
  dash_2fa_active_desc: '✓ Active — votre compte est protégé',
  dash_2fa_inactive: 'Non activée',
  dash_2fa_badge: 'ACTIVE',
  dash_2fa_enable: 'Activer la 2FA',
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────
const en = {
  nav_home: 'Home', nav_verify: 'Verify', nav_reviewers: 'Reviewers',
  nav_editors: 'Issuers', nav_login: 'Login', nav_cta: 'Get started', logout: 'Log out',
  nav_overview: 'Overview', nav_my_certs: 'My certificates', nav_new_cert: 'New certificate',
  nav_api_keys: 'API Keys', nav_profile: 'My profile', dash_connected_as: 'Signed in as',

  hero_eyebrow: 'African certification standard',
  hero_title: 'A certified document,',
  hero_title_em: 'zero questions.',
  hero_sub: 'VeryTrust enables regulated professionals to issue instantly verifiable certified documents across Africa.',
  hero_cta1: 'Issue a certificate', hero_cta2: 'Verify a document',

  stat1: 'African countries', stat2: 'certified documents', stat3: 'supported languages', stat4: 'verification',

  levels_eyebrow: 'Certification levels',
  levels_title: 'Four trust levels, one platform.',
  bronze_desc: 'VeryTrust-certified software and tools. Entry into the trust ecosystem.',
  silver_desc: 'Accountant certified by VeryTrust after client portfolio evaluation.',
  gold_desc: 'Statutory Auditor with strict per-country quota. The most demanding standard.',
  platinum_desc: 'International firm that passed the full VeryTrust audit. Pan-African recognition.',

  sectors_eyebrow: 'Covered professions',
  sectors_title: 'One label. All regulated professions.',
  sector_0_name: 'Accountants', sector_0_desc: 'Financial statements, balance sheets, income statements',
  sector_1_name: 'Lawyers', sector_1_desc: 'Contracts, legal acts, legal opinions',
  sector_2_name: 'Tax Experts', sector_2_desc: 'Tax returns, consulting and optimizations',
  sector_3_name: 'Real Estate Experts', sector_3_desc: 'Valuations and value certificates',
  sector_4_name: 'Statutory Auditors', sector_4_desc: 'Audit reports and legal certification',
  sector_5_name: 'Internal Auditors', sector_5_desc: 'IIA reports, compliance and internal control',
  sector_6_name: 'Notaries', sector_6_desc: 'Notarial acts and estate certification',
  sector_7_name: 'Consulting Engineers', sector_7_desc: 'Technical appraisals and certified reports',

  cta_title: 'Ready to certify your documents?',
  cta_sub: 'Join the professionals who trust VeryTrust to secure their documents.',
  cta_btn: 'Create a free account',

  doc_bilan: 'Balance Sheet', doc_compte_resultat: 'Income Statement',
  doc_audit: 'Audit Report', doc_fiscal: 'Tax Return',
  doc_juridique: 'Legal Act', doc_evaluation: 'Valuation Report', doc_autre: 'Other document',

  verify_placeholder: 'Enter a VeryTrust identifier (e.g. VT-2026-A3B7C2D1)',
  verify_btn: 'Verify', verify_loading: 'Verifying...',
  verify_empty_title: 'Verify a document',
  verify_empty_desc: 'Enter the VeryTrust identifier printed on the document (format VT-YYYY-XXXXXXXX) or scan the QR code.',
  verify_invalid_title: 'Invalid Document',
  verify_invalid_desc: 'This certificate is invalid or does not exist in our database. Check the identifier and try again.',
  verify_authentic_title: 'Authentic Document',
  verify_authentic_desc: 'This document has been registered and sealed. Any modification would make it invalid.',
  verify_label_company: 'Company', verify_label_type: 'Document type',
  verify_label_date: 'Certified on', verify_label_id: 'Identifier', verify_label_by: 'Certified by',
  verify_certified_platform: 'VeryTrust-certified platform',
  verify_fiscal_year: '· Fiscal year {{year}}',
  verify_share_title: 'Share this certificate',
  verify_share_desc: 'Scan to verify or share the direct URL.',
  verify_copy_url: '⎘ Copy URL', verify_copied: '✓ Copied!',
  verify_download: '↓ Download verification attestation',
  verify_disclaimer: 'VeryTrust certifies the authenticity of the process, not the accuracy of the content. The accuracy of figures is the responsibility of the signing professional.',

  plan_bronze_label: 'Associate', plan_silver_label: 'Certified',
  plan_gold_label: 'Fellow · CPA', plan_platinum_label: 'Grand Firm',
  plan_bronze_desc: 'VeryTrust-certified software or tool',
  plan_silver_desc: 'VeryTrust-certified accountant',
  plan_gold_desc: 'VeryTrust-certified statutory auditor',
  plan_platinum_desc: 'VeryTrust-certified international firm',

  dash_title: 'Dashboard', dash_welcome: 'Welcome, {{name}}',
  dash_cert_level: 'Your certification level', dash_domain: 'Domain:',
  dash_certs_issued: 'Certificates issued', dash_verifications: 'Verifications',
  dash_active_level: 'Active level', dash_recent_certs: 'Recent certificates',
  dash_no_certs: 'No certificates issued yet',
  dash_my_certs: 'My certificates', dash_no_certs_yet: 'No certificates issued',
  dash_issue_cert: 'Issue a certificate', dash_cert_success: 'Certificate issued!',
  dash_seal_for_pdf: 'Seal to embed in your PDF',
  dash_download_seal: '↓ Download SVG seal', dash_copy_svg: '⎘ Copy SVG',
  dash_svg_copied: '✓ SVG copied!', dash_qr_code: 'Verification QR code',
  dash_download_qr: '↓ Download PNG', dash_copy_url: '⎘ Copy URL', dash_url_copied: '✓ Copied!',
  dash_see_certs: 'View my certificates', dash_new_cert_btn: 'New certificate',
  dash_company_label: 'Company name', dash_ref_label: 'Reference (Tax ID, Reg...)',
  dash_year_label: 'Fiscal year', dash_type_label: 'Document type',
  dash_referentiel_label: 'Accounting standard', dash_submit_cert: 'Issue certificate',
  dash_cert_company: 'Company:', dash_cert_type: 'Type:',
  dash_cert_date: 'Certified on:', dash_cert_url: 'Verification URL:',
  dash_api_title: 'API Integration', dash_api_key_label: 'Your API key',
  dash_api_copy: 'Copy', dash_api_copied: '✓ Copied',
  dash_api_warning: 'Never share this key publicly. It grants access to certificate issuance on your behalf.',
  dash_api_example: 'Integration example',
  dash_profile_title: 'My profile',
  dash_row_email: 'Email', dash_row_org: 'Organisation', dash_row_domain: 'Domain',
  dash_row_level: 'Level', dash_row_since: 'Member since',
  dash_2fa_title: 'Two-factor authentication',
  dash_2fa_active_desc: '✓ Active — your account is protected',
  dash_2fa_inactive: 'Not enabled', dash_2fa_badge: 'ACTIVE', dash_2fa_enable: 'Enable 2FA',
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTUGUESE
// ─────────────────────────────────────────────────────────────────────────────
const pt = {
  nav_home: 'Início', nav_verify: 'Verificar', nav_reviewers: 'Verificadores',
  nav_editors: 'Emissores', nav_login: 'Entrar', nav_cta: 'Começar', logout: 'Sair',
  nav_overview: 'Visão geral', nav_my_certs: 'Meus certificados', nav_new_cert: 'Novo certificado',
  nav_api_keys: 'Chaves API', nav_profile: 'Meu perfil', dash_connected_as: 'Conectado como',

  hero_eyebrow: 'Padrão africano de certificação',
  hero_title: 'Um documento certificado,',
  hero_title_em: 'zero questões.',
  hero_sub: 'VeryTrust permite que profissionais regulamentados emitam documentos certificados verificáveis instantaneamente em toda África.',
  hero_cta1: 'Emitir certificado', hero_cta2: 'Verificar documento',

  stat1: 'países africanos', stat2: 'documentos certificados', stat3: 'idiomas suportados', stat4: 'verificação',

  levels_eyebrow: 'Níveis de certificação',
  levels_title: 'Quatro níveis de confiança, uma plataforma.',
  bronze_desc: 'Software e ferramentas certificados pela VeryTrust. Entrada no ecossistema de confiança.',
  silver_desc: 'Contador certificado pela VeryTrust após avaliação da carteira de clientes.',
  gold_desc: 'Auditor com quota estrita por país. O padrão mais exigente.',
  platinum_desc: 'Escritório internacional que passou pela auditoria completa VeryTrust. Reconhecimento pan-africano.',

  sectors_eyebrow: 'Profissões cobertas',
  sectors_title: 'Um selo. Todas as profissões regulamentadas.',
  sector_0_name: 'Contabilistas', sector_0_desc: 'Demonstrações financeiras, balanços, resultados',
  sector_1_name: 'Advogados', sector_1_desc: 'Contratos, atos jurídicos, pareceres de direito',
  sector_2_name: 'Especialistas Fiscais', sector_2_desc: 'Declarações, consultoria e otimizações',
  sector_3_name: 'Especialistas Imobiliários', sector_3_desc: 'Avaliações e certificados de valor',
  sector_4_name: 'Revisores Oficiais de Contas', sector_4_desc: 'Relatórios de auditoria e certificação legal',
  sector_5_name: 'Auditores Internos', sector_5_desc: 'Relatórios IIA, conformidade e controlo interno',
  sector_6_name: 'Notários', sector_6_desc: 'Atos notariais e certificação patrimonial',
  sector_7_name: 'Engenheiros Consultores', sector_7_desc: 'Perícias técnicas e relatórios certificados',

  cta_title: 'Pronto para certificar seus documentos?',
  cta_sub: 'Junte-se aos profissionais que confiam na VeryTrust para proteger seus documentos.',
  cta_btn: 'Criar conta gratuita',

  doc_bilan: 'Balanço', doc_compte_resultat: 'Demonstração de resultados',
  doc_audit: 'Relatório de auditoria', doc_fiscal: 'Declaração fiscal',
  doc_juridique: 'Ato jurídico', doc_evaluation: 'Relatório de avaliação', doc_autre: 'Outro documento',

  verify_placeholder: 'Digite um identificador VeryTrust (ex: VT-2026-A3B7C2D1)',
  verify_btn: 'Verificar', verify_loading: 'Verificando...',
  verify_empty_title: 'Verificar um documento',
  verify_empty_desc: 'Digite o identificador VeryTrust impresso no documento (formato VT-AAAA-XXXXXXXX) ou escaneie o QR code.',
  verify_invalid_title: 'Documento Inválido',
  verify_invalid_desc: 'Este certificado é inválido ou não existe na nossa base de dados. Verifique o identificador e tente novamente.',
  verify_authentic_title: 'Documento Autêntico',
  verify_authentic_desc: 'Este documento foi registrado e selado. Qualquer modificação o tornaria inválido.',
  verify_label_company: 'Empresa', verify_label_type: 'Tipo de documento',
  verify_label_date: 'Certificado em', verify_label_id: 'Identificador', verify_label_by: 'Certificado por',
  verify_certified_platform: 'Plataforma certificada VeryTrust',
  verify_fiscal_year: '· Exercício {{year}}',
  verify_share_title: 'Compartilhar este certificado',
  verify_share_desc: 'Escaneie para verificar ou compartilhe o URL direto.',
  verify_copy_url: '⎘ Copiar URL', verify_copied: '✓ Copiado!',
  verify_download: '↓ Baixar atestado de verificação',
  verify_disclaimer: 'VeryTrust certifica a autenticidade do processo, não a precisão do conteúdo. A responsabilidade dos números é do profissional signatário.',

  plan_bronze_label: 'Associate', plan_silver_label: 'Certified',
  plan_gold_label: 'Fellow · CPA', plan_platinum_label: 'Grande Escritório',
  plan_bronze_desc: 'Software ou ferramenta certificada VeryTrust',
  plan_silver_desc: 'Contador certificado VeryTrust',
  plan_gold_desc: 'Auditor legal certificado VeryTrust',
  plan_platinum_desc: 'Escritório internacional certificado VeryTrust',

  dash_title: 'Painel de controlo', dash_welcome: 'Bem-vindo, {{name}}',
  dash_cert_level: 'Seu nível de certificação', dash_domain: 'Domínio:',
  dash_certs_issued: 'Certificados emitidos', dash_verifications: 'Verificações',
  dash_active_level: 'Nível ativo', dash_recent_certs: 'Certificados recentes',
  dash_no_certs: 'Nenhum certificado emitido ainda',
  dash_my_certs: 'Meus certificados', dash_no_certs_yet: 'Nenhum certificado emitido',
  dash_issue_cert: 'Emitir um certificado', dash_cert_success: 'Certificado emitido!',
  dash_seal_for_pdf: 'Selo para integrar no seu PDF',
  dash_download_seal: '↓ Baixar selo SVG', dash_copy_svg: '⎘ Copiar SVG',
  dash_svg_copied: '✓ SVG copiado!', dash_qr_code: 'QR code de verificação',
  dash_download_qr: '↓ Baixar PNG', dash_copy_url: '⎘ Copiar URL', dash_url_copied: '✓ Copiado!',
  dash_see_certs: 'Ver meus certificados', dash_new_cert_btn: 'Novo certificado',
  dash_company_label: 'Nome da empresa', dash_ref_label: 'Referência (NIF, RC...)',
  dash_year_label: 'Exercício fiscal', dash_type_label: 'Tipo de documento',
  dash_referentiel_label: 'Norma contabilística', dash_submit_cert: 'Emitir certificado',
  dash_cert_company: 'Empresa:', dash_cert_type: 'Tipo:',
  dash_cert_date: 'Certificado em:', dash_cert_url: 'URL de verificação:',
  dash_api_title: 'Integração API', dash_api_key_label: 'Sua chave API',
  dash_api_copy: 'Copiar', dash_api_copied: '✓ Copiado',
  dash_api_warning: 'Nunca partilhe esta chave publicamente. Ela dá acesso à emissão de certificados em seu nome.',
  dash_api_example: 'Exemplo de integração',
  dash_profile_title: 'Meu perfil',
  dash_row_email: 'Email', dash_row_org: 'Organização', dash_row_domain: 'Domínio',
  dash_row_level: 'Nível', dash_row_since: 'Membro desde',
  dash_2fa_title: 'Autenticação de dois fatores',
  dash_2fa_active_desc: '✓ Ativa — sua conta está protegida',
  dash_2fa_inactive: 'Não ativada', dash_2fa_badge: 'ATIVA', dash_2fa_enable: 'Ativar 2FA',
}

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH
// ─────────────────────────────────────────────────────────────────────────────
const es = {
  nav_home: 'Inicio', nav_verify: 'Verificar', nav_reviewers: 'Verificadores',
  nav_editors: 'Emisores', nav_login: 'Iniciar sesión', nav_cta: 'Empezar', logout: 'Cerrar sesión',
  nav_overview: 'Resumen', nav_my_certs: 'Mis certificados', nav_new_cert: 'Nuevo certificado',
  nav_api_keys: 'Claves API', nav_profile: 'Mi perfil', dash_connected_as: 'Conectado como',

  hero_eyebrow: 'Estándar africano de certificación',
  hero_title: 'Un documento certificado,',
  hero_title_em: 'cero preguntas.',
  hero_sub: 'VeryTrust permite a los profesionales regulados emitir documentos certificados verificables al instante en toda África.',
  hero_cta1: 'Emitir certificado', hero_cta2: 'Verificar documento',

  stat1: 'países africanos', stat2: 'documentos certificados', stat3: 'idiomas soportados', stat4: 'verificación',

  levels_eyebrow: 'Niveles de certificación',
  levels_title: 'Cuatro niveles de confianza, una plataforma.',
  bronze_desc: 'Software y herramientas certificados por VeryTrust. Entrada al ecosistema de confianza.',
  silver_desc: 'Contador certificado por VeryTrust tras evaluación de su cartera de clientes.',
  gold_desc: 'Auditor con cuota estricta por país. El estándar más exigente.',
  platinum_desc: 'Despacho internacional que pasó la auditoría completa VeryTrust. Reconocimiento panafricano.',

  sectors_eyebrow: 'Profesiones cubiertas',
  sectors_title: 'Un sello. Todas las profesiones reguladas.',
  sector_0_name: 'Contadores', sector_0_desc: 'Estados financieros, balances, resultados',
  sector_1_name: 'Abogados', sector_1_desc: 'Contratos, actos jurídicos, dictámenes de derecho',
  sector_2_name: 'Expertos Fiscales', sector_2_desc: 'Declaraciones, asesoramiento y optimizaciones',
  sector_3_name: 'Expertos Inmobiliarios', sector_3_desc: 'Valoraciones y certificados de valor',
  sector_4_name: 'Auditores', sector_4_desc: 'Informes de auditoría y certificación legal',
  sector_5_name: 'Auditores Internos', sector_5_desc: 'Informes IIA, conformidad y control interno',
  sector_6_name: 'Notarios', sector_6_desc: 'Actos notariales y certificación patrimonial',
  sector_7_name: 'Ingenieros Consultores', sector_7_desc: 'Peritajes técnicos e informes certificados',

  cta_title: '¿Listo para certificar sus documentos?',
  cta_sub: 'Únase a los profesionales que confían en VeryTrust para proteger sus documentos.',
  cta_btn: 'Crear cuenta gratuita',

  doc_bilan: 'Balance', doc_compte_resultat: 'Cuenta de resultados',
  doc_audit: 'Informe de auditoría', doc_fiscal: 'Declaración fiscal',
  doc_juridique: 'Acto jurídico', doc_evaluation: 'Informe de valoración', doc_autre: 'Otro documento',

  verify_placeholder: 'Introduzca un identificador VeryTrust (p.ej. VT-2026-A3B7C2D1)',
  verify_btn: 'Verificar', verify_loading: 'Verificando...',
  verify_empty_title: 'Verificar un documento',
  verify_empty_desc: 'Introduzca el identificador VeryTrust impreso en el documento (formato VT-AAAA-XXXXXXXX) o escanee el código QR.',
  verify_invalid_title: 'Documento Inválido',
  verify_invalid_desc: 'Este certificado es inválido o no existe en nuestra base de datos. Compruebe el identificador e inténtelo de nuevo.',
  verify_authentic_title: 'Documento Auténtico',
  verify_authentic_desc: 'Este documento ha sido registrado y sellado. Cualquier modificación lo invalidaría.',
  verify_label_company: 'Empresa', verify_label_type: 'Tipo de documento',
  verify_label_date: 'Certificado el', verify_label_id: 'Identificador', verify_label_by: 'Certificado por',
  verify_certified_platform: 'Plataforma certificada VeryTrust',
  verify_fiscal_year: '· Ejercicio {{year}}',
  verify_share_title: 'Compartir este certificado',
  verify_share_desc: 'Escanee para verificar o comparta la URL directa.',
  verify_copy_url: '⎘ Copiar URL', verify_copied: '✓ ¡Copiado!',
  verify_download: '↓ Descargar atestado de verificación',
  verify_disclaimer: 'VeryTrust certifica la autenticidad del proceso, no la exactitud del contenido. La responsabilidad de las cifras recae en el profesional firmante.',

  plan_bronze_label: 'Associate', plan_silver_label: 'Certified',
  plan_gold_label: 'Fellow · CPA', plan_platinum_label: 'Gran Despacho',
  plan_bronze_desc: 'Software o herramienta certificada VeryTrust',
  plan_silver_desc: 'Contador certificado VeryTrust',
  plan_gold_desc: 'Auditor legal certificado VeryTrust',
  plan_platinum_desc: 'Despacho internacional certificado VeryTrust',

  dash_title: 'Panel de control', dash_welcome: 'Bienvenido, {{name}}',
  dash_cert_level: 'Su nivel de certificación', dash_domain: 'Dominio:',
  dash_certs_issued: 'Certificados emitidos', dash_verifications: 'Verificaciones',
  dash_active_level: 'Nivel activo', dash_recent_certs: 'Certificados recientes',
  dash_no_certs: 'Ningún certificado emitido aún',
  dash_my_certs: 'Mis certificados', dash_no_certs_yet: 'Ningún certificado emitido',
  dash_issue_cert: 'Emitir un certificado', dash_cert_success: '¡Certificado emitido!',
  dash_seal_for_pdf: 'Sello para integrar en su PDF',
  dash_download_seal: '↓ Descargar sello SVG', dash_copy_svg: '⎘ Copiar SVG',
  dash_svg_copied: '✓ ¡SVG copiado!', dash_qr_code: 'Código QR de verificación',
  dash_download_qr: '↓ Descargar PNG', dash_copy_url: '⎘ Copiar URL', dash_url_copied: '✓ ¡Copiado!',
  dash_see_certs: 'Ver mis certificados', dash_new_cert_btn: 'Nuevo certificado',
  dash_company_label: 'Nombre de la empresa', dash_ref_label: 'Referencia (NIF, RC...)',
  dash_year_label: 'Ejercicio fiscal', dash_type_label: 'Tipo de documento',
  dash_referentiel_label: 'Norma contable', dash_submit_cert: 'Emitir certificado',
  dash_cert_company: 'Empresa:', dash_cert_type: 'Tipo:',
  dash_cert_date: 'Certificado el:', dash_cert_url: 'URL de verificación:',
  dash_api_title: 'Integración API', dash_api_key_label: 'Su clave API',
  dash_api_copy: 'Copiar', dash_api_copied: '✓ Copiado',
  dash_api_warning: 'Nunca comparta esta clave públicamente. Da acceso a la emisión de certificados en su nombre.',
  dash_api_example: 'Ejemplo de integración',
  dash_profile_title: 'Mi perfil',
  dash_row_email: 'Email', dash_row_org: 'Organización', dash_row_domain: 'Dominio',
  dash_row_level: 'Nivel', dash_row_since: 'Miembro desde',
  dash_2fa_title: 'Autenticación de dos factores',
  dash_2fa_active_desc: '✓ Activa — su cuenta está protegida',
  dash_2fa_inactive: 'No activada', dash_2fa_badge: 'ACTIVA', dash_2fa_enable: 'Activar 2FA',
}

// ─────────────────────────────────────────────────────────────────────────────
// ARABIC (RTL)
// ─────────────────────────────────────────────────────────────────────────────
const ar = {
  nav_home: 'الرئيسية', nav_verify: 'التحقق', nav_reviewers: 'المراجعون',
  nav_editors: 'المُصدرون', nav_login: 'تسجيل الدخول', nav_cta: 'ابدأ الآن', logout: 'تسجيل الخروج',
  nav_overview: 'نظرة عامة', nav_my_certs: 'شهاداتي', nav_new_cert: 'شهادة جديدة',
  nav_api_keys: 'مفاتيح API', nav_profile: 'ملفي', dash_connected_as: 'مسجّل دخولاً بوصفك',

  hero_eyebrow: 'معيار التوثيق الأفريقي',
  hero_title: 'وثيقة موثقة،',
  hero_title_em: 'بلا تساؤلات.',
  hero_sub: 'تتيح VeryTrust للمهنيين المرخصين إصدار وثائق موثقة قابلة للتحقق فوراً في جميع أنحاء أفريقيا.',
  hero_cta1: 'إصدار شهادة', hero_cta2: 'التحقق من وثيقة',

  stat1: 'دولة أفريقية', stat2: 'وثيقة موثقة', stat3: 'لغات مدعومة', stat4: 'تحقق',

  levels_eyebrow: 'مستويات الاعتماد',
  levels_title: 'أربعة مستويات من الثقة، منصة واحدة.',
  bronze_desc: 'برامج وأدوات معتمدة من VeryTrust. مدخل إلى منظومة الثقة.',
  silver_desc: 'محاسب معتمد من VeryTrust بعد تقييم محفظة عملائه.',
  gold_desc: 'مدقق حسابات قانوني بحصة صارمة لكل دولة. أعلى معيار في الصناعة.',
  platinum_desc: 'مكتب دولي اجتاز تدقيق VeryTrust الكامل. اعتراف أفريقي شامل.',

  sectors_eyebrow: 'المهن المشمولة',
  sectors_title: 'علامة واحدة. جميع المهن المنظمة.',
  sector_0_name: 'المحاسبون القانونيون', sector_0_desc: 'القوائم المالية، الميزانيات، حسابات النتائج',
  sector_1_name: 'المحامون', sector_1_desc: 'العقود، الأعمال القانونية، الآراء القانونية',
  sector_2_name: 'خبراء الضرائب', sector_2_desc: 'التصريحات الضريبية والاستشارات والتحسينات',
  sector_3_name: 'خبراء العقارات', sector_3_desc: 'التقييمات وشهادات القيمة',
  sector_4_name: 'مدققو الحسابات القانونيون', sector_4_desc: 'تقارير التدقيق والتوثيق القانوني',
  sector_5_name: 'المدققون الداخليون', sector_5_desc: 'تقارير IIA، الامتثال والرقابة الداخلية',
  sector_6_name: 'كتّاب العدل', sector_6_desc: 'السندات الرسمية وتوثيق الممتلكات',
  sector_7_name: 'المهندسون الاستشاريون', sector_7_desc: 'الخبرات الفنية والتقارير الموثقة',

  cta_title: 'هل أنت مستعد لتوثيق مستنداتك؟',
  cta_sub: 'انضم إلى المهنيين الذين يثقون في VeryTrust لحماية وثائقهم.',
  cta_btn: 'إنشاء حساب مجاني',

  doc_bilan: 'الميزانية العمومية', doc_compte_resultat: 'حساب النتائج',
  doc_audit: 'تقرير التدقيق', doc_fiscal: 'التصريح الضريبي',
  doc_juridique: 'سند قانوني', doc_evaluation: 'تقرير التقييم', doc_autre: 'وثيقة أخرى',

  verify_placeholder: 'أدخل معرّف VeryTrust (مثال: VT-2026-A3B7C2D1)',
  verify_btn: 'تحقق', verify_loading: 'جارٍ التحقق...',
  verify_empty_title: 'التحقق من وثيقة',
  verify_empty_desc: 'أدخل معرّف VeryTrust المذكور في الوثيقة (صيغة VT-AAAA-XXXXXXXX) أو امسح رمز QR.',
  verify_invalid_title: 'وثيقة غير صالحة',
  verify_invalid_desc: 'هذه الشهادة غير صالحة أو غير موجودة في قاعدة بياناتنا. تحقق من المعرّف وحاول مجدداً.',
  verify_authentic_title: 'وثيقة أصيلة',
  verify_authentic_desc: 'تم تسجيل هذه الوثيقة وختمها. أي تعديل سيجعلها غير صالحة.',
  verify_label_company: 'المؤسسة', verify_label_type: 'نوع الوثيقة',
  verify_label_date: 'تاريخ التوثيق', verify_label_id: 'المعرّف', verify_label_by: 'موثّق بواسطة',
  verify_certified_platform: 'منصة معتمدة من VeryTrust',
  verify_fiscal_year: '· السنة المالية {{year}}',
  verify_share_title: 'مشاركة هذه الشهادة',
  verify_share_desc: 'امسح للتحقق أو شارك الرابط المباشر.',
  verify_copy_url: '⎘ نسخ الرابط', verify_copied: '✓ تم النسخ!',
  verify_download: '↓ تحميل شهادة التحقق',
  verify_disclaimer: 'تُثبت VeryTrust أصالة العملية، وليس دقة المحتوى. تقع مسؤولية الأرقام على الموقّع المهني.',

  plan_bronze_label: 'مساعد', plan_silver_label: 'معتمد',
  plan_gold_label: 'زميل · مدقق', plan_platinum_label: 'مكتب كبير',
  plan_bronze_desc: 'برنامج أو أداة معتمدة من VeryTrust',
  plan_silver_desc: 'محاسب معتمد من VeryTrust',
  plan_gold_desc: 'مدقق حسابات قانوني معتمد من VeryTrust',
  plan_platinum_desc: 'مكتب دولي معتمد من VeryTrust',

  dash_title: 'لوحة التحكم', dash_welcome: 'أهلاً، {{name}}',
  dash_cert_level: 'مستوى اعتمادك', dash_domain: 'النطاق:',
  dash_certs_issued: 'شهادات صادرة', dash_verifications: 'عمليات تحقق',
  dash_active_level: 'المستوى النشط', dash_recent_certs: 'أحدث الشهادات',
  dash_no_certs: 'لم يتم إصدار أي شهادة بعد',
  dash_my_certs: 'شهاداتي', dash_no_certs_yet: 'لا توجد شهادات بعد',
  dash_issue_cert: 'إصدار شهادة', dash_cert_success: 'تم إصدار الشهادة!',
  dash_seal_for_pdf: 'ختم للتضمين في ملف PDF',
  dash_download_seal: '↓ تحميل الختم SVG', dash_copy_svg: '⎘ نسخ SVG',
  dash_svg_copied: '✓ تم نسخ SVG!', dash_qr_code: 'رمز QR للتحقق',
  dash_download_qr: '↓ تحميل PNG', dash_copy_url: '⎘ نسخ الرابط', dash_url_copied: '✓ تم النسخ!',
  dash_see_certs: 'عرض شهاداتي', dash_new_cert_btn: 'شهادة جديدة',
  dash_company_label: 'اسم الشركة', dash_ref_label: 'المرجع (رقم ضريبي، سجل...)',
  dash_year_label: 'السنة المالية', dash_type_label: 'نوع الوثيقة',
  dash_referentiel_label: 'المعيار المحاسبي', dash_submit_cert: 'إصدار الشهادة',
  dash_cert_company: 'الشركة:', dash_cert_type: 'النوع:',
  dash_cert_date: 'بتاريخ:', dash_cert_url: 'رابط التحقق:',
  dash_api_title: 'تكامل API', dash_api_key_label: 'مفتاح API الخاص بك',
  dash_api_copy: 'نسخ', dash_api_copied: '✓ تم النسخ',
  dash_api_warning: 'لا تشارك هذا المفتاح علناً قط. إنه يمنح صلاحية إصدار الشهادات باسمك.',
  dash_api_example: 'مثال على التكامل',
  dash_profile_title: 'ملفي الشخصي',
  dash_row_email: 'البريد الإلكتروني', dash_row_org: 'المؤسسة', dash_row_domain: 'النطاق',
  dash_row_level: 'المستوى', dash_row_since: 'عضو منذ',
  dash_2fa_title: 'المصادقة الثنائية',
  dash_2fa_active_desc: '✓ مفعّلة — حسابك محمي',
  dash_2fa_inactive: 'غير مفعّلة', dash_2fa_badge: 'مفعّلة', dash_2fa_enable: 'تفعيل المصادقة الثنائية',
}

// ─────────────────────────────────────────────────────────────────────────────
const resources = {
  fr: { translation: fr },
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
  ar: { translation: ar },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

// Apply RTL on init and on every language change
function applyDir(lang) {
  const code = lang?.split('-')[0]
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = code || 'fr'
}

i18n.on('initialized', () => applyDir(i18n.language))
i18n.on('languageChanged', applyDir)

export default i18n
