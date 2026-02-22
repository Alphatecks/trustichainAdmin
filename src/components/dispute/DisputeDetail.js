import React, { useState, useEffect } from 'react';
import {
  fetchDisputeDetailScreen,
  assignDisputeMediator,
  fetchDisputeEvidence,
  addDisputeEvidence,
  updateDisputeEvidence,
  fetchDisputeTimeline,
  addDisputeTimelineEvent,
  fetchDisputeVerdict,
  submitDisputeVerdict,
  fetchPreliminaryAssessment,
  upsertPreliminaryAssessment,
  fetchDisputeMessages,
  sendDisputeMessage,
} from '../../services/disputeService';
import './DisputeDetail.css';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

const formatFileSize = (bytes) => {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DisputeDetail = ({ dispute, onBack }) => {
  const [mediatorOn, setMediatorOn] = useState(true);
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediatorUserIdInput, setMediatorUserIdInput] = useState('');
  const [assignMediatorLoading, setAssignMediatorLoading] = useState(false);
  const [assignMediatorError, setAssignMediatorError] = useState(null);
  const [evidenceList, setEvidenceList] = useState(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState(null);
  const [addEvidenceOpen, setAddEvidenceOpen] = useState(false);
  const [addEvidenceLoading, setAddEvidenceLoading] = useState(false);
  const [addEvidenceError, setAddEvidenceError] = useState(null);
  const [addEvidenceForm, setAddEvidenceForm] = useState({
    title: '',
    description: '',
    evidenceType: 'other',
    fileUrl: '',
    fileName: '',
    fileType: 'PDF',
    fileSize: '',
  });
  const [updatingEvidenceId, setUpdatingEvidenceId] = useState(null);
  const [timelineList, setTimelineList] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState(null);
  const [addTimelineOpen, setAddTimelineOpen] = useState(false);
  const [addTimelineLoading, setAddTimelineLoading] = useState(false);
  const [addTimelineError, setAddTimelineError] = useState(null);
  const [addTimelineForm, setAddTimelineForm] = useState({ eventType: 'mediation_session_started', title: '', description: '' });
  const [verdictData, setVerdictData] = useState(null);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [verdictError, setVerdictError] = useState(null);
  const [verdictSubmitOpen, setVerdictSubmitOpen] = useState(false);
  const [verdictSubmitLoading, setVerdictSubmitLoading] = useState(false);
  const [verdictSubmitError, setVerdictSubmitError] = useState(null);
  const [verdictForm, setVerdictForm] = useState({ finalVerdict: '', decisionSummary: '', decisionOutcome: 'favor_initiator' });
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);
  const [assessmentEditOpen, setAssessmentEditOpen] = useState(false);
  const [assessmentEditLoading, setAssessmentEditLoading] = useState(false);
  const [assessmentEditError, setAssessmentEditError] = useState(null);
  const [assessmentForm, setAssessmentForm] = useState({ title: '', summary: '', findingsText: '' });
  const [messagesList, setMessagesList] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [sendMessageError, setSendMessageError] = useState(null);

  const caseId = dispute?.caseId || dispute?.id || '';

  const loadEvidence = () => {
    if (!caseId) return;
    setEvidenceLoading(true);
    setEvidenceError(null);
    fetchDisputeEvidence(caseId)
      .then((res) => { if (res?.success && res?.data) setEvidenceList(res.data.evidence || []); })
      .catch((e) => setEvidenceError(e.message || 'Failed to load evidence'))
      .finally(() => setEvidenceLoading(false));
  };

  const loadTimeline = () => {
    if (!caseId) return;
    setTimelineLoading(true);
    setTimelineError(null);
    fetchDisputeTimeline(caseId)
      .then((res) => { if (res?.success && res?.data) setTimelineList(res.data.events || []); })
      .catch((e) => setTimelineError(e.message || 'Failed to load timeline'))
      .finally(() => setTimelineLoading(false));
  };

  const loadVerdict = () => {
    if (!caseId) return;
    setVerdictLoading(true);
    setVerdictError(null);
    fetchDisputeVerdict(caseId)
      .then((res) => { if (res?.success && res?.data) setVerdictData(res.data); })
      .catch((e) => setVerdictError(e.message || 'Failed to load verdict'))
      .finally(() => setVerdictLoading(false));
  };

  const loadAssessment = () => {
    if (!caseId) return;
    setAssessmentLoading(true);
    setAssessmentError(null);
    fetchPreliminaryAssessment(caseId)
      .then((res) => { if (res?.success && res?.data) setAssessmentData(res.data); })
      .catch((e) => setAssessmentError(e.message || 'Failed to load assessment'))
      .finally(() => setAssessmentLoading(false));
  };

  const loadDetail = () => {
    if (!caseId) return;
    fetchDisputeDetailScreen(caseId)
      .then((res) => { if (res?.success && res?.data) setDetail(res.data); })
      .catch(() => {});
  };
  const displayCaseId = detail?.dispute?.caseId || caseId || '—';

  useEffect(() => {
    if (!caseId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDisputeDetailScreen(caseId)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setDetail(res.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load dispute detail');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!caseId) {
      setEvidenceList(null);
      setEvidenceError(null);
      return;
    }
    let cancelled = false;
    setEvidenceLoading(true);
    setEvidenceError(null);
    fetchDisputeEvidence(caseId)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setEvidenceList(res.data.evidence || []);
      })
      .catch((e) => {
        if (!cancelled) setEvidenceError(e.message || 'Failed to load evidence');
      })
      .finally(() => {
        if (!cancelled) setEvidenceLoading(false);
      });
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!caseId) {
      setTimelineList(null);
      setTimelineError(null);
      return;
    }
    let cancelled = false;
    setTimelineLoading(true);
    setTimelineError(null);
    fetchDisputeTimeline(caseId)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setTimelineList(res.data.events || []);
      })
      .catch((e) => {
        if (!cancelled) setTimelineError(e.message || 'Failed to load timeline');
      })
      .finally(() => {
        if (!cancelled) setTimelineLoading(false);
      });
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!caseId) { setVerdictData(null); setVerdictError(null); return; }
    let cancelled = false;
    setVerdictLoading(true);
    setVerdictError(null);
    fetchDisputeVerdict(caseId)
      .then((res) => { if (!cancelled && res?.success && res?.data) setVerdictData(res.data); })
      .catch((e) => { if (!cancelled) setVerdictError(e.message || 'Failed to load verdict'); })
      .finally(() => { if (!cancelled) setVerdictLoading(false); });
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!caseId) { setAssessmentData(null); setAssessmentError(null); return; }
    let cancelled = false;
    setAssessmentLoading(true);
    setAssessmentError(null);
    fetchPreliminaryAssessment(caseId)
      .then((res) => { if (!cancelled && res?.success && res?.data) setAssessmentData(res.data); })
      .catch((e) => { if (!cancelled) setAssessmentError(e.message || 'Failed to load assessment'); })
      .finally(() => { if (!cancelled) setAssessmentLoading(false); });
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!caseId) { setMessagesList(null); setMessagesError(null); return; }
    let cancelled = false;
    setMessagesLoading(true);
    setMessagesError(null);
    fetchDisputeMessages(caseId, 50)
      .then((res) => { if (!cancelled && res?.success && res?.data) setMessagesList(res.data.messages || []); })
      .catch((e) => { if (!cancelled) setMessagesError(e.message || 'Failed to load messages'); })
      .finally(() => { if (!cancelled) setMessagesLoading(false); });
    return () => { cancelled = true; };
  }, [caseId]);

  const statusClass = (s) => {
    const v = (s || '').toLowerCase();
    if (v === 'in progress' || v === 'active') return 'in-progress';
    if (v === 'completed' || v === 'resolved') return 'completed';
    if (v === 'pending') return 'pending';
    return 'in-progress';
  };

  const d = detail?.dispute;
  const party1 = detail?.party1 || d?.party1;
  const party2 = detail?.party2 || d?.party2;
  const party1Name = ((typeof party1 === 'object' ? party1?.name : party1) || dispute?.party1) ?? '—';
  const party2Name = ((typeof party2 === 'object' ? party2?.name : party2) || dispute?.party2) ?? '—';
  const party1Claims = detail?.party1?.claims ?? d?.party1Claims ?? d?.reason ?? '—';
  const party2Claims = detail?.party2?.claims ?? d?.party2Claims ?? d?.reason ?? '—';
  const mediatorName = detail?.mediator?.name ?? '—';
  const amount = d?.amountUsd != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(d.amountUsd) : (dispute?.amount ?? '—');
  const status = d?.statusLabel ?? d?.status ?? dispute?.status ?? '—';

  const evidenceFromApi = evidenceList !== null ? evidenceList : (detail?.evidence || []);
  const evidence = evidenceFromApi.map((ev) => ({
    id: ev.id,
    title: ev.title,
    desc: ev.description || '',
    file: [ev.fileType, ev.fileSize != null ? formatFileSize(ev.fileSize) : ''].filter(Boolean).join(' • ') || (ev.fileName || ''),
    verified: ev.verified,
    fileUrl: ev.fileUrl,
  }));

  const timelineFromApi = timelineList !== null ? timelineList : (detail?.timeline || []);
  const timeline = timelineFromApi.map((t) => ({
    id: t.id,
    label: t.title,
    date: formatDate(t.eventTimestamp || t.createdAt),
    createdByName: t.createdByName,
  }));

  const assessmentSource = assessmentData !== null ? assessmentData : detail?.preliminaryAssessment;
  const findings = (assessmentSource?.findings || []).map((f) => (typeof f === 'object' ? f.findingText : f)).filter(Boolean);

  const messagesSource = messagesList !== null ? messagesList : (detail?.messages || []);
  const chatMessages = messagesSource.map((m) => ({
    role: m.senderRole || 'User',
    name: m.senderName || '—',
    text: m.messageText || '',
  }));
  const verdictSource = verdictData !== null ? verdictData : detail?.verdict;
  const hasVerdict = verdictSource?.status === 'decision_made' || verdictSource?.finalVerdict != null || verdictSource?.decisionSummary;

  if (loading) {
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
        </header>
        <div className="dr-detail-loading">Loading dispute details…</div>
      </div>
    );
  }

  if (error) {
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
        </header>
        <div className="dr-detail-error">{error}</div>
      </div>
    );
  }

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
                  <div className="dr-detail-party-role">{detail?.party1?.role ? String(detail.party1.role).charAt(0).toUpperCase() + detail.party1.role.slice(1) : 'Buyer'} ( me )</div>
                </div>
                <span className="dr-detail-party-pill dr-detail-party-pill--white">Party 1</span>
              </div>
              <div className="dr-detail-party-claims">
                <div className="dr-detail-claims-heading">Claims</div>
                <div className="dr-detail-claims-text">{party1Claims}</div>
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
                  <div className="dr-detail-party-role dr-detail-party-role--gray">{detail?.party2?.role ? String(detail.party2.role).charAt(0).toUpperCase() + detail.party2.role.slice(1) : 'Seller'}</div>
                </div>
                <span className="dr-detail-party-pill dr-detail-party-pill--blue">Party 2</span>
              </div>
              <div className="dr-detail-party-claims dr-detail-party-claims--seller">
                <div className="dr-detail-claims-heading dr-detail-claims-heading--blue">Claims</div>
                <div className="dr-detail-claims-text dr-detail-claims-text--gray">{party2Claims}</div>
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
                <span className="dr-detail-meta-value">{displayCaseId}</span>
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
                  <span className="dr-detail-mediator-dot" /> {detail?.mediator?.status ? String(detail.mediator.status).charAt(0).toUpperCase() + detail.mediator.status.slice(1) : 'Active'}
                </span>
              </div>
              <div className="dr-detail-assign-mediator">
                <div className="dr-detail-mediator-details-heading">Assign mediator</div>
                <div className="dr-detail-assign-mediator-row">
                  <input
                    type="text"
                    className="dr-detail-assign-mediator-input"
                    placeholder="Mediator user ID (UUID)"
                    value={mediatorUserIdInput}
                    onChange={(e) => setMediatorUserIdInput(e.target.value)}
                    disabled={assignMediatorLoading}
                  />
                  <button
                    type="button"
                    className="dr-detail-assign-mediator-btn"
                    disabled={assignMediatorLoading || !mediatorUserIdInput.trim()}
                    onClick={() => {
                      const userId = mediatorUserIdInput.trim();
                      if (!caseId || !userId) return;
                      setAssignMediatorError(null);
                      setAssignMediatorLoading(true);
                      assignDisputeMediator(caseId, userId)
                        .then(() => {
                          setMediatorUserIdInput('');
                          loadDetail();
                        })
                        .catch((e) => setAssignMediatorError(e.message || 'Failed to assign mediator'))
                        .finally(() => setAssignMediatorLoading(false));
                    }}
                  >
                    {assignMediatorLoading ? 'Assigning…' : 'Assign'}
                  </button>
                </div>
                {assignMediatorError && <div className="dr-detail-assign-mediator-error">{assignMediatorError}</div>}
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
              <button
                type="button"
                className="dr-detail-add-evidence"
                onClick={() => {
                  setAddEvidenceError(null);
                  setAddEvidenceForm({ title: '', description: '', evidenceType: 'other', fileUrl: '', fileName: '', fileType: 'PDF', fileSize: '' });
                  setAddEvidenceOpen(true);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Add New Evidence
              </button>
            </div>
            <div className="dr-detail-evidence-grid">
              {evidenceLoading && <div className="dr-detail-evidence-empty">Loading evidence…</div>}
              {!evidenceLoading && evidenceError && <div className="dr-detail-evidence-empty dr-detail-evidence-error">{evidenceError}</div>}
              {!evidenceLoading && !evidenceError && evidence.length === 0 && <div className="dr-detail-evidence-empty">No evidence submitted yet.</div>}
              {!evidenceLoading && !evidenceError && evidence.map((item, i) => (
                <div key={item.id || i} className="dr-detail-evidence-item">
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
                    <div className="dr-detail-evidence-verified-row">
                      {item.verified !== false ? (
                        <span className="dr-detail-evidence-verified">Verified</span>
                      ) : (
                        <span className="dr-detail-evidence-not-verified">Not verified</span>
                      )}
                      {item.id && (
                        <button
                          type="button"
                          className="dr-detail-evidence-set-verified-btn"
                          disabled={updatingEvidenceId === item.id}
                          onClick={() => {
                            if (!caseId || !item.id) return;
                            setUpdatingEvidenceId(item.id);
                            updateDisputeEvidence(caseId, item.id, { verified: item.verified !== false ? false : true })
                              .then(() => loadEvidence())
                              .catch(() => {})
                              .finally(() => setUpdatingEvidenceId(null));
                          }}
                          title={item.verified !== false ? 'Mark as not verified' : 'Mark as verified'}
                        >
                          {updatingEvidenceId === item.id ? '…' : item.verified !== false ? 'Unverify' : 'Set verified'}
                        </button>
                      )}
                    </div>
                  </div>
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="dr-detail-evidence-cloud" aria-label="Download">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </a>
                  )}
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
              <div className="dr-detail-section-head dr-detail-timeline-head">
                <div className="dr-section-title">
                  <span className="dr-section-bar" />
                  <span>Timeline</span>
                </div>
                <button type="button" className="dr-detail-add-timeline-btn" onClick={() => { setAddTimelineError(null); setAddTimelineForm({ eventType: 'mediation_session_started', title: '', description: '' }); setAddTimelineOpen(true); }}>
                  Add event
                </button>
              </div>
              <ul className="dr-detail-timeline">
                {timelineLoading && <li className="dr-detail-timeline-item">Loading timeline…</li>}
                {!timelineLoading && timelineError && <li className="dr-detail-timeline-item dr-detail-timeline-error">{timelineError}</li>}
                {!timelineLoading && !timelineError && timeline.length === 0 && <li className="dr-detail-timeline-item">No timeline events yet.</li>}
                {!timelineLoading && !timelineError && timeline.map((item, i) => (
                  <li key={item.id || i} className="dr-detail-timeline-item">
                    <span className="dr-detail-timeline-dot" />
                    <div className="dr-detail-timeline-content">
                      <span className="dr-detail-timeline-date">{item.date}</span>
                      <span className="dr-detail-timeline-label">{item.label}</span>
                      {item.createdByName && <span className="dr-detail-timeline-by">{item.createdByName}</span>}
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
              {verdictLoading && <p className="dr-detail-verdict-text">Loading verdict…</p>}
              {!verdictLoading && verdictError && <p className="dr-detail-verdict-text dr-detail-verdict-error">{verdictError}</p>}
              {!verdictLoading && !verdictError && hasVerdict && (
                <div className="dr-detail-verdict-content">
                  {verdictSource.decisionSummary && <p className="dr-detail-verdict-text">{verdictSource.decisionSummary}</p>}
                  {verdictSource.finalVerdict != null && <p className="dr-detail-verdict-outcome">{verdictSource.finalVerdict}</p>}
                  {verdictSource.decisionOutcome && <p className="dr-detail-verdict-outcome-label">Outcome: {verdictSource.decisionOutcome}</p>}
                  {verdictSource.decisionDate && <p className="dr-detail-verdict-date">Decision date: {formatDate(verdictSource.decisionDate)}</p>}
                </div>
              )}
              {!verdictLoading && !verdictError && !hasVerdict && (
                <>
                  <p className="dr-detail-verdict-text">Assimilate all evidence given and give a final verdict.</p>
                  <button type="button" className="dr-detail-verdict-btn" onClick={() => { setVerdictSubmitError(null); setVerdictForm({ finalVerdict: '', decisionSummary: '', decisionOutcome: 'favor_initiator' }); setVerdictSubmitOpen(true); }}>Give a final Verdict</button>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Two columns: Assessment (narrow) | Chat (wide) */}
        <div className="dr-detail-bottom-grid">
          <div className="dr-detail-assessment-col">
            <section className="dr-detail-section dr-detail-assessment">
              <div className="dr-detail-section-head dr-detail-assessment-head">
                <div className="dr-section-title">
                  <span className="dr-section-bar" />
                  <span>Preliminary Assessment</span>
                </div>
                <button type="button" className="dr-detail-edit-assessment-btn" onClick={() => {
                  const a = assessmentData || detail?.preliminaryAssessment;
                  const findingsArr = (a?.findings || []).map((f) => (typeof f === 'object' ? f.findingText : f)).filter(Boolean);
                  setAssessmentEditError(null);
                  setAssessmentForm({ title: a?.title || 'Preliminary Assessment', summary: a?.summary || '', findingsText: findingsArr.join('\n') });
                  setAssessmentEditOpen(true);
                }}>Edit</button>
              </div>
              {assessmentLoading && <p className="dr-detail-findings-empty">Loading assessment…</p>}
              {!assessmentLoading && assessmentError && <p className="dr-detail-findings-empty dr-detail-assessment-error">{assessmentError}</p>}
              {!assessmentLoading && !assessmentError && (
                <div className="dr-detail-findings">
                  <div className="dr-detail-findings-title">Key Findings</div>
                  {findings.length === 0 && <p className="dr-detail-findings-empty">No findings yet.</p>}
                  <ul className="dr-detail-findings-list">
                    {findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          <div className="dr-detail-right-col">
            <section className="dr-detail-section dr-detail-chat">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Dispute Chat {displayCaseId}</span>
              </div>
              <div className="dr-detail-chat-messages">
                {messagesLoading && <p className="dr-detail-chat-empty">Loading messages…</p>}
                {!messagesLoading && messagesError && <p className="dr-detail-chat-empty dr-detail-chat-error">{messagesError}</p>}
                {!messagesLoading && !messagesError && chatMessages.length === 0 && <p className="dr-detail-chat-empty">No messages yet.</p>}
                {!messagesLoading && !messagesError && chatMessages.map((msg, i) => (
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
                  placeholder={sendMessageLoading ? 'Sending…' : 'Add message.'}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (sendMessageError) setSendMessageError(null);
                  }}
                  disabled={sendMessageLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const text = message.trim();
                      if (!caseId || !text || sendMessageLoading) return;
                      setSendMessageError(null);
                      setSendMessageLoading(true);
                      setMessage('');
                      const optimisticMessage = { _optimistic: true, _tempId: Date.now(), senderRole: 'mediator', senderName: 'You', messageText: text };
                      setMessagesList((prev) => [...(prev || []), optimisticMessage]);
                      sendDisputeMessage(caseId, { messageText: text, senderRole: 'mediator' })
                        .then(() => {})
                        .catch((err) => {
                          setSendMessageError(err?.message || 'Failed to send message');
                          setMessagesList((prev) => (prev || []).filter((m) => !m._optimistic));
                          setMessage(text);
                        })
                        .finally(() => setSendMessageLoading(false));
                    }
                  }}
                />
                <button
                  type="button"
                  className="dr-detail-chat-send"
                  aria-label="Send message"
                  disabled={sendMessageLoading || !message.trim()}
                  onClick={() => {
                    const text = message.trim();
                    if (!caseId || !text || sendMessageLoading) return;
                    setSendMessageError(null);
                    setSendMessageLoading(true);
                    setMessage('');
                    const optimisticMessage = { _optimistic: true, _tempId: Date.now(), senderRole: 'mediator', senderName: 'You', messageText: text };
                    setMessagesList((prev) => [...(prev || []), optimisticMessage]);
                    sendDisputeMessage(caseId, { messageText: text, senderRole: 'mediator' })
                      .then(() => {})
                      .catch((err) => {
                        setSendMessageError(err?.message || 'Failed to send message');
                        setMessagesList((prev) => (prev || []).filter((m) => !m._optimistic));
                        setMessage(text);
                      })
                      .finally(() => setSendMessageLoading(false));
                  }}
                >
                  {sendMessageLoading ? (
                    <span className="dr-detail-chat-send-spinner" aria-hidden />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                </button>
                {sendMessageError && (
                  <p className="dr-detail-chat-send-error" role="alert">{sendMessageError}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Evidence modal */}
      {addEvidenceOpen && (
        <div className="dr-add-evidence-overlay" role="dialog" aria-modal="true" aria-labelledby="dr-add-evidence-title">
          <div className="dr-add-evidence-modal">
            <div className="dr-add-evidence-header">
              <h2 id="dr-add-evidence-title">Add New Evidence</h2>
              <button type="button" className="dr-add-evidence-close" onClick={() => setAddEvidenceOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form
              className="dr-add-evidence-form"
              onSubmit={(e) => {
                e.preventDefault();
                const title = (addEvidenceForm.title || '').trim();
                if (!title) {
                  setAddEvidenceError('Title is required.');
                  return;
                }
                setAddEvidenceError(null);
                setAddEvidenceLoading(true);
                const fileSizeNum = addEvidenceForm.fileSize ? parseInt(addEvidenceForm.fileSize, 10) : undefined;
                const body = {
                  title,
                  description: (addEvidenceForm.description || '').trim() || undefined,
                  evidenceType: addEvidenceForm.evidenceType || 'other',
                  fileUrl: (addEvidenceForm.fileUrl || '').trim() || undefined,
                  fileName: (addEvidenceForm.fileName || '').trim() || undefined,
                  fileType: (addEvidenceForm.fileType || 'PDF').trim() || undefined,
                  fileSize: Number.isInteger(fileSizeNum) && fileSizeNum >= 0 ? fileSizeNum : undefined,
                };
                addDisputeEvidence(caseId, body)
                  .then(() => {
                    setAddEvidenceOpen(false);
                    setAddEvidenceForm({ title: '', description: '', evidenceType: 'other', fileUrl: '', fileName: '', fileType: 'PDF', fileSize: '' });
                    loadEvidence();
                  })
                  .catch((e) => setAddEvidenceError(e.message || 'Failed to add evidence'))
                  .finally(() => setAddEvidenceLoading(false));
              }}
            >
              <label className="dr-add-evidence-label">
                Title <span className="dr-add-evidence-required">*</span>
              </label>
              <input
                type="text"
                className="dr-add-evidence-input"
                value={addEvidenceForm.title}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Chat Screenshots"
                required
              />
              <label className="dr-add-evidence-label">Description</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={addEvidenceForm.description}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Conversation with client"
                rows={3}
              />
              <label className="dr-add-evidence-label">Evidence type</label>
              <select
                className="dr-add-evidence-input dr-add-evidence-select"
                value={addEvidenceForm.evidenceType}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, evidenceType: e.target.value }))}
              >
                <option value="original_agreement">Original agreement</option>
                <option value="chat_screenshots">Chat screenshots</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </select>
              <label className="dr-add-evidence-label">File URL</label>
              <input
                type="url"
                className="dr-add-evidence-input"
                value={addEvidenceForm.fileUrl}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, fileUrl: e.target.value }))}
                placeholder="https://storage.../file.pdf"
              />
              <label className="dr-add-evidence-label">File name</label>
              <input
                type="text"
                className="dr-add-evidence-input"
                value={addEvidenceForm.fileName}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, fileName: e.target.value }))}
                placeholder="e.g. chats.pdf"
              />
              <label className="dr-add-evidence-label">File type</label>
              <input
                type="text"
                className="dr-add-evidence-input"
                value={addEvidenceForm.fileType}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, fileType: e.target.value }))}
                placeholder="PDF"
              />
              <label className="dr-add-evidence-label">File size (bytes)</label>
              <input
                type="number"
                min={0}
                className="dr-add-evidence-input"
                value={addEvidenceForm.fileSize}
                onChange={(e) => setAddEvidenceForm((f) => ({ ...f, fileSize: e.target.value }))}
                placeholder="e.g. 102400"
              />
              {addEvidenceError && <div className="dr-add-evidence-error">{addEvidenceError}</div>}
              <div className="dr-add-evidence-actions">
                <button type="button" className="dr-add-evidence-cancel" onClick={() => setAddEvidenceOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dr-add-evidence-submit" disabled={addEvidenceLoading}>
                  {addEvidenceLoading ? 'Adding…' : 'Add Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Timeline Event modal */}
      {addTimelineOpen && (
        <div className="dr-add-evidence-overlay" role="dialog" aria-modal="true" aria-labelledby="dr-add-timeline-title">
          <div className="dr-add-evidence-modal">
            <div className="dr-add-evidence-header">
              <h2 id="dr-add-timeline-title">Add Timeline Event</h2>
              <button type="button" className="dr-add-evidence-close" onClick={() => setAddTimelineOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form
              className="dr-add-evidence-form"
              onSubmit={(e) => {
                e.preventDefault();
                const title = (addTimelineForm.title || '').trim();
                if (!title) { setAddTimelineError('Title is required.'); return; }
                setAddTimelineError(null);
                setAddTimelineLoading(true);
                addDisputeTimelineEvent(caseId, {
                  eventType: addTimelineForm.eventType || 'mediation_session_started',
                  title,
                  description: (addTimelineForm.description || '').trim() || undefined,
                })
                  .then(() => { setAddTimelineOpen(false); setAddTimelineForm({ eventType: 'mediation_session_started', title: '', description: '' }); loadTimeline(); })
                  .catch((err) => setAddTimelineError(err.message || 'Failed to add event'))
                  .finally(() => setAddTimelineLoading(false));
              }}
            >
              <label className="dr-add-evidence-label">Event type</label>
              <select
                className="dr-add-evidence-input dr-add-evidence-select"
                value={addTimelineForm.eventType}
                onChange={(e) => setAddTimelineForm((f) => ({ ...f, eventType: e.target.value }))}
              >
                <option value="evidence_submitted">Evidence submitted</option>
                <option value="dispute_filed">Dispute filed</option>
                <option value="mediation_session_started">Mediation session started</option>
                <option value="mediation_session_ended">Mediation session ended</option>
                <option value="verdict_issued">Verdict issued</option>
                <option value="other">Other</option>
              </select>
              <label className="dr-add-evidence-label">Title *</label>
              <input
                type="text"
                className="dr-add-evidence-input"
                value={addTimelineForm.title}
                onChange={(e) => setAddTimelineForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Mediation Session Started"
                required
              />
              <label className="dr-add-evidence-label">Description</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={addTimelineForm.description}
                onChange={(e) => setAddTimelineForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Video call with both parties"
                rows={3}
              />
              {addTimelineError && <div className="dr-add-evidence-error">{addTimelineError}</div>}
              <div className="dr-add-evidence-actions">
                <button type="button" className="dr-add-evidence-cancel" onClick={() => setAddTimelineOpen(false)}>Cancel</button>
                <button type="submit" className="dr-add-evidence-submit" disabled={addTimelineLoading}>{addTimelineLoading ? 'Adding…' : 'Add Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Verdict modal */}
      {verdictSubmitOpen && (
        <div className="dr-add-evidence-overlay" role="dialog" aria-modal="true" aria-labelledby="dr-verdict-title">
          <div className="dr-add-evidence-modal">
            <div className="dr-add-evidence-header">
              <h2 id="dr-verdict-title">Submit Final Verdict</h2>
              <button type="button" className="dr-add-evidence-close" onClick={() => setVerdictSubmitOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form
              className="dr-add-evidence-form"
              onSubmit={(e) => {
                e.preventDefault();
                const finalVerdict = (verdictForm.finalVerdict || '').trim();
                const decisionSummary = (verdictForm.decisionSummary || '').trim();
                if (!finalVerdict) { setVerdictSubmitError('Final verdict is required.'); return; }
                setVerdictSubmitError(null);
                setVerdictSubmitLoading(true);
                submitDisputeVerdict(caseId, {
                  finalVerdict,
                  decisionSummary: decisionSummary || undefined,
                  decisionOutcome: verdictForm.decisionOutcome || 'favor_initiator',
                })
                  .then(() => { setVerdictSubmitOpen(false); setVerdictForm({ finalVerdict: '', decisionSummary: '', decisionOutcome: 'favor_initiator' }); loadVerdict(); })
                  .catch((err) => setVerdictSubmitError(err.message || 'Failed to submit verdict'))
                  .finally(() => setVerdictSubmitLoading(false));
              }}
            >
              <label className="dr-add-evidence-label">Final verdict *</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={verdictForm.finalVerdict}
                onChange={(e) => setVerdictForm((f) => ({ ...f, finalVerdict: e.target.value }))}
                placeholder="e.g. In favor of the buyer. Seller to refund 50%..."
                rows={3}
                required
              />
              <label className="dr-add-evidence-label">Decision summary</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={verdictForm.decisionSummary}
                onChange={(e) => setVerdictForm((f) => ({ ...f, decisionSummary: e.target.value }))}
                placeholder="e.g. Conflicting brief; partial refund and revision ordered."
                rows={2}
              />
              <label className="dr-add-evidence-label">Decision outcome</label>
              <select
                className="dr-add-evidence-input dr-add-evidence-select"
                value={verdictForm.decisionOutcome}
                onChange={(e) => setVerdictForm((f) => ({ ...f, decisionOutcome: e.target.value }))}
              >
                <option value="favor_initiator">Favor initiator</option>
                <option value="favor_respondent">Favor respondent</option>
                <option value="split">Split</option>
                <option value="dismissed">Dismissed</option>
              </select>
              {verdictSubmitError && <div className="dr-add-evidence-error">{verdictSubmitError}</div>}
              <div className="dr-add-evidence-actions">
                <button type="button" className="dr-add-evidence-cancel" onClick={() => setVerdictSubmitOpen(false)}>Cancel</button>
                <button type="submit" className="dr-add-evidence-submit" disabled={verdictSubmitLoading}>{verdictSubmitLoading ? 'Submitting…' : 'Submit Verdict'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Preliminary Assessment modal */}
      {assessmentEditOpen && (
        <div className="dr-add-evidence-overlay" role="dialog" aria-modal="true" aria-labelledby="dr-assessment-title">
          <div className="dr-add-evidence-modal">
            <div className="dr-add-evidence-header">
              <h2 id="dr-assessment-title">Edit Preliminary Assessment</h2>
              <button type="button" className="dr-add-evidence-close" onClick={() => setAssessmentEditOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form
              className="dr-add-evidence-form"
              onSubmit={(e) => {
                e.preventDefault();
                setAssessmentEditError(null);
                setAssessmentEditLoading(true);
                const findingsText = (assessmentForm.findingsText || '').trim();
                const findings = findingsText ? findingsText.split('\n').map((t) => t.trim()).filter(Boolean).map((findingText, orderIndex) => ({ findingText, findingType: 'observation', orderIndex })) : [];
                upsertPreliminaryAssessment(caseId, {
                  title: (assessmentForm.title || '').trim() || 'Preliminary Assessment',
                  summary: (assessmentForm.summary || '').trim() || undefined,
                  findings,
                })
                  .then(() => { setAssessmentEditOpen(false); loadAssessment(); })
                  .catch((err) => setAssessmentEditError(err.message || 'Failed to save assessment'))
                  .finally(() => setAssessmentEditLoading(false));
              }}
            >
              <label className="dr-add-evidence-label">Title</label>
              <input
                type="text"
                className="dr-add-evidence-input"
                value={assessmentForm.title}
                onChange={(e) => setAssessmentForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Preliminary Assessment"
              />
              <label className="dr-add-evidence-label">Summary</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={assessmentForm.summary}
                onChange={(e) => setAssessmentForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="Key findings from evidence review."
                rows={2}
              />
              <label className="dr-add-evidence-label">Findings (one per line)</label>
              <textarea
                className="dr-add-evidence-input dr-add-evidence-textarea"
                value={assessmentForm.findingsText}
                onChange={(e) => setAssessmentForm((f) => ({ ...f, findingsText: e.target.value }))}
                placeholder="Initial project brief contains conflicting style requirements"
                rows={5}
              />
              {assessmentEditError && <div className="dr-add-evidence-error">{assessmentEditError}</div>}
              <div className="dr-add-evidence-actions">
                <button type="button" className="dr-add-evidence-cancel" onClick={() => setAssessmentEditOpen(false)}>Cancel</button>
                <button type="submit" className="dr-add-evidence-submit" disabled={assessmentEditLoading}>{assessmentEditLoading ? 'Saving…' : 'Save Assessment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeDetail;
