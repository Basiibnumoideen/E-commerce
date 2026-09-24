import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Contact() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Client Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received by our concierge.', 'success');
  };

  return (
    <main className="contact-page py-5">
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Header */}
        <div className="text-center mb-5 pb-2">
          <span className="text-uppercase small text-muted" style={{ letterSpacing: '2px' }}>
            ATELIER CLIENT SERVICES
          </span>
          <h1 className="font-serif mt-2 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 500 }}>
            Contact &amp; Concierge
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '580px', lineHeight: 1.7 }}>
            Our dedicated client advisors are at your service for personal styling consultations,
            private appointments, sizing guidance, and bespoke orders.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Details Column */}
          <div className="col-lg-5 col-md-12">
            <div className="p-4 p-lg-5 bg-white border" style={{ borderColor: '#E7E5E4' }}>
              <h4 className="font-serif mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Flagship Locations
              </h4>

              <div className="mb-4">
                <h6 className="text-uppercase small fw-bold mb-1" style={{ letterSpacing: '1px' }}>Paris Atelier</h6>
                <p className="text-muted small m-0">12 Rue du Faubourg Saint-Honoré, 75008 Paris, France</p>
                <p className="text-muted small m-0">+33 1 42 68 00 00</p>
              </div>

              <div className="mb-4">
                <h6 className="text-uppercase small fw-bold mb-1" style={{ letterSpacing: '1px' }}>New York Flagship</h6>
                <p className="text-muted small m-0">740 Madison Avenue, New York, NY 10065, USA</p>
                <p className="text-muted small m-0">+1 (212) 555-0199</p>
              </div>

              <hr className="my-4" style={{ borderColor: '#E5E7EB' }} />

              <div>
                <h6 className="text-uppercase small fw-bold mb-2" style={{ letterSpacing: '1px' }}>Client Hours</h6>
                <p className="text-muted small m-0">Monday – Saturday: 10:00 – 19:00 CET</p>
                <p className="text-muted small m-0">Sunday: By Private Appointment</p>
                <p className="text-muted small mt-2">concierge@atelier.luxury</p>
              </div>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="col-lg-7 col-md-12">
            <div className="p-4 p-lg-5 bg-white border" style={{ borderColor: '#E7E5E4' }}>
              <h4 className="font-serif mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Send an Inquiry
              </h4>

              {submitted ? (
                <div className="py-4 text-center">
                  <i className="bi bi-check-circle display-4 text-success mb-3 d-block"></i>
                  <h5 className="font-serif mb-2">Thank you, {formData.name || 'valued client'}.</h5>
                  <p className="text-muted small mb-4">
                    Your inquiry has been forwarded to our dedicated client advisor. You will receive a response within 24 hours.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark text-uppercase small px-4 py-2"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'Client Inquiry', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="sn-form-label text-uppercase d-block mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        className="sn-form-input w-100" 
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="sn-form-label text-uppercase d-block mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        className="sn-form-input w-100" 
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="sn-form-label text-uppercase d-block mb-1">Inquiry Topic</label>
                    <select 
                      className="form-select border-0 border-bottom rounded-0 px-0 small text-dark shadow-none"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      style={{ borderBottomColor: '#DCDCDC' }}
                    >
                      <option value="Client Inquiry">General Inquiry</option>
                      <option value="Product Sizing">Size &amp; Fit Consultation</option>
                      <option value="Order Assistance">Order Status &amp; Shipping</option>
                      <option value="Private Appointment">Bespoke Private Appointment</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="sn-form-label text-uppercase d-block mb-1">Message *</label>
                    <textarea 
                      rows="4" 
                      className="form-control rounded-0 border-0 border-bottom px-0 shadow-none small"
                      placeholder="How may our concierge assist you today?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ borderBottomColor: '#DCDCDC' }}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="sn-btn-primary w-100 border-0 text-uppercase py-3">
                    SUBMIT INQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
