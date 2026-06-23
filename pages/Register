import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CarrierRegister() {
  const [formData, setFormData] = useState({
    companyName: '',
    dotNumber: '',
    insuranceExpiry: '',
    mcActive: false,
    fmcsaVerified: false,
    serviceAreas: [{ pickup: '', dropoff: '' }],
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateServiceArea = (index, field, value) => {
    const updated = [...formData.serviceAreas];
    updated[index][field] = value;
    setFormData({ ...formData, serviceAreas: updated });
  };

  const addServiceArea = () => {
    setFormData({
      ...formData,
      serviceAreas: [...formData.serviceAreas, { pickup: '', dropoff: '' }]
    });
  };

  const removeServiceArea = (index) => {
    setFormData({
      ...formData,
      serviceAreas: formData.serviceAreas.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.dotNumber || !formData.contactEmail) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    // Get existing carriers
    const existing = JSON.parse(localStorage.getItem('nsla_carriers') || '[]');
    
    // Add new carrier
    const newCarrier = {
      ...formData,
      id: Date.now(),
      registeredDate: new Date().toISOString(),
      previousOrders: []
    };

    existing.push(newCarrier);
    localStorage.setItem('nsla_carriers', JSON.stringify(existing));

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          companyName: '',
          dotNumber: '',
          insuranceExpiry: '',
          mcActive: false,
          fmcsaVerified: false,
          serviceAreas: [{ pickup: '', dropoff: '' }],
          contactName: '',
          contactPhone: '',
          contactEmail: ''
        });
        setSubmitted(false);
      }, 3000);
    }, 800);
  };

  return (
    <>
      <Head>
        <title>NSLA CarShip - Carrier Registration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            padding: 20px;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #0c5ca8 0%, #084380 100%);
            color: white;
            padding: 32px 24px;
            border-radius: 12px;
            margin-bottom: 32px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .form-card {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .form-section {
            margin-bottom: 28px;
            padding-bottom: 24px;
            border-bottom: 1px solid #eee;
          }
          .form-section:last-of-type {
            border-bottom: none;
          }
          .section-title {
            font-size: 15px;
            font-weight: 600;
            color: #0c5ca8;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .form-group {
            margin-bottom: 16px;
          }
          label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
          }
          .required {
            color: #e74c3c;
          }
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="date"] {
            width: 100%;
            padding: 10px 12px;
            border: 1.5px solid #ddd;
            border-radius: 6px;
            font-size: 13px;
            font-family: inherit;
            transition: all 0.2s;
          }
          input:focus {
            outline: none;
            border-color: #0c5ca8;
            background: #f9fbff;
            box-shadow: 0 0 0 3px rgba(12, 92, 168, 0.1);
          }
          .checkbox-group {
            display: flex;
            gap: 20px;
            margin-bottom: 16px;
          }
          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 13px;
          }
          input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
          }
          .service-area {
            background: #f9fbff;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 12px;
            border: 1px solid #e0e8ff;
          }
          .service-area-row {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 10px;
            align-items: flex-end;
          }
          .remove-btn {
            padding: 8px 12px;
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          .remove-btn:hover {
            background: #fdd;
          }
          .add-area-btn {
            padding: 10px 16px;
            background: #f0f6ff;
            color: #0c5ca8;
            border: 1.5px solid #0c5ca8;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
          }
          .add-area-btn:hover {
            background: #e8f0ff;
          }
          .button-group {
            display: flex;
            gap: 12px;
            margin-top: 28px;
          }
          .submit-btn {
            flex: 1;
            padding: 12px;
            background: #0c5ca8;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .submit-btn:hover {
            background: #084380;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(12, 92, 168, 0.3);
          }
          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .success-message {
            background: #e8f8f5;
            color: #27ae60;
            padding: 16px;
            border-radius: 6px;
            border-left: 4px solid #27ae60;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .success-icon {
            font-size: 20px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          @media (max-width: 600px) {
            .grid-2 {
              grid-template-columns: 1fr;
            }
            .service-area-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </Head>

      <div className="container">
        <div className="header">
          <h1>📦 Carrier Registration</h1>
          <p>Join NSLA CarShip's verified carrier network</p>
        </div>

        <div className="form-card">
          {submitted && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <div>
                <strong>Success!</strong> Your company has been registered. You'll appear in our carrier directory immediately.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Company Information */}
            <div className="form-section">
              <div className="section-title">🏢 Company Information</div>
              
              <div className="form-group">
                <label>Company Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., ABC Logistics Inc."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>DOT Number <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., 1234567"
                  value={formData.dotNumber}
                  onChange={(e) => handleInputChange('dotNumber', e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Insurance Expiry Date</label>
                  <input
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                  />
                </div>

                <div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.mcActive}
                        onChange={(e) => handleInputChange('mcActive', e.target.checked)}
                      />
                      MC Active
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.fmcsaVerified}
                        onChange={(e) => handleInputChange('fmcsaVerified', e.target.checked)}
                      />
                      FMCSA Verified
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="form-section">
              <div className="section-title">🗺️ Service Areas</div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Tell us which routes you typically operate</p>
              
              {formData.serviceAreas.map((area, idx) => (
                <div key={idx} className="service-area">
                  <div className="service-area-row">
                    <div>
                      <label style={{ marginBottom: '4px' }}>Pickup Location</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={area.pickup}
                        onChange={(e) => updateServiceArea(idx, 'pickup', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ marginBottom: '4px' }}>Dropoff Location</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={area.dropoff}
                        onChange={(e) => updateServiceArea(idx, 'dropoff', e.target.value)}
                      />
                    </div>
                    {formData.serviceAreas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceArea(idx)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addServiceArea}
                className="add-area-btn"
              >
                + Add Another Route
              </button>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <div className="section-title">📞 Contact Information</div>
              
              <div className="form-group">
                <label>Contact Person Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register as Carrier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
