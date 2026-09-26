import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  RotateCcw,
  Sparkles,
  Printer,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { submitReservation, ApiError } from '../../services/api';
import { ReservationPayload, ReservationResult } from '../../types';
import styles from './Reservation.module.css';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  guests?: string;
  date?: string;
  time?: string;
  general?: string;
}

const AVAILABLE_TIMES = [
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30'
];

const DIET_SUGGESTIONS = [
  'Menu Végétarien',
  'Sans Gluten',
  'Sans Lactose',
  'Allergie Fruits de Mer / Iode',
  'Femme Enceinte',
  'Anniversaire / Célébration',
  'Accord Vins Rares & Prestige'
];

export const ReservationPage: React.FC = () => {
  useScrollReveal();

  // Experience Selection
  const [sittingType, setSittingType] = useState<'dining' | 'bench'>('dining');

  // Form State
  const [formData, setFormData] = useState<ReservationPayload>({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '20:00',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ReservationResult | null>(null);

  // SEO
  useEffect(() => {
    document.title = 'NOIR — Réservation | Douze Tables à Paris';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Réservez votre table au restaurant NOIR à Paris. Douze tables uniques, une seule partition nocturne par soir du mardi au samedi.'
      );
    }
  }, []);

  // Tomorrow's date formatted as minimum date input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = 'Veuillez renseigner votre nom complet.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Le nom doit comporter au moins 2 caractères.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Veuillez renseigner votre adresse email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Format d’adresse email non valide.';
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)\.]/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Veuillez renseigner votre numéro de téléphone.';
    } else if (phoneClean.length < 8) {
      errs.phone = 'Le numéro doit comporter au moins 8 chiffres.';
    }

    if (!formData.guests || formData.guests < 1 || formData.guests > 12) {
      errs.guests = 'Le nombre de convives doit être compris entre 1 et 12.';
    }

    if (!formData.date) {
      errs.date = 'Veuillez sélectionner une date de dîner.';
    } else {
      const selectedDay = new Date(formData.date).getDay();
      // 0 = Sunday, 1 = Monday (closed)
      if (selectedDay === 0 || selectedDay === 1) {
        errs.date = 'Le restaurant est fermé le dimanche et le lundi.';
      }
    }

    if (!formData.time) {
      errs.time = 'Veuillez sélectionner une heure de service.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDietTagClick = (tag: string) => {
    setFormData((prev) => {
      const current = prev.message || '';
      if (current.includes(tag)) return prev;
      const updated = current ? `${current}, ${tag}` : tag;
      return { ...prev, message: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: ReservationPayload = {
        ...formData,
        message: sittingType === 'bench' 
          ? `[LE BANC DU CHEF] ${formData.message || ''}`.trim()
          : formData.message
      };

      const response = await submitReservation(payload);
      setResult(response);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Une erreur imprévue est survenue lors de l’envoi de votre demande.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: 2,
      date: '',
      time: '20:00',
      message: ''
    });
    setErrors({});
    setResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.reservationPageRoot} id="reservation-page">
      {/* Ambient Atmospheric Glows */}
      <div className={`${styles.ambientGlow} ${styles.ambientGlowTop}`} aria-hidden="true" />
      <div className={`${styles.ambientGlow} ${styles.ambientGlowMid}`} aria-hidden="true" />

      {/* =========================================================================
          01 / HERO — L'INVITATION À LA TABLE
          ========================================================================= */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackdrop} aria-hidden="true">
          <img
            src="/images/hero/hero-cand-table-1600.jpg"
            alt="Table intimiste aux chandelles du restaurant NOIR"
            className={styles.heroBackdropImage}
          />
          <div className={styles.heroGradientOverlay} />
          <div className={styles.heroVignetteOverlay} />
        </div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={`${styles.chapterLabel} rv`}>NOIR · PARIS · RÉSERVATION</span>
            <h1 className={`${styles.heroTitle} rv rv2`}>
              DOUZE TABLES. <br />
              <i>UNE SEULE</i> SOIRÉE.
            </h1>
            <p className={`${styles.heroSubtitle} rv rv3`}>
              Douze tables au cœur de Paris. Une partition nocturne ininterrompue façonnée chaque soir pour nos convives du mardi au samedi.
            </p>

            <div className={`${styles.heroMetaRow} rv rv4`}>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>SERVICE</span>
                <span className={styles.heroMetaVal}>UNIQUE · DÈS 19H00</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>DISPOSITION</span>
                <span className={styles.heroMetaVal}>12 TABLES & LE BANC</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>RYTHME</span>
                <span className={styles.heroMetaVal}>MARDI AU SAMEDI</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>ADRESSE</span>
                <span className={styles.heroMetaVal}>79 RUE DE BELLEVILLE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          02 / MAIN SECTION — FORMULAIRE & ATMOSPHÈRE
          ========================================================================= */}
      <main className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            {/* Left Column: Interactive Reservation Experience */}
            <div className={styles.formColumn}>
              {result ? (
                /* SUCCESS STATE — BESPOKE INVITATION CARTON */
                <div className={`${styles.successReceipt} rv`} id="reservation-confirmation">
                  <div className={styles.cartonInnerBorder}>
                    <div className={styles.successHeader}>
                      <div className={styles.successIconWrap}>
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <span className={styles.receiptTag}>CONFIRMATION DE DEMANDE</span>
                        <h2 className={styles.receiptTitle}>Carton d'Enregistrement</h2>
                      </div>
                    </div>

                    <p className={styles.successNotice}>
                      {result.message} Notre maître d’hôtel examine la disposition du plan de table et vous adressera votre carton de confirmation définitif par SMS et email sous 12 heures.
                    </p>

                    <div className={styles.receiptVoucher}>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>RÉFÉRENCE DU REGISTRE</span>
                        <span className={styles.voucherCode}>{result.reservation_id}</span>
                      </div>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>DISPOSITION CHOISIE</span>
                        <span className={styles.voucherVal}>
                          {sittingType === 'bench' ? 'Le Banc du Chef (Face au Piano)' : 'La Salle Feutrée (Table Intime)'}
                        </span>
                      </div>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>CONVIVE RÉFÉRENT</span>
                        <span className={styles.voucherVal}>{result.data?.name}</span>
                      </div>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>NOMBRE DE COUVERTS</span>
                        <span className={styles.voucherVal}>{result.data?.guests} {result.data?.guests === 1 ? 'Personne' : 'Personnes'}</span>
                      </div>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>DATE DE SERVICE</span>
                        <span className={styles.voucherVal}>{result.data?.date}</span>
                      </div>
                      <div className={styles.voucherRow}>
                        <span className={styles.voucherLabel}>ARRIVÉE SOUHAITÉE</span>
                        <span className={styles.voucherVal}>{result.data?.time} (Service ininterrompu)</span>
                      </div>
                      {result.data?.message && (
                        <div className={styles.voucherRow}>
                          <span className={styles.voucherLabel}>ATTENTIONS PARTICULIÈRES</span>
                          <span className={styles.voucherVal}>{result.data?.message}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.receiptActions}>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className={styles.newReservationBtn}
                      >
                        <Printer size={14} />
                        <span>Imprimer le Carton</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className={styles.newReservationBtn}
                        id="new-reservation-btn"
                      >
                        <RotateCcw size={14} />
                        <span>Nouvelle Demande</span>
                      </button>
                      <Link to="/menus" className={styles.exploreCarteLink}>
                        <span>Explorer Les Menus</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* BESPOKE RESERVATION FORM */
                <form onSubmit={handleSubmit} className={styles.formBox} noValidate id="reservation-form">
                  
                  {/* Experience Selector (Architectural Tabs) */}
                  <div className={`${styles.experienceContainer} rv`}>
                    <div className={styles.experienceHeaderRow}>
                      <span className={styles.experienceGroupLabel}>CHOIX DE L'EXPÉRIENCE</span>
                      <span className={styles.experienceGroupSub}>DEUX VISIONS DE LA GASTRONOMIE</span>
                    </div>

                    <div className={styles.experienceToggleGroup}>
                      <button
                        type="button"
                        className={`${styles.experienceBtn} ${
                          sittingType === 'dining' ? styles.experienceBtnActive : ''
                        }`}
                        onClick={() => setSittingType('dining')}
                      >
                        <div className={styles.experienceBtnMarker} />
                        <div className={styles.experienceBtnContent}>
                          <div className={styles.experienceBtnTop}>
                            <span className={styles.experienceIndex}>I</span>
                            <span className={styles.experienceName}>La Salle</span>
                            <span className={styles.experienceCap}>12 TABLES INTIMES</span>
                          </div>
                          <p className={styles.experienceDesc}>
                            Atmosphère feutrée, tables espacées, lumière tamisée aux chandelles pour une immersion intime et contemplative.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`${styles.experienceBtn} ${
                          sittingType === 'bench' ? styles.experienceBtnActive : ''
                        }`}
                        onClick={() => setSittingType('bench')}
                      >
                        <div className={styles.experienceBtnMarker} />
                        <div className={styles.experienceBtnContent}>
                          <div className={styles.experienceBtnTop}>
                            <span className={styles.experienceIndex}>II</span>
                            <span className={styles.experienceName}>Le Banc du Chef</span>
                            <span className={styles.experienceCap}>4 PLACES COMPTOIR</span>
                          </div>
                          <p className={styles.experienceDesc}>
                            Comptoir en chêne brûlé face au piano de cuisson. Les gestes, le feu et l'artisanat culinaire au premier regard.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {errors.general && (
                    <div className={styles.generalError} role="alert">
                      <AlertCircle size={18} />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* Section 01: Couverts, Date & Heure */}
                  <div className={`${styles.formSection} rv rv2`}>
                    <div className={styles.sectionHeadingWrap}>
                      <span className={styles.sectionRoman}>I</span>
                      <div className={styles.sectionHeadingText}>
                        <h3 className={styles.sectionTitle}>Date, Horaires & Couverts</h3>
                        <p className={styles.sectionSubtitle}>La partition nocturne s'organise autour d'un rythme unique</p>
                      </div>
                    </div>

                    {/* Architectural Guests Counter */}
                    <div className={styles.fieldGroup}>
                      <div className={styles.fieldLabelRow}>
                        <label htmlFor="guests-select" className={styles.fieldLabel}>
                          <Users size={13} />
                          <span>Nombre de Convives</span>
                        </label>
                        <span className={styles.fieldLabelDetail}>Capacité par table</span>
                      </div>

                      <div className={styles.guestSelector} id="guests-select">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <button
                            key={num}
                            type="button"
                            className={`${styles.guestBox} ${
                              formData.guests === num ? styles.guestBoxActive : ''
                            }`}
                            onClick={() => setFormData({ ...formData, guests: num })}
                          >
                            <span className={styles.guestNum}>{num}</span>
                            <span className={styles.guestWord}>{num === 1 ? 'Couverts' : 'Couverts'}</span>
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`${styles.guestBox} ${styles.guestBoxPrivatisation} ${
                            formData.guests >= 7 ? styles.guestBoxActive : ''
                          }`}
                          onClick={() => setFormData({ ...formData, guests: 8 })}
                        >
                          <span className={styles.guestNum}>7+</span>
                          <span className={styles.guestWord}>Privatisation</span>
                        </button>
                      </div>
                      {errors.guests && <span className={styles.fieldError}>{errors.guests}</span>}
                    </div>

                    {/* Date & Time Row */}
                    <div className={styles.fieldRow}>
                      {/* Date Input */}
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldLabelRow}>
                          <label htmlFor="date-input" className={styles.fieldLabel}>
                            <Calendar size={13} />
                            <span>Date du Dîner</span>
                          </label>
                        </div>
                        <div className={styles.inputWrapper}>
                          <input
                            type="date"
                            id="date-input"
                            min={minDate}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={`${styles.textInput} ${styles.dateInput} ${errors.date ? styles.inputError : ''}`}
                            required
                          />
                        </div>
                        <span className={styles.fieldHint}>
                          Service du mardi au samedi soir · Fermeture dimanche & lundi
                        </span>
                        {errors.date && <span className={styles.fieldError}>{errors.date}</span>}
                      </div>

                      {/* Time Slots */}
                      <div className={styles.fieldGroup}>
                        <div className={styles.fieldLabelRow}>
                          <label className={styles.fieldLabel}>
                            <Clock size={13} />
                            <span>Heure d'Arrivée</span>
                          </label>
                          <span className={styles.fieldLabelDetail}>Service unique</span>
                        </div>
                        <div className={styles.timeGrid}>
                          {AVAILABLE_TIMES.map((time) => (
                            <button
                              key={time}
                              type="button"
                              className={`${styles.timeBox} ${
                                formData.time === time ? styles.timeBoxActive : ''
                              }`}
                              onClick={() => setFormData({ ...formData, time })}
                            >
                              <span className={styles.timeVal}>{time}</span>
                            </button>
                          ))}
                        </div>
                        {errors.time && <span className={styles.fieldError}>{errors.time}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Section 02: Coordonnées du Convive */}
                  <div className={`${styles.formSection} rv rv3`}>
                    <div className={styles.sectionHeadingWrap}>
                      <span className={styles.sectionRoman}>II</span>
                      <div className={styles.sectionHeadingText}>
                        <h3 className={styles.sectionTitle}>Convive Référent</h3>
                        <p className={styles.sectionSubtitle}>Vos coordonnées pour la confirmation et les attentions d'accueil</p>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="name-input" className={styles.fieldLabel}>
                        <span>Nom & Prénom du Référent *</span>
                      </label>
                      <input
                        type="text"
                        id="name-input"
                        placeholder="e.g. Victoire de Clermont"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`${styles.textInput} ${errors.name ? styles.inputError : ''}`}
                        required
                        autoComplete="name"
                      />
                      {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="email-input" className={styles.fieldLabel}>
                          <Mail size={13} />
                          <span>Adresse Email de Contact *</span>
                        </label>
                        <input
                          type="email"
                          id="email-input"
                          placeholder="victoire@exemple.fr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`${styles.textInput} ${errors.email ? styles.inputError : ''}`}
                          required
                          autoComplete="email"
                        />
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="phone-input" className={styles.fieldLabel}>
                          <Phone size={13} />
                          <span>Numéro de Téléphone *</span>
                        </label>
                        <input
                          type="tel"
                          id="phone-input"
                          placeholder="+33 6 12 34 56 78"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`${styles.textInput} ${errors.phone ? styles.inputError : ''}`}
                          required
                          autoComplete="tel"
                        />
                        {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Section 03: Régimes & Attentions */}
                  <div className={`${styles.formSection} rv rv4`}>
                    <div className={styles.sectionHeadingWrap}>
                      <span className={styles.sectionRoman}>III</span>
                      <div className={styles.sectionHeadingText}>
                        <h3 className={styles.sectionTitle}>Attentions Culinaires & Préférences</h3>
                        <p className={styles.sectionSubtitle}>La brigade adapte les accords et cuissons à vos exigences</p>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="message-input" className={styles.fieldLabel}>
                        <Sparkles size={13} />
                        <span>Régimes, allergies ou célébration particulière</span>
                      </label>
                      <textarea
                        id="message-input"
                        rows={3}
                        placeholder="Indiquez toute allergie, restriction alimentaire ou intention afin que notre brigade sculpte votre menu sur mesure..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={styles.textArea}
                      />

                      {/* Editorial Tag Inclusions */}
                      <div className={styles.dietSelectorWrapper}>
                        <span className={styles.dietSelectorTitle}>AJOUTER RAPIDEMENT UNE ATTENTION DU CHEF :</span>
                        <div className={styles.dietTags}>
                          {DIET_SUGGESTIONS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className={styles.dietTagBtn}
                              onClick={() => handleDietTagClick(tag)}
                            >
                              <span>+</span> {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 04: Soumission & Engagement */}
                  <div className={`${styles.formFooter} rv`}>
                    <div className={styles.guaranteeNotice}>
                      <ShieldCheck size={18} className={styles.guaranteeIcon} />
                      <p className={styles.policyNotice}>
                        Aucune empreinte bancaire n’est requise à cette étape. Notre maître d’hôtel étudie la composition du service et vous contacte personnellement pour valider votre venue.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.submitBtn}
                      id="submit-reservation-btn"
                    >
                      <span className={styles.submitBtnText}>
                        {isSubmitting ? 'Transmission au registre...' : 'Transmettre la Demande de Table'}
                      </span>
                      <ArrowRight size={15} className={styles.submitBtnArrow} />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Policies, Visual Atmosphere & Concierge Monograph */}
            <aside className={styles.policyColumn}>
              {/* Monograph Vignette Frame */}
              <div className={`${styles.atmosphereFrame} rv`}>
                <div className={styles.atmosphereImageWrap}>
                  <img
                    src="/images/hero/hero-cand-table-700.jpg"
                    alt="Atmosphère feutrée des 12 tables chez NOIR"
                    className={styles.atmosphereImage}
                    loading="lazy"
                  />
                  <div className={styles.atmosphereImageOverlay} />
                </div>
                <div className={styles.atmosphereMeta}>
                  <div className={styles.atmosphereMetaItem}>
                    <Compass size={12} />
                    <span>PARIS XXᵉ · 48.8719° N, 2.3789° E</span>
                  </div>
                  <span className={styles.atmosphereMetaDetail}>TEMPÉRATURE LUMIÈRE 2200K</span>
                </div>
              </div>

              {/* Le Protocole de la Nuit (Refined House Rules) */}
              <div className={`${styles.rulesMonograph} rv rv2`}>
                <div className={styles.rulesMonographHeader}>
                  <span className={styles.rulesMonographTag}>LA PHILOSOPHIE DU SERVICE</span>
                  <h3 className={styles.rulesMonographTitle}>Le Protocole de la Nuit</h3>
                </div>

                <div className={styles.rulesLedger}>
                  <div className={styles.ledgerItem}>
                    <div className={styles.ledgerIndex}>01</div>
                    <div className={styles.ledgerContent}>
                      <h4 className={styles.ledgerHeading}>Service Unique & Rythme Préservé</h4>
                      <p className={styles.ledgerText}>
                        Aucune table n'est réattribuée au cours de la même soirée. Votre table demeure la vôtre sans contrainte d'horaire jusqu’à la conclusion du service.
                      </p>
                    </div>
                  </div>

                  <div className={styles.ledgerItem}>
                    <div className={styles.ledgerIndex}>02</div>
                    <div className={styles.ledgerContent}>
                      <h4 className={styles.ledgerHeading}>Acoustique & Atmosphère Feutrée</h4>
                      <p className={styles.ledgerText}>
                        Afin de préserver la résonance des matières et l'intimité de chaque convive, les communications téléphoniques sont invitées à se dérouler dans le vestibule.
                      </p>
                    </div>
                  </div>

                  <div className={styles.ledgerItem}>
                    <div className={styles.ledgerIndex}>03</div>
                    <div className={styles.ledgerContent}>
                      <h4 className={styles.ledgerHeading}>Haute Couture Culinaire</h4>
                      <p className={styles.ledgerText}>
                        Chaque menu est décliné avec la même rigueur en version végétale ou adaptée à vos intolérances, dès lors qu'elles nous sont communiquées lors de la réservation.
                      </p>
                    </div>
                  </div>

                  <div className={styles.ledgerItem}>
                    <div className={styles.ledgerIndex}>04</div>
                    <div className={styles.ledgerContent}>
                      <h4 className={styles.ledgerHeading}>Privatisations & Grands Formats</h4>
                      <p className={styles.ledgerText}>
                        Pour les tablées supérieures à 6 convives ou la privatisation intégrale des douze tables, adressez votre demande à notre salon privé :{' '}
                        <a href="mailto:privatisation@noir-paris.example" className={styles.policyEmailLink}>
                          privatisation@noir-paris.example
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Concierge & Maître d'Hôtel Seal */}
              <div className={`${styles.conciergeStamp} rv rv3`}>
                <div className={styles.conciergeTop}>
                  <span className={styles.conciergeBadge}>LIGNE PRIVÉE DU MAÎTRE D'HÔTEL</span>
                  <p className={styles.conciergePhone}>+33 1 42 68 00 00</p>
                </div>
                <div className={styles.conciergeBottom}>
                  <p className={styles.conciergeHours}>
                    Permanence téléphonique du mardi au samedi de 14h00 à 18h30.
                  </p>
                  <a href="mailto:concierge@noir-paris.example" className={styles.conciergeEmail}>
                    concierge@noir-paris.example
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

