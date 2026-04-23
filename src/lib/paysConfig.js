// Configuration des pays, ordres professionnels et référentiels comptables

export const REFERENTIELS = {
  'SYSCOHADA Révisé 2017': { labelFull: 'Système Comptable OHADA Révisé (2017)' },
  'SYSCOHADA':             { labelFull: 'Système Comptable OHADA (2000)' },
  'PCB':                   { labelFull: 'Plan Comptable Bancaire UEMOA/COBAC' },
  'RCSFD':                 { labelFull: 'Référentiel Comptable des Systèmes Financiers Décentralisés' },
  'IFRS':                  { labelFull: 'International Financial Reporting Standards (IASB)' },
  'SYSCAM':                { labelFull: 'Système Comptable Camerounais (OHADA+)' },
  'SYCEBNL':               { labelFull: 'Système Comptable des Établissements à But Non Lucratif (OHADA)' },
  'PCN':                   { labelFull: 'Plan Comptable Normalisé Marocain (CGNC)' },
  'PCG_DZ':                { labelFull: 'Plan Comptable Général Algérien (2010)' },
  'PCE_TN':                { labelFull: 'Plan Comptable des Entreprises Tunisien (1997)' },
  'PCGE_MG':               { labelFull: 'Plan Comptable Général des Entreprises Malgaches' },
  'EAS':                   { labelFull: 'Egyptian Accounting Standards (EAS)' },
  'Autre':                 { labelFull: 'Autre référentiel comptable' },
}

const REF_OHADA = ['SYSCOHADA Révisé 2017', 'SYSCOHADA', 'PCB', 'RCSFD', 'IFRS', 'SYCEBNL']

export const PAYS = {
  SN: {
    nom: 'Sénégal',
    ordres: [
      { code: 'ONECCA-SN', nom: 'ONECCA-SN — Ordre National des Experts Comptables et Comptables Agréés du Sénégal' },
      { code: 'BARREAU-SN', nom: 'Barreau du Sénégal' },
      { code: 'CN-SN',     nom: 'Chambre des Notaires du Sénégal' },
      { code: 'CEI-SN',    nom: "Chambre des Experts Immobiliers du Sénégal" },
      { code: 'AUTRE-SN',  nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  CI: {
    nom: "Côte d'Ivoire",
    ordres: [
      { code: 'ONECCA-CI', nom: "ONECCA-CI — Ordre National des Experts Comptables et Comptables Agréés de Côte d'Ivoire" },
      { code: 'BARREAU-CI', nom: "Barreau de Côte d'Ivoire" },
      { code: 'CN-CI',     nom: "Chambre des Notaires de Côte d'Ivoire" },
      { code: 'AUTRE-CI',  nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  CM: {
    nom: 'Cameroun',
    ordres: [
      { code: 'ONECCA-CM', nom: 'ONECCA-CM — Ordre National des Experts Comptables du Cameroun' },
      { code: 'BARREAU-CM', nom: 'Barreau du Cameroun' },
      { code: 'CN-CM',     nom: 'Chambre des Notaires du Cameroun' },
      { code: 'AUTRE-CM',  nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA, 'SYSCAM'],
  },
  BJ: {
    nom: 'Bénin',
    ordres: [
      { code: 'OECCA-BJ', nom: 'OECCA-BJ — Ordre des Experts Comptables et Comptables Agréés du Bénin' },
      { code: 'BARREAU-BJ', nom: 'Barreau du Bénin' },
      { code: 'CN-BJ',    nom: 'Chambre des Notaires du Bénin' },
      { code: 'AUTRE-BJ', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  BF: {
    nom: 'Burkina Faso',
    ordres: [
      { code: 'ONECCA-BF', nom: 'ONECCA-BF — Ordre National des Experts Comptables et Comptables Agréés du Burkina Faso' },
      { code: 'BARREAU-BF', nom: 'Barreau du Burkina Faso' },
      { code: 'CN-BF',    nom: 'Chambre des Notaires du Burkina Faso' },
      { code: 'AUTRE-BF', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  ML: {
    nom: 'Mali',
    ordres: [
      { code: 'ONECCA-ML', nom: 'ONECCA-ML — Ordre National des Experts Comptables et Comptables Agréés du Mali' },
      { code: 'BARREAU-ML', nom: 'Barreau du Mali' },
      { code: 'CN-ML',    nom: 'Chambre des Notaires du Mali' },
      { code: 'AUTRE-ML', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  NE: {
    nom: 'Niger',
    ordres: [
      { code: 'ONECCA-NE', nom: 'ONECCA-NE — Ordre National des Experts Comptables et Comptables Agréés du Niger' },
      { code: 'BARREAU-NE', nom: 'Barreau du Niger' },
      { code: 'CN-NE',    nom: 'Chambre des Notaires du Niger' },
      { code: 'AUTRE-NE', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  TG: {
    nom: 'Togo',
    ordres: [
      { code: 'ONECCA-TG', nom: 'ONECCA-TG — Ordre National des Experts Comptables et Comptables Agréés du Togo' },
      { code: 'BARREAU-TG', nom: 'Barreau du Togo' },
      { code: 'CN-TG',    nom: 'Chambre des Notaires du Togo' },
      { code: 'AUTRE-TG', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  GA: {
    nom: 'Gabon',
    ordres: [
      { code: 'ONECCA-GA', nom: 'ONECCA-GA — Ordre National des Experts Comptables et Comptables Agréés du Gabon' },
      { code: 'BARREAU-GA', nom: 'Barreau du Gabon' },
      { code: 'CN-GA',    nom: 'Chambre des Notaires du Gabon' },
      { code: 'AUTRE-GA', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  CG: {
    nom: 'Congo (Brazzaville)',
    ordres: [
      { code: 'ONECCA-CG', nom: 'ONECCA-CG — Ordre National des Experts Comptables et Comptables Agréés du Congo' },
      { code: 'BARREAU-CG', nom: 'Barreau du Congo' },
      { code: 'CN-CG',    nom: 'Chambre des Notaires du Congo' },
      { code: 'AUTRE-CG', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  CD: {
    nom: 'RD Congo (Kinshasa)',
    ordres: [
      { code: 'ONEC-CD',  nom: 'ONEC — Ordre National des Experts Comptables du Congo (RDC)' },
      { code: 'BARREAU-CD', nom: 'Barreau de la RDC' },
      { code: 'CN-CD',    nom: 'Chambre des Notaires de la RDC' },
      { code: 'AUTRE-CD', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  CF: {
    nom: 'République Centrafricaine',
    ordres: [
      { code: 'ONECCA-CF', nom: 'ONECCA-CF — Ordre National des Experts Comptables de Centrafrique' },
      { code: 'AUTRE-CF', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  TD: {
    nom: 'Tchad',
    ordres: [
      { code: 'ONECCA-TD', nom: 'ONECCA-TD — Ordre National des Experts Comptables et Comptables Agréés du Tchad' },
      { code: 'AUTRE-TD', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  GN: {
    nom: 'Guinée (Conakry)',
    ordres: [
      { code: 'ONECCA-GN', nom: 'ONECCA-GN — Ordre National des Experts Comptables et Comptables Agréés de Guinée' },
      { code: 'BARREAU-GN', nom: 'Barreau de Guinée' },
      { code: 'AUTRE-GN', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  GW: {
    nom: 'Guinée-Bissau',
    ordres: [
      { code: 'ONECCA-GW', nom: 'ONECCA-GW — Ordre National des Experts Comptables de Guinée-Bissau' },
      { code: 'AUTRE-GW', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  GQ: {
    nom: 'Guinée Équatoriale',
    ordres: [
      { code: 'ONECCA-GQ', nom: 'Ordre des Experts Comptables de Guinée Équatoriale' },
      { code: 'AUTRE-GQ', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: [...REF_OHADA],
  },
  KM: {
    nom: 'Comores',
    ordres: [
      { code: 'AUTRE-KM', nom: 'Ordre professionnel des Comores' },
    ],
    referentiels: [...REF_OHADA],
  },
  MA: {
    nom: 'Maroc',
    ordres: [
      { code: 'OECMA',    nom: 'OECMA — Ordre des Experts Comptables et Comptables Agréés du Maroc' },
      { code: 'BARREAU-MA', nom: 'Barreau du Maroc' },
      { code: 'CN-MA',    nom: 'Chambre des Notaires du Maroc' },
      { code: 'AUTRE-MA', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['PCN', 'IFRS', 'Autre'],
  },
  DZ: {
    nom: 'Algérie',
    ordres: [
      { code: 'CNC-DZ',   nom: "CNC — Conseil National de la Comptabilité d'Algérie" },
      { code: 'BARREAU-DZ', nom: "Barreau de l'Algérie" },
      { code: 'AUTRE-DZ', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['PCG_DZ', 'IFRS', 'Autre'],
  },
  TN: {
    nom: 'Tunisie',
    ordres: [
      { code: 'OECT',     nom: 'OECT — Ordre des Experts Comptables de Tunisie' },
      { code: 'BARREAU-TN', nom: 'Barreau de Tunisie' },
      { code: 'CN-TN',    nom: 'Chambre des Notaires de Tunisie' },
      { code: 'AUTRE-TN', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['PCE_TN', 'IFRS', 'Autre'],
  },
  MG: {
    nom: 'Madagascar',
    ordres: [
      { code: 'OECAM',    nom: 'OECAM — Ordre des Experts Comptables et Financiers de Madagascar' },
      { code: 'AUTRE-MG', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['PCGE_MG', 'IFRS', 'Autre'],
  },
  MU: {
    nom: 'Maurice',
    ordres: [
      { code: 'ICAM',     nom: 'ICAM — Institute of Chartered Accountants of Mauritius' },
      { code: 'AUTRE-MU', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  NG: {
    nom: 'Nigeria',
    ordres: [
      { code: 'ICAN',     nom: 'ICAN — Institute of Chartered Accountants of Nigeria' },
      { code: 'AUTRE-NG', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  GH: {
    nom: 'Ghana',
    ordres: [
      { code: 'ICAG',     nom: 'ICAG — Institute of Chartered Accountants Ghana' },
      { code: 'AUTRE-GH', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  KE: {
    nom: 'Kenya',
    ordres: [
      { code: 'ICPAK',    nom: 'ICPAK — Institute of Certified Public Accountants of Kenya' },
      { code: 'AUTRE-KE', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  ZA: {
    nom: 'Afrique du Sud',
    ordres: [
      { code: 'SAICA',    nom: 'SAICA — South African Institute of Chartered Accountants' },
      { code: 'AUTRE-ZA', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  ET: {
    nom: 'Éthiopie',
    ordres: [
      { code: 'AUTRE-ET', nom: 'Ordre professionnel éthiopien' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
  FR: {
    nom: 'France',
    ordres: [
      { code: 'OEC-FR',   nom: 'OEC — Ordre des Experts-Comptables de France' },
      { code: 'CNCC-FR',  nom: 'CNCC — Compagnie Nationale des Commissaires aux Comptes' },
      { code: 'BARREAU-FR', nom: 'Barreau de France' },
      { code: 'CN-FR',    nom: 'Chambre des Notaires de France' },
      { code: 'AUTRE-FR', nom: 'Autre ordre ou association professionnelle' },
    ],
    referentiels: ['IFRS', 'Autre'],
  },
}

export const SECTEURS = [
  { code: 'agriculture',      label: 'Agriculture, Élevage & Pêche' },
  { code: 'banque_finance',   label: 'Banque & Finance' },
  { code: 'microfinance',     label: 'Microfinance & SFD' },
  { code: 'assurance',        label: 'Assurance' },
  { code: 'commerce',         label: 'Commerce & Distribution' },
  { code: 'construction_immo', label: 'Construction & Immobilier' },
  { code: 'education',        label: 'Éducation & Formation' },
  { code: 'energie',          label: 'Énergie & Utilities' },
  { code: 'industrie',        label: 'Industrie Manufacturière' },
  { code: 'mines',            label: 'Industries Extractives & Mines' },
  { code: 'sante',            label: 'Santé & Pharmacie' },
  { code: 'services',         label: 'Services aux Entreprises' },
  { code: 'technologie',      label: 'Technologie & Numérique' },
  { code: 'telecom',          label: 'Télécommunications' },
  { code: 'transport',        label: 'Transport & Logistique' },
  { code: 'tourisme',         label: 'Tourisme & Hôtellerie' },
  { code: 'ong_asbl',         label: 'ONG / Association à But Non Lucratif' },
  { code: 'admin_publique',   label: 'Administration Publique' },
  { code: 'autre',            label: 'Autre secteur' },
]

export const SPECIALITES = [
  { code: 'expert_comptable',         label: 'Expert-Comptable' },
  { code: 'commissaire_aux_comptes',  label: 'Commissaire aux Comptes' },
  { code: 'expert_fiscal',            label: 'Expert Fiscal' },
  { code: 'avocat',                   label: 'Avocat' },
  { code: 'notaire',                  label: 'Notaire' },
  { code: 'expert_immobilier',        label: 'Expert Immobilier' },
]

export function getPaysList() {
  return Object.entries(PAYS)
    .map(([code, p]) => ({ code, nom: p.nom }))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
}

export function getPaysNom(code) {
  return PAYS[code]?.nom || code
}

export function getOrdresForPays(paysCode) {
  return PAYS[paysCode]?.ordres || [{ code: 'AUTRE', nom: 'Autre ordre ou association professionnelle' }]
}

export function getReferentielsForPays(paysCode) {
  const codes = PAYS[paysCode]?.referentiels || ['SYSCOHADA Révisé 2017', 'IFRS', 'Autre']
  return codes.map(code => ({ code, labelFull: REFERENTIELS[code]?.labelFull || code }))
}

export function getReferentielLabel(code) {
  return REFERENTIELS[code]?.labelFull || code
}
