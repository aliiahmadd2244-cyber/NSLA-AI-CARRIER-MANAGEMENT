import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // States for adding orders
  const [orderForm, setOrderForm] = useState({
    orderNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
    date: new Date().toISOString().split('T')[0],
    carrierName: ''
  });

  const [matchSearch, setMatchSearch] = useState({ pickup: '', dropoff: '' });
  const [matchedCarriers, setMatchedCarriers] = useState([]);

  // Check authentication
  useEffect(() => {
    const loggedInUser = localStorage.getItem('nsla_user');
    if (!loggedInUser) {
      router.push('/login');
    } else {
      setUser(loggedInUser);
      loadCarriers();
      setLoading(false);
    }
  }, []);

  const loadCarriers = () => {
    const saved = localStorage.getItem('nsla_carriers');
    if (saved) {
      setCarriers(JSON.parse(saved));
    }
  };

  // Smart route matching
  useEffect(() => {
    if (matchSearch.pickup && matchSearch.dropoff) {
      const matched = findSmartMatches(matchSearch.pickup, matchSearch.dropoff);
      setMatchedCarriers(matched);
    } else {
      setMatchedCarriers([]);
    }
  }, [matchSearch, carriers]);

  const findSmartMatches = (pickup, dropoff) => {
    const pickupLower = pickup.toLowerCase();
    const dropoffLower = dropoff.toLowerCase();

    return carriers
      .map(carrier => {
        let score = 0;
        let matchType = '';

        // Check exact route match (highest priority)
        const exactMatch = carrier.serviceAreas?.some(area =>
          area.pickup.toLowerCase().includes(pickupLower) &&
          area.dropoff.toLowerCase().includes(dropoffLower)
        );

        if (exactMatch) {
          score += 100;
          matchType = 'Exact Route Match';
        }

        // Check order history
        const orderMatch = carrier.previousOrders?.filter(order =>
          order.pickupLocation.toLowerCase().includes(pickupLower) &&
          order.dropoffLocation.toLowerCase().includes(dropoffLower)
        )?.length || 0;

        if (orderMatch > 0) {
          score += 50 + (orderMatch * 5);
          matchType = `${orderMatch} Previous Order${orderMatch > 1 ? 's' : ''}`;
        }

        // Check corridor match (partial location)
        const corridorMatch = carrier.serviceAreas?.some(area =>
          area.pickup.toLowerCase().includes(pickupLower) ||
          area.dropoff.toLowerCase().includes(dropoffLower)
        );

        if (corridorMatch && score === 0) {
          score += 30;
          matchType = 'Corridor Match';
        }

        // Check if carrier has done any orders (reliability indicator)
        const orderCount = carrier.previousOrders?.length || 0;
        if (orderCount > 0) {
          score += 5;
        }

        return {
          ...carrier,
          matchScore: score,
          matchType: matchType || 'Service Area Registered',
          orderHistory: orderCount
        };
      })
      .filter(c => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
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
          previousOrders: [...(c.previousOrders || []), { ...orderForm }]
        };
      }
      return c;
    });

    setCarriers(updated);
    localStorage.setItem('nsla_carriers', JSON.stringify(updated));
    setOrderForm({
      orderNumber: '',
      pickupLocation: '',
      dropoffLocation: '',
      date: new Date().toISOString().split('T')[0],
      carrierName: ''
    });
    alert('Order logged successfully! System will learn from this route.');
  };

  const handleLogout = () => {
    localStorage.removeItem('nsla_user');
    localStorage.removeItem('nsla_session');
    router.push('/login');
  };

  const exportCSV = () => {
    const headers = ['Company Name', 'DOT #', 'Insurance Expiry', 'MC Active', 'FMCSA Verified', 'Service Areas', 'Total Orders'];
    const rows = carriers.map(c => [
      c.companyName,
      c.dotNumber,
      c.insuranceExpiry,
      c.mcActive ? 'Yes' : 'No',
      c.fmcsaVerified ? 'Yes' : 'No',
      c.serviceAreas.map(a => `${a.pickup}→${a.dropoff}`).join('; '),
      c.previousOrders?.length || 0
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nsla_carriers_${user}.csv`;
    a.click();
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>NSLA CarShip - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
          }
          .page-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .header {
            background: linear-gradient(135deg, #0c5ca8 0%, #084380 100%);
            color: white;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
          }
          .header-title {
            font-size: 18px;
            font-weight: 600;
          }
          .header-subtitle {
            font-size: 12px;
            opacity: 0.9;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .user-info {
            text-align: right;
            font-size: 13px;
          }
          .logout-btn {
            padding: 8px 16px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          .logout-btn:hover {
            background: rgba(255,255,255,0.3);
          }
          .main-content {
            flex: 1;
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
          .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0;
          }
          .tab-btn {
            background: transparent;
            border: none;
            padding: 12px 16px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            margin-bottom: -2px;
          }
          .tab-btn.active {
            color: #0c5ca8;
            border-bottom-color: #0c5ca8;
          }
          .content-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-card {
            background: linear-gradient(135deg, #f0f6ff 0%, #e8f0ff 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0c5ca8;
          }
          .stat-label {
            font-size: 12px;
            color: #0c5ca8;
            font-weight: 500;
            margin-bottom: 8px;
          }
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #084380;
          }
          .btn {
            padding: 10px 16px;
            background: #0c5ca8;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
          }
          .btn:hover {
            background: #084380;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(12, 92, 168, 0.3);
          }
          .btn-secondary {
            background: #f0f6ff;
            color: #0c5ca8;
            border: 1.5px solid #0c5ca8;
          }
          .btn-secondary:hover {
            background: #e8f0ff;
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
          input[type="text"],
          input[type="date"],
          select {
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
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
          }
          .carrier-card {
            background: white;
            border: 1px solid #e0e0e0;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            transition: all 0.2s;
          }
          .carrier-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .carrier-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 12px;
          }
          .carrier-name {
            font-size: 15px;
            font-weight: 600;
            color: #0c5ca8;
            margin: 0;
          }
          .carrier-dot {
            font-size: 12px;
            color: #666;
            margin: 4px 0 0;
          }
          .badge {
            display: inline-block;
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 12px;
            margin-right: 6px;
            margin-bottom: 6px;
          }
          .badge-verified {
            background: #e8f8f5;
            color: #27ae60;
          }
          .badge-mc {
            background: #fef5e7;
            color: #f39c12;
          }
          .badge-match {
            background: #e8f5e9;
            color: #2e7d32;
            font-weight: 600;
          }
          .match-score {
            font-size: 24px;
            font-weight: 700;
            color: #0c5ca8;
          }
          .no-results {
            text-align: center;
            padding: 40px 20px;
            color: #999;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .search-input {
            width: 100%;
            padding: 10px 12px;
            border: 1.5px solid #ddd;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 16px;
          }
          .order-history {
            background: #f9fbff;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            margin-top: 12px;
          }
          .order-item {
            color: #666;
            margin: 4px 0;
          }
          details {
            margin-top: 12px;
            padding: 12px;
            background: #f9fbff;
            border-radius: 6px;
          }
          summary {
            cursor: pointer;
            font-weight: 500;
            color: #0c5ca8;
            margin-bottom: 12px;
          }
          @media (max-width: 768px) {
            .grid-2, .grid-3 {
              grid-template-columns: 1fr;
            }
            .header {
              flex-direction: column;
              gap: 12px;
              text-align: center;
            }
            .header-right {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </Head>

      <div className="page-wrapper">
        <div className="header">
          <div className="header-left">
            <div className="logo">📦</div>
            <div>
              <div className="header-title">NSLA CarShip</div>
              <div className="header-subtitle">Carrier Management System</div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div style={{ fontSize: '12px', color: '#ccc' }}>Logged in as</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{user}</div>
            </div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="main-content">
          <div className="tabs">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'find-driver', label: '🔍 Find Driver' },
              { id: 'log-order', label: '📋 Log Order' },
              { id: 'directory', label: '👥 Directory' }
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

          <div className="content-card">
            {activeTab === 'dashboard' && (
              <>
                <div className="section-title">📊 Quick Statistics</div>
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
                    <div className="stat-label">Orders Logged</div>
                    <div className="stat-value">{carriers.reduce((acc, c) => acc + (c.previousOrders?.length || 0), 0)}</div>
                  </div>
                </div>
                <button onClick={exportCSV} className="btn btn-secondary" style={{ marginTop: '16px' }}>
                  📥 Export Carrier Database (CSV)
                </button>
              </>
            )}

            {activeTab === 'find-driver' && (
              <>
                <div className="section-title">🔍 Smart Route Matching</div>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                  Enter a pickup and dropoff location. The system will suggest the best carriers based on service areas and order history.
                </p>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Brooklyn, NY"
                      value={matchSearch.pickup}
                      onChange={(e) => setMatchSearch({ ...matchSearch, pickup: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
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
                    <div className="section-title" style={{ marginTop: '24px' }}>
                      ✓ {matchedCarriers.length} Matching Carrier{matchedCarriers.length !== 1 ? 's' : ''}
                    </div>
                    {matchedCarriers.map(carrier => (
                      <div key={carrier.id} className="carrier-card">
                        <div className="carrier-header">
                          <div>
                            <p className="carrier-name">{carrier.companyName}</p>
                            <p className="carrier-dot">DOT: {carrier.dotNumber}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="match-score">{carrier.matchScore}%</div>
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{carrier.matchType}</div>
                          </div>
                        </div>
                        <div>
                          {carrier.fmcsaVerified && <span className="badge badge-verified">✓ FMCSA Verified</span>}
                          {carrier.mcActive && <span className="badge badge-mc">MC Active</span>}
                          {carrier.orderHistory > 0 && <span className="badge badge-match">{carrier.orderHistory} Order{carrier.orderHistory !== 1 ? 's' : ''}</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
                          <strong>Service Areas:</strong> {carrier.serviceAreas?.map(a => `${a.pickup} → ${a.dropoff}`).join(', ') || 'None yet'}
                        </div>
                      </div>
                    ))}
                  </>
                ) : matchSearch.pickup || matchSearch.dropoff ? (
                  <div className="no-results">No matching carriers found for this route</div>
                ) : (
                  <div className="no-results">Enter pickup and dropoff locations to find carriers</div>
                )}
              </>
            )}

            {activeTab === 'log-order' && (
              <>
                <div className="section-title">📋 Log Shipment Order</div>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                  Logging orders helps the system learn carrier routes and make better recommendations.
                </p>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Order Number</label>
                    <input
                      type="text"
                      placeholder="e.g., ORD-12345"
                      value={orderForm.orderNumber}
                      onChange={(e) => setOrderForm({ ...orderForm, orderNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={orderForm.date}
                      onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Brooklyn, NY"
                      value={orderForm.pickupLocation}
                      onChange={(e) => setOrderForm({ ...orderForm, pickupLocation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dropoff Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Miami, FL"
                      value={orderForm.dropoffLocation}
                      onChange={(e) => setOrderForm({ ...orderForm, dropoffLocation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="section-title" style={{ marginTop: '24px' }}>👥 Select Carrier</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  {carriers.length > 0 ? (
                    carriers.map(carrier => (
                      <button
                        key={carrier.id}
                        onClick={() => addOrderToCarrier(carrier.id)}
                        style={{
                          padding: '12px',
                          background: '#f0f6ff',
                          border: '1.5px solid #0c5ca8',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#0c5ca8',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e8f0ff';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f0f6ff';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        {carrier.companyName}
                      </button>
                    ))
                  ) : (
                    <p style={{ color: '#999', gridColumn: '1 / -1' }}>No carriers registered yet</p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'directory' && (
              <>
                <div className="section-title">👥 Carrier Directory</div>
                {carriers.length > 0 ? (
                  carriers.map(carrier => (
                    <div key={carrier.id} className="carrier-card">
                      <div className="carrier-header">
                        <div>
                          <p className="carrier-name">{carrier.companyName}</p>
                          <p className="carrier-dot">DOT: {carrier.dotNumber}</p>
                          {carrier.contactEmail && <p className="carrier-dot">📧 {carrier.contactEmail}</p>}
                        </div>
                      </div>
                      <div>
                        {carrier.fmcsaVerified && <span className="badge badge-verified">✓ FMCSA Verified</span>}
                        {carrier.mcActive && <span className="badge badge-mc">MC Active</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
                        <p><strong>Insurance Expiry:</strong> {carrier.insuranceExpiry || 'Not provided'}</p>
                        <p><strong>Service Routes:</strong> {carrier.serviceAreas?.length || 0}</p>
                        <p><strong>Orders Logged:</strong> {carrier.previousOrders?.length || 0}</p>
                      </div>
                      {carrier.previousOrders && carrier.previousOrders.length > 0 && (
                        <div className="order-history">
                          <strong>Recent Orders:</strong>
                          {carrier.previousOrders.slice(-5).map((order, idx) => (
                            <div key={idx} className="order-item">
                              #{order.orderNumber}: {order.pickupLocation} → {order.dropoffLocation}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    No carriers registered yet. Share the registration link with potential carriers!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
