import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  fr: {
    translation: {
      nav_home: 'Accueil',
      nav_verify: 'Vérifier',
      nav_reviewers: 'Vérificateurs',
      nav_editors: 'Émetteurs',
      nav_login: 'Connexion',
      nav_cta: 'Commencer',
      logout: 'Déconnexion',

      hero_eyebrow: 'Standard africain de certification',
      hero_sub: 'VeryTrust permet aux professionnels réglementés d\'émettre des documents certifiés vérifiables instantanément partout en Afrique.',
      hero_cta1: 'Émettre un certificat',
      hero_cta2: 'Vérifier un document',

      stat1: 'pays africains',
      stat2: 'documents certifiés',
      stat3: 'langues supportées',
      stat4: 'vérification',

      levels_title: 'Quatre niveaux de confiance, une seule plateforme.',

      bronze_desc: 'Logiciels et outils certifiés VeryTrust. Entrée dans l\'écosystème de confiance.',
      silver_desc: 'Expert-comptable certifié par VeryTrust après évaluation de son portefeuille client.',
      gold_desc: 'Commissaire aux Comptes avec quota strict par pays. Le standard le plus exigeant.',
      platinum_desc: 'Cabinet international ayant passé l\'audit complet VeryTrust. Reconnaissance panafricaine.',

      cta_title: 'Prêt à certifier vos documents ?',
      cta_sub: 'Rejoignez les professionnels qui font confiance à VeryTrust pour sécuriser leurs documents.',
      cta_btn: 'Créer un compte gratuit',
    }
  },
  en: {
    translation: {
      nav_home: 'Home',
      nav_verify: 'Verify',
      nav_reviewers: 'Reviewers',
      nav_editors: 'Issuers',
      nav_login: 'Login',
      nav_cta: 'Get started',
      logout: 'Log out',

      hero_eyebrow: 'African certification standard',
      hero_sub: 'VeryTrust enables regulated professionals to issue instantly verifiable certified documents across Africa.',
      hero_cta1: 'Issue a certificate',
      hero_cta2: 'Verify a document',

      stat1: 'African countries',
      stat2: 'certified documents',
      stat3: 'supported languages',
      stat4: 'verification',

      levels_title: 'Four trust levels, one platform.',

      bronze_desc: 'VeryTrust-certified software and tools. Entry into the trust ecosystem.',
      silver_desc: 'Accountant certified by VeryTrust after client portfolio evaluation.',
      gold_desc: 'Statutory Auditor with strict per-country quota. The most demanding standard.',
      platinum_desc: 'International firm that passed the full VeryTrust audit. Pan-African recognition.',

      cta_title: 'Ready to certify your documents?',
      cta_sub: 'Join the professionals who trust VeryTrust to secure their documents.',
      cta_btn: 'Create a free account',
    }
  },
  pt: {
    translation: {
      nav_home: 'Início',
      nav_verify: 'Verificar',
      nav_reviewers: 'Verificadores',
      nav_editors: 'Emissores',
      nav_login: 'Entrar',
      nav_cta: 'Começar',
      logout: 'Sair',

      hero_eyebrow: 'Padrão africano de certificação',
      hero_sub: 'VeryTrust permite que profissionais regulamentados emitam documentos certificados verificáveis instantaneamente em toda África.',
      hero_cta1: 'Emitir certificado',
      hero_cta2: 'Verificar documento',

      stat1: 'países africanos',
      stat2: 'documentos certificados',
      stat3: 'idiomas suportados',
      stat4: 'verificação',

      levels_title: 'Quatro níveis de confiança, uma plataforma.',

      bronze_desc: 'Software e ferramentas certificados pela VeryTrust.',
      silver_desc: 'Contador certificado pela VeryTrust após avaliação.',
      gold_desc: 'Auditor com quota estrita por país.',
      platinum_desc: 'Gabinete internacional com auditoria VeryTrust completa.',

      cta_title: 'Pronto para certificar seus documentos?',
      cta_sub: 'Junte-se aos profissionais que confiam na VeryTrust.',
      cta_btn: 'Criar conta gratuita',
    }
  },
  es: {
    translation: {
      nav_home: 'Inicio',
      nav_verify: 'Verificar',
      nav_reviewers: 'Verificadores',
      nav_editors: 'Emisores',
      nav_login: 'Iniciar sesión',
      nav_cta: 'Empezar',
      logout: 'Cerrar sesión',

      hero_eyebrow: 'Estándar africano de certificación',
      hero_sub: 'VeryTrust permite a los profesionales regulados emitir documentos certificados verificables al instante en toda África.',
      hero_cta1: 'Emitir certificado',
      hero_cta2: 'Verificar documento',

      stat1: 'países africanos',
      stat2: 'documentos certificados',
      stat3: 'idiomas soportados',
      stat4: 'verificación',

      levels_title: 'Cuatro niveles de confianza, una plataforma.',

      bronze_desc: 'Software y herramientas certificados por VeryTrust.',
      silver_desc: 'Contador certificado por VeryTrust tras evaluación.',
      gold_desc: 'Auditor con cuota estricta por país.',
      platinum_desc: 'Gabinete internacional con auditoría VeryTrust completa.',

      cta_title: '¿Listo para certificar sus documentos?',
      cta_sub: 'Únase a los profesionales que confían en VeryTrust.',
      cta_btn: 'Crear cuenta gratuita',
    }
  },
  ar: {
    translation: {
      nav_home: 'الرئيسية',
      nav_verify: 'التحقق',
      nav_reviewers: 'المراجعون',
      nav_editors: 'المُصدرون',
      nav_login: 'تسجيل الدخول',
      nav_cta: 'ابدأ الآن',
      logout: 'تسجيل الخروج',

      hero_eyebrow: 'معيار التوثيق الأفريقي',
      hero_sub: 'تتيح VeryTrust للمهنيين المرخصين إصدار وثائق موثقة قابلة للتحقق فوراً في جميع أنحاء أفريقيا.',
      hero_cta1: 'إصدار شهادة',
      hero_cta2: 'التحقق من وثيقة',

      stat1: 'دولة أفريقية',
      stat2: 'وثيقة موثقة',
      stat3: 'لغات مدعومة',
      stat4: 'تحقق',

      levels_title: 'أربعة مستويات من الثقة، منصة واحدة.',

      bronze_desc: 'برامج وأدوات معتمدة من VeryTrust.',
      silver_desc: 'محاسب معتمد من VeryTrust بعد التقييم.',
      gold_desc: 'مدقق حسابات بحصة صارمة لكل دولة.',
      platinum_desc: 'مكتب دولي اجتاز تدقيق VeryTrust الكامل.',

      cta_title: 'هل أنت مستعد لتوثيق مستنداتك؟',
      cta_sub: 'انضم إلى المهنيين الذين يثقون في VeryTrust.',
      cta_btn: 'إنشاء حساب مجاني',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
  })

export default i18n
