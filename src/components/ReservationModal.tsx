import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSitting?: 'bench' | 'dining';
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  defaultSitting = 'dining',
}) => {
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>('2026-10-15');
  const [time, setTime] = useState<string>('19:30');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const handleReset = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" id="reservation-dialog">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fermer le dialogue de réservation"
          id="btn-close-reservation"
        >
          <X size={20} />
        </button>

        {!confirmed ? (
          <div>
            <p className="label" style={{ marginBottom: '0.5rem' }}>NOIR · PARIS</p>
            <h2 className="bd" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', fontWeight: 400, lineHeight: 1.05 }}>
              YOUR TABLE <i>AWAITS</i>
            </h2>
            <p style={{ color: 'var(--soft)', fontSize: '0.92rem', marginTop: '0.6rem', maxWidth: '46ch' }}>
              Twelve tables. An intimate culinary sequence in Paris. Dinner Tuesday through Saturday from 19:00 to 23:30.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: '1.6rem' }} id="noir-reservation-form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label" htmlFor="res-name">Name</label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="res-email">Email</label>
                  <input
                    id="res-email"
                    type="email"
                    required
                    placeholder="bonjour@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.1rem' }}>
                <div>
                  <label className="form-label" htmlFor="res-phone">Phone</label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    placeholder="+33 1 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="res-guests">Number of guests</label>
                  <select
                    id="res-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="form-select"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests (Private alcove)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="res-date">Date</label>
                  <input
                    id="res-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="res-time">Time</label>
                  <select
                    id="res-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="res-message">Message / request</label>
                <textarea
                  id="res-message"
                  rows={2}
                  placeholder="Dietary requests, allergies, or special notations for the evening..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--dim)', marginTop: '1rem', lineHeight: 1.5 }}>
                12 Rue fictive, 75001 Paris · Table allocations are confirmed by email or telephone within 24 hours.
              </p>

              <button type="submit" className="btn-submit" id="btn-submit-booking">
                Confirm Request
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={44} color="var(--linen)" style={{ margin: '0 auto 1.2rem' }} />
            <p className="label">NOIR · CONFIRMATION</p>
            <h2 className="bd" style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 400 }}>
              Your table is requested, <i>{name || 'Guest'}</i>.
            </h2>
            <div style={{ maxWidth: '420px', margin: '1.5rem auto', padding: '1.2rem', background: 'var(--slate-2)', border: '1px solid var(--hair)', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--soft)', marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--linen)' }}>Location:</strong> NOIR, 12 Rue fictive, 75001 Paris
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--soft)', marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--linen)' }}>Date & Time:</strong> {date} at {time}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--soft)' }}>
                <strong style={{ color: 'var(--linen)' }}>Party:</strong> {guests} Guests
              </p>
              {message && (
                <p style={{ fontSize: '0.82rem', color: 'var(--dim)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                  Note: {message}
                </p>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--dim)', maxWidth: '46ch', margin: '0 auto' }}>
              A confirmation email will be sent to {email}. You can also reach our maitre d’hôtel directly at <strong>+33 1 00 00 00 00</strong>.
            </p>
            <button
              type="button"
              className="btn-submit"
              onClick={handleReset}
              style={{ maxWidth: '240px', margin: '1.8rem auto 0' }}
            >
              Return to NOIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
