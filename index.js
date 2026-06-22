import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CarrierSystem() {
  const [carriers, setCarriers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    dotNumber: '',
    insuranceExpiry: '',
    mcActive: false,
    fmcsaVerified: false,
    serviceAreas: [{ pickup: '', dropoff: '' }],
    previousOrders: []
  });
  const [orderForm, setOrderForm] = useState({
    orderNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nsla_carriers');
    if (saved) setCarriers(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nsla_carriers', JSON.stringify(carriers));
  }, [carriers]);

  const addCarrier = () => {
    if (!formData.companyName || !formData.dotNumber) {
      alert('Please fill company name and DOT number');
      return;
    }
    const newCarrier = { ...formData, id: Date.now() };
    setCarriers([...carriers, newCarrier]);
    setFormData({
      companyName: '', dotNumber: '', insuranceExpiry: '', mcActive: false,
      fmcsaVerified: false, serviceAreas: [{ pickup: '', dropoff: '' }], previousOrders: []
    });
    alert('Carrier added successfully!');
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

  const addOrderToCarrier = (carrierId) => {
    if (!orderForm.orderNumber || !orderForm.pickupLocation || !orderForm.dropoffLocation) {
      alert('Please fill all order fields');
      return;
    }
    const updated = carriers.map(c => {
      if (c.id === carrierId) {
        return {
          ...c,
          previousOrders: [...(c.previousOrders || []), orderForm]
        };
      }
      return c;
    });
    setCarriers(updated);
    setOrderForm({ orderNumber: '', pickupLocation: '', dropoffLocation: '', date: new Date().toISOString().split('T')[0] });
    alert('Order added!');
  };

  const deleteCarrier = (id) => {
    if (confirm('Delete this carrier?')) {
      setCarriers(carriers.filter(c => c.id !== id));
    }
  };

  const findMatchingCarriers = (pickupLoc, dropoffLoc) => {
    return carriers.filter(carrier => {
      const hasRoute = carrier.serviceAreas.some(area =>
        area.pickup.toLowerCase().includes(pickupLoc.toLowerCase()) &&
        area.dropoff.toLowerCase().includes(dropoffLoc.toLowerCase())
      );
      const hasOrder = carrier.previousOrders && carrier.previousOrders.some(order =>
        order.pickupLocation.toLowerCase().includes(pickupLoc.toLowerCase()) &&
        order.dropoffLocation.toLowerCase().includes(dropoffLoc.toLowerCase())
      );
      return hasRoute || hasOrder;
    });
  };

  const [matchSearch, setMatchSearch] = useState({ pickup: '', dropoff: '' });
  const matchedCarriers = matchSearch.pickup && matchSearch.dropoff ? findMatchingCarriers(matchSearch.pickup, matchSearch.dropoff) : [];

  const exportCSV = () => {
    const headers = ['Company Name', 'DOT #', 'Insurance Expiry', 'MC Active', 'FMCSA Verified', 'Service Areas', 'Previous Orders'];
    const rows = carriers.map(c => [
      c.companyName,
      c.dotNumber,
      c.insuranceExpiry,
      c.mcActive ? 'Yes' : 'No',
      c.fmcsaVerified ? 'Yes' : 'No',
      c.serviceAreas.map(a => `${a.pickup} → ${a.dropoff}`).join('; '),
      c.previousOrders?.length || 0
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nsla_carriers.csv';
    a.click();
  };

  return (
    <>
      <Head>
        <title>NSLA CarShip - Carrier Management System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #222; }
          .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          h1 { font-size: 28px; margin-bottom: 24px; }
          h2 { font-size: 18px; font-weight: 500; margin-bottom: 16px; }
          h3 { font-size: 16px; font-weight: 500; margin-bottom: 12px; margin-top: 20px; }
          .tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e0e0e0; padding-bottom: 12px; }
          .tab-btn { background: transparent; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
          .tab-btn.active { background: #f0f0f0; color: #222; }
          .tab-btn:hover { background: #f0f0f0; }
          .content { background: white; border-radius: 12px; padding: 20px; }
          .form-group { margin-bottom: 16px; }
          label { font-size: 14px; font-weight: 500; display: block; margin-bottom: 6px; }
          input[type="text"], input[type="date"], select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
          input[type="text"]:focus, input[type="date"]:focus { outline: none; border-color: #4a90e2; background: #f9f9f9; }
          .checkbox-group { display: flex; gap: 16px; margin-bottom: 16px; }
          .checkbox-label { font-size: 14px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
          .service-areas { margin-bottom: 16px; }
          .service-area-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; margin-bottom: 12px; }
          .service-area-row button { padding: 6px 10px; font-size: 12px; }
          .add-area-btn { padding: 8px 12px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 14px; }
          .save-btn { width: 100%; padding: 10px; background: #4a90e2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
          .save-btn:hover { background: #357abd; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
          .stat-card { background: #f5f5f5; padding: 12px; border-radius: 6px; }
          .stat-label { font-size: 12px; color: #666; margin-bottom: 4px; }
          .stat-value { font-size: 24px; font-weight: 500; }
          .export-btn { padding: 8px 16px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 14px; }
          .carrier-card { background: white; border: 1px solid #e0e0e0; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
          .carrier-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
          .carrier-name { font-size: 15px; font-weight: 500; margin: 0; }
          .carrier-dot { font-size: 13px; color: #666; margin: 4px 0 0; }
          .delete-btn { padding: 4px 8px; background: #ffebee; color: #c62828; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
          .badge { font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-right: 6px; }
          .badge-verified { background: #e8f5e9; color: #2e7d32; }
          .badge-mc { background: #e3f2fd; color: #1565c0; }
          .search-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 16px; }
          .no-results { color: #666; text-align: center; padding: 20px; }
          .order-details { font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 6px; margin-top: 8px; }
          .order-history { font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 6px; margin-top: 8px; }
          .order-history p { margin: 4px 0; color: #666; }
          .matched-count { color: #2e7d32; font-weight: 500; margin-bottom: 12px; }
          details { font-size: 13px; margin-bottom: 12px; padding: 8px; background: #f5f5f5; border-radius: 6px; }
          summary { cursor: pointer; font-weight: 500; margin-bottom: 8px; }
          .header { background: white; padding: 20px; border-bottom: 1px solid #e0e0e0; margin-bottom: 24px; }
        `}</style>
      </Head>

      <div className="header">
        <h1>📦 NSLA CarShip - Carrier Management System</h1>
        <p style={{ color: '#666', margin: '8px 0 0' }}>Manage your verified carrier network and find drivers by route</p>
      </div>

      <div className="container">
        <div className="tabs">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'add-carrier', label: '➕ Add Carrier' },
            { id: 'find-driver', label: '🔍 Find Driver' },
            { id: 'directory', label: '📋 Directory' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="content">
          {activeTab === 'dashboard' && (
            <>
              <h2>Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Carriers</div>
                  <div className="stat-value">{carriers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">FMCSA Verified</div>
                  <div className="stat-value">{carriers.filter(c => c.fmcsaVerified).length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Routes</div>
                  <div className="stat-value">{carriers.reduce((acc, c) => acc + (c.serviceAreas?.length || 0), 0)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{carriers.reduce((acc, c) => acc + (c.previousOrders?.length || 0), 0)}</div>
                </div>
              </div>
              <button onClick={exportCSV} className="export-btn">📥 Export All Carriers (CSV)</button>
            </>
          )}

          {activeTab === 'add-carrier' && (
            <>
              <h2>Add New Carrier</h2>
              
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g., ABC Logistics Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>DOT Number *</label>
                <input
                  type="text"
                  placeholder="e.g., 1234567"
                  value={formData.dotNumber}
                  onChange={(e) => setFormData({ ...formData, dotNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Insurance Expiry Date</label>
                <input
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.mcActive}
                    onChange={(e) => setFormData({ ...formData, mcActive: e.target.checked })}
                  />
                  MC Active
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.fmcsaVerified}
                    onChange={(e) => setFormData({ ...formData, fmcsaVerified: e.target.checked })}
                  />
                  FMCSA Verified
                </label>
              </div>

              <h3>Service Areas</h3>
              <div className="service-areas">
                {formData.serviceAreas.map((area, idx) => (
                  <div key={idx} className="service-area-row">
                    <input
                      type="text"
                      placeholder="Pickup location (city/state)"
                      value={area.pickup}
                      onChange={(e) => updateServiceArea(idx, 'pickup', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Dropoff location (city/state)"
                      value={area.dropoff}
                      onChange={(e) => updateServiceArea(idx, 'dropoff', e.target.value)}
                    />
                    <button onClick={() => removeServiceArea(idx)} className="delete-btn">Remove</button>
                  </div>
                ))}
              </div>
              <button onClick={addServiceArea} className="add-area-btn">+ Add Service Area</button>

              <div style={{ marginTop: '24px' }}>
                <button onClick={addCarrier} className="save-btn">Save Carrier</button>
              </div>
            </>
          )}

          {activeTab === 'find-driver' && (
            <>
              <h2>Find Carriers by Route</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label>Pickup Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Brooklyn, NY"
                    value={matchSearch.pickup}
                    onChange={(e) => setMatchSearch({ ...matchSearch, pickup: e.target.value })}
                  />
                </div>
                <div>
                  <label>Dropoff Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Miami, FL"
                    value={matchSearch.dropoff}
                    onChange={(e) => setMatchSearch({ ...matchSearch, dropoff: e.target.value })}
                  />
                </div>
              </div>

              {matchedCarriers.length > 0 ? (
                <>
                  <p className="matched-count">✓ {matchedCarriers.length} matching carrier(s)</p>
                  {matchedCarriers.map(carrier => (
                    <div key={carrier.id} className="carrier-card" onClick={() => setSelectedCarrier(selectedCarrier?.id === carrier.id ? null : carrier)} style={{ cursor: 'pointer' }}>
                      <div className="carrier-header">
                        <div>
                          <p className="carrier-name">{carrier.companyName}</p>
                          <p className="carrier-dot">DOT: {carrier.dotNumber}</p>
                        </div>
                        <div>
                          {carrier.fmcsaVerified && <span className="badge badge-verified">✓ Verified</span>}
                          {carrier.mcActive && <span className="badge badge-mc">MC Active</span>}
                        </div>
                      </div>
                      {selectedCarrier?.id === carrier.id && (
                        <div className="order-details">
                          <p><strong>Insurance Expiry:</strong> {carrier.insuranceExpiry || 'Not set'}</p>
                          <p><strong>Previous Orders:</strong> {carrier.previousOrders?.length || 0}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : matchSearch.pickup || matchSearch.dropoff ? (
                <p className="no-results">No matching carriers found. Try different locations.</p>
              ) : (
                <p className="no-results">Enter pickup and dropoff locations to find carriers.</p>
              )}
            </>
          )}

          {activeTab === 'directory' && (
            <>
              <h2>Carrier Directory</h2>
              <input
                type="text"
                placeholder="Search by company name or DOT number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              {carriers.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.dotNumber.includes(searchTerm)).length > 0 ? (
                carriers.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.dotNumber.includes(searchTerm)).map(carrier => (
                  <div key={carrier.id} className="carrier-card">
                    <div className="carrier-header">
                      <div>
                        <p className="carrier-name">{carrier.companyName}</p>
                        <p className="carrier-dot">DOT: {carrier.dotNumber}</p>
                      </div>
                      <button onClick={() => deleteCarrier(carrier.id)} className="delete-btn">Delete</button>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                      <p>Insurance Expiry: {carrier.insuranceExpiry || 'Not set'}</p>
                      <p>Service Routes: {carrier.serviceAreas?.length || 0}</p>
                      <p>Previous Orders: {carrier.previousOrders?.length || 0}</p>
                    </div>
                    <div>
                      {carrier.fmcsaVerified && <span className="badge badge-verified">✓ FMCSA Verified</span>}
                      {carrier.mcActive && <span className="badge badge-mc">MC Active</span>}
                    </div>

                    <details style={{ marginTop: '12px' }}>
                      <summary>Add Previous Order</summary>
                      <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
                        <input
                          type="text"
                          placeholder="Order #"
                          value={orderForm.orderNumber}
                          onChange={(e) => setOrderForm({ ...orderForm, orderNumber: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Pickup location"
                          value={orderForm.pickupLocation}
                          onChange={(e) => setOrderForm({ ...orderForm, pickupLocation: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Dropoff location"
                          value={orderForm.dropoffLocation}
                          onChange={(e) => setOrderForm({ ...orderForm, dropoffLocation: e.target.value })}
                        />
                        <input
                          type="date"
                          value={orderForm.date}
                          onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })}
                        />
                        <button
                          onClick={() => addOrderToCarrier(carrier.id)}
                          style={{ padding: '6px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                        >
                          Save Order
                        </button>
                      </div>
                    </details>

                    {carrier.previousOrders && carrier.previousOrders.length > 0 && (
                      <div className="order-history">
                        <p style={{ fontWeight: '500', marginBottom: '8px' }}>Order History:</p>
                        {carrier.previousOrders.map((order, idx) => (
                          <p key={idx}>#{order.orderNumber}: {order.pickupLocation} → {order.dropoffLocation} ({order.date})</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-results">No carriers found. Add your first carrier to get started!</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
