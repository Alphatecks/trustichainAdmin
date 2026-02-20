import React, { useState } from 'react';
import './DisputeDetail.css';

const DEFAULT_EVIDENCE = [
  { title: 'Original Agreement', desc: 'Detailed requirements and specifications', file: 'PDF • 245 KB' },
  { title: 'Final Deliverable', desc: 'Completed deliverable as delivered', file: 'PDF • 245 KB' },
  { title: 'Reference Images', desc: 'Visual examples of desired style', file: '3 images • 245 KB' },
  { title: 'Work Progress Timeline', desc: 'Visual examples of desired style', file: 'PDF • 245 KB' },
  { title: 'Chat Screenshots', desc: 'Initial communication screenshots', file: '4 images • 245 KB' },
  { title: 'Email Communications', desc: 'Email thread showing project discussions', file: 'PDF • 245 KB' },
];

const DEFAULT_TIMELINE = [
  { label: 'Dispute Filed', date: '8 Sept 2025 - 5:42 PM' },
  { label: 'Mediator Assigned', date: '8 Sept 2025 - 5:42 PM' },
  { label: 'Resumed Module 3 - Lesson 3.1', date: '8 Sept 2025 - 5:42 PM' },
  { label: 'Initial Evidence Submitted', date: '8 Sept 2025 - 5:42 PM' },
  { label: 'Mediation Session Started', date: '8 Sept 2025 - 5:42 PM' },
];

const DEFAULT_FINDINGS = [
  'Initial project brief contains conflicting style requirements',
  'Communication gaps identified in early project phases',
  'Delivered work shows professional quality and effort',
  'Both parties acted in good faith during transaction',
];

const DEFAULT_CHAT = [
  { role: 'Seller', name: 'Emma', text: 'Can you share the screenshots and the original brief so we can understand where the miscommunication happened?' },
  { role: 'Mediator', name: 'Jane', text: "I've received the artwork. It doesn't match the agreed style and color scheme. The brief requested a minimalist design with blue tones, but the deliverable is more complex with warm colors." },
];

const DisputeDetail = ({ dispute, onBack }) => {
  const [mediatorOn, setMediatorOn] = useState(true);
  const [message, setMessage] = useState('');
  const caseId = dispute?.caseId || dispute?.id || '#DSP-2024-002';
  const amount = dispute?.amount ?? '$6,000';
  const status = dispute?.status ?? 'In progress';
  const statusClass = (s) => {
    const v = (s || '').toLowerCase();
    if (v === 'in progress') return 'in-progress';
    if (v === 'completed') return 'completed';
    if (v === 'pending') return 'pending';
    return 'in-progress';
  };
  const party1Name = dispute?.party1 ?? 'Sarah Chen';
  const party2Name = dispute?.party2 ?? 'Sarah Chen';
  const claims = dispute?.claims ?? 'Artwork doesn\'t match specifications';
  const mediatorName = dispute?.mediatorName ?? 'Jane Doe';
  const evidence = dispute?.evidence ?? DEFAULT_EVIDENCE;
  const timeline = dispute?.timeline ?? DEFAULT_TIMELINE;
  const findings = dispute?.findings ?? DEFAULT_FINDINGS;
  const chatMessages = dispute?.chatMessages ?? DEFAULT_CHAT;

  return (
    <div className="dr-detail">
      <header className="dr-header">
        <div className="dr-breadcrumb-wrap">
          <button type="button" className="dr-back-link" onClick={onBack} aria-label="Back to list">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Back</span>
          </button>
          <span className="dr-breadcrumb-sep">Admin End &gt; Dispute Resolution</span>
        </div>
        <div className="dr-search">
          <svg className="dr-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search" />
        </div>
        <div className="dr-profile">
          <button type="button" className="dr-notification-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="dr-notification-dot" />
          </button>
          <span className="dr-avatar">SC</span>
          <div className="dr-profile-info">
            <span className="dr-profile-name-row">
              <span className="dr-profile-name">Sarah Chen</span>
              <img src={require('../../assets/images/Frame.png')} alt="" className="dr-verified-badge" />
            </span>
            <span className="dr-profile-role">Freelancer</span>
          </div>
        </div>
      </header>

      <div className="dr-detail-body">
        {/* Top: Parties + Details/Mediator */}
        <div className="dr-detail-top">
          <div className="dr-detail-parties">
            <div className="dr-detail-party dr-detail-party--buyer">
              <div className="dr-detail-party-top">
                <img src={require('../../assets/images/party-avatar.png')} alt="" className="dr-detail-party-avatar-img" />
                <div className="dr-detail-party-info">
                  <div className="dr-detail-party-name">{party1Name}</div>
                  <div className="dr-detail-party-role">Buyer ( me )</div>
                </div>
                <span className="dr-detail-party-pill dr-detail-party-pill--white">Party 1</span>
              </div>
              <div className="dr-detail-party-claims">
                <div className="dr-detail-claims-heading">Claims</div>
                <div className="dr-detail-claims-text">{claims}</div>
              </div>
            </div>
            <div className="dr-detail-party dr-detail-party--seller">
              <div className="dr-detail-party-top">
                <img src={require('../../assets/images/party-avatar.png')} alt="" className="dr-detail-party-avatar-img" />
                <div className="dr-detail-party-info">
                  <div className="dr-detail-party-name-row">
                    <span className="dr-detail-party-name dr-detail-party-name--blue">{party2Name}</span>
                    <img src={require('../../assets/images/Frame.png')} alt="" className="dr-detail-party-check" />
                  </div>
                  <div className="dr-detail-party-role dr-detail-party-role--gray">Seller</div>
                </div>
                <span className="dr-detail-party-pill dr-detail-party-pill--blue">Party 2</span>
              </div>
              <div className="dr-detail-party-claims dr-detail-party-claims--seller">
                <div className="dr-detail-claims-heading dr-detail-claims-heading--blue">Claims</div>
                <div className="dr-detail-claims-text dr-detail-claims-text--gray">{claims}</div>
              </div>
            </div>
          </div>
          <div className="dr-detail-meta">
            <div className="dr-detail-details-card">
              <div className="dr-detail-section-title">
                <span className="dr-section-bar" />
                <span>Details</span>
              </div>
              <div className="dr-detail-meta-stack">
                <span className="dr-detail-meta-label">Status</span>
                <span className={`dr-detail-meta-value dr-detail-status--${statusClass(status)}`}>{status}</span>
              </div>
              <div className="dr-detail-meta-stack">
                <span className="dr-detail-meta-label">Case ID</span>
                <span className="dr-detail-meta-value">{caseId}</span>
              </div>
              <div className="dr-detail-meta-stack">
                <span className="dr-detail-meta-label">Amount</span>
                <span className="dr-detail-meta-value">{amount}</span>
              </div>
            </div>
            <div className="dr-detail-mediator-card">
              <div className="dr-detail-section-title">
                <span className="dr-section-bar" />
                <span>Mediator</span>
              </div>
              <div className="dr-detail-mediator-toggle-row">
                <span className="dr-detail-mediator-toggle-label">Mediator</span>
                <label className="dr-detail-toggle">
                  <input type="checkbox" checked={mediatorOn} onChange={(e) => setMediatorOn(e.target.checked)} />
                  <span className="dr-detail-toggle-slider" />
                </label>
              </div>
              <div className="dr-detail-mediator-details-heading">Mediator Details</div>
              <div className="dr-detail-mediator-detail-row">
                <span className="dr-detail-mediator-detail-label">Name</span>
                <span className="dr-detail-mediator-detail-value">{mediatorName}</span>
              </div>
              <div className="dr-detail-mediator-detail-row">
                <span className="dr-detail-mediator-detail-label">Status</span>
                <span className="dr-detail-mediator-active">
                  <span className="dr-detail-mediator-dot" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence and Timeline side by side */}
        <div className="dr-detail-evidence-timeline-row">
          <section className="dr-detail-section dr-detail-evidence">
            <div className="dr-detail-section-head">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Evidence and documentation</span>
              </div>
              <button type="button" className="dr-detail-add-evidence">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Add New Evidence
              </button>
            </div>
            <div className="dr-detail-evidence-grid">
              {evidence.map((item, i) => (
                <div key={i} className="dr-detail-evidence-item">
                  <div className="dr-detail-evidence-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                    </svg>
                  </div>
                  <div className="dr-detail-evidence-content">
                    <div className="dr-detail-evidence-title">{item.title}</div>
                    <div className="dr-detail-evidence-desc">{item.desc}</div>
                    <div className="dr-detail-evidence-file">{item.file}</div>
                    <span className="dr-detail-evidence-verified">Verified</span>
                  </div>
                  <button type="button" className="dr-detail-evidence-cloud" aria-label="Download">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="dr-detail-evidence-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>All submitted evidence has been verified and is currently under review by the assigned mediator. Additional documentation may be requested if needed.</span>
            </div>
          </section>

          <div className="dr-detail-timeline-verdict-col">
            <section className="dr-detail-section dr-detail-timeline-wrap">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Timeline</span>
              </div>
              <ul className="dr-detail-timeline">
                {timeline.map((item, i) => (
                  <li key={i} className="dr-detail-timeline-item">
                    <span className="dr-detail-timeline-dot" />
                    <div className="dr-detail-timeline-content">
                      <span className="dr-detail-timeline-date">{item.date}</span>
                      <span className="dr-detail-timeline-label">{item.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className="dr-detail-section dr-detail-verdict">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Final Verdict</span>
              </div>
              <p className="dr-detail-verdict-text">Assimilate all evidence given and give a final verdict.</p>
              <button type="button" className="dr-detail-verdict-btn">Give a final Verdict</button>
            </section>
          </div>
        </div>

        {/* Two columns: Assessment (narrow) | Chat (wide) */}
        <div className="dr-detail-bottom-grid">
          <div className="dr-detail-assessment-col">
            <section className="dr-detail-section dr-detail-assessment">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Preliminary Assessment</span>
              </div>
              <div className="dr-detail-findings">
                <div className="dr-detail-findings-title">Key Findings</div>
                <ul className="dr-detail-findings-list">
                  {findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="dr-detail-right-col">
            <section className="dr-detail-section dr-detail-chat">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Dispute Chat {caseId}</span>
              </div>
              <div className="dr-detail-chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="dr-detail-chat-msg-row">
                    <div className="dr-detail-chat-avatar" aria-hidden>{msg.name.charAt(0)}</div>
                    <div className="dr-detail-chat-msg-block">
                      <div className="dr-detail-chat-msg-role">{msg.role}</div>
                      <div className="dr-detail-chat-msg-bubble">
                        <div className="dr-detail-chat-msg-text">{msg.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dr-detail-chat-input-wrap">
                <input
                  type="text"
                  className="dr-detail-chat-input"
                  placeholder="Add message."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="button" className="dr-detail-chat-send" aria-label="Send message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail;
