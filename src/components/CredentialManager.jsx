import React, { useState } from 'react';
import { Save, Key, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { credentialsAPI } from '../lib/api';

export default function CredentialManager({ gtmCredentials, linkedinCredentials, onCredentialSaved }) {
  const [activeForm, setActiveForm] = useState('gtm'); // 'gtm' or 'linkedin'
  const [showSecrets, setShowSecrets] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [gtmForm, setGtmForm] = useState({
    gtmAccountId: '',
    gtmContainerId: '',
    gtmContainerName: '',
    apiKey: '',
  });

  const [linkedinForm, setLinkedinForm] = useState({
    linkedinAdAccountId: '',
    partnerId: '',
    insightTagId: '',
    apiKey: '',
  });

  const handleGtmChange = (e) => {
    setGtmForm({ ...gtmForm, [e.target.name]: e.target.value });
  };

  const handleLinkedinChange = (e) => {
    setLinkedinForm({ ...linkedinForm, [e.target.name]: e.target.value });
  };

  const handleGtmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await credentialsAPI.saveGTM(gtmForm);
      setMessage({ type: 'success', text: 'GTM credentials saved successfully!' });
      setGtmForm({ gtmAccountId: '', gtmContainerId: '', gtmContainerName: '', apiKey: '' });
      setTimeout(() => onCredentialSaved(), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save GTM credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await credentialsAPI.saveLinkedIn(linkedinForm);
      setMessage({ type: 'success', text: 'LinkedIn credentials saved successfully!' });
      setLinkedinForm({ linkedinAdAccountId: '', partnerId: '', insightTagId: '', apiKey: '' });
      setTimeout(() => onCredentialSaved(), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save LinkedIn credentials' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSecretVisibility = (key) => {
    setShowSecrets({ ...showSecrets, [key]: !showSecrets[key] });
  };

  const SecretField = ({ label, name, value, onChange, placeholder, id }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type={showSecrets[id] ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => toggleSecretVisibility(id)}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
        >
          {showSecrets[id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setActiveForm('gtm');
            setMessage(null);
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeForm === 'gtm'
              ? 'bg-purple-500 text-white'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Key className="w-4 h-4 inline mr-2" />
          Google Tag Manager
        </button>
        <button
          onClick={() => {
            setActiveForm('linkedin');
            setMessage(null);
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeForm === 'linkedin'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Key className="w-4 h-4 inline mr-2" />
          LinkedIn
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border flex gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-100">
            {activeForm === 'gtm' ? 'GTM Credentials' : 'LinkedIn Credentials'}
          </h2>

          <form
            onSubmit={activeForm === 'gtm' ? handleGtmSubmit : handleLinkedinSubmit}
            className="space-y-4"
          >
            {activeForm === 'gtm' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">GTM Account ID</label>
                  <input
                    type="text"
                    name="gtmAccountId"
                    value={gtmForm.gtmAccountId}
                    onChange={handleGtmChange}
                    placeholder="e.g., 123456789"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Container ID</label>
                  <input
                    type="text"
                    name="gtmContainerId"
                    value={gtmForm.gtmContainerId}
                    onChange={handleGtmChange}
                    placeholder="GTM-XXXXXXX"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Container Name</label>
                  <input
                    type="text"
                    name="gtmContainerName"
                    value={gtmForm.gtmContainerName}
                    onChange={handleGtmChange}
                    placeholder="e.g., verkko.ai Production"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <SecretField
                  label="API Key (optional)"
                  name="apiKey"
                  value={gtmForm.apiKey}
                  onChange={handleGtmChange}
                  placeholder="Your GTM API key"
                  id="gtm-api-key"
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    LinkedIn Ad Account ID
                  </label>
                  <input
                    type="text"
                    name="linkedinAdAccountId"
                    value={linkedinForm.linkedinAdAccountId}
                    onChange={handleLinkedinChange}
                    placeholder="e.g., 123456789"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Partner ID</label>
                  <input
                    type="text"
                    name="partnerId"
                    value={linkedinForm.partnerId}
                    onChange={handleLinkedinChange}
                    placeholder="From LinkedIn Insight Tag"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Insight Tag ID</label>
                  <input
                    type="text"
                    name="insightTagId"
                    value={linkedinForm.insightTagId}
                    onChange={handleLinkedinChange}
                    placeholder="LinkedIn Insight Tag ID"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <SecretField
                  label="API Key (optional)"
                  name="apiKey"
                  value={linkedinForm.apiKey}
                  onChange={handleLinkedinChange}
                  placeholder="Your LinkedIn API key"
                  id="linkedin-api-key"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Credentials'}
            </button>
          </form>
        </div>

        {/* Saved Credentials */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-100">Saved Credentials</h2>

          {activeForm === 'gtm' ? (
            <div className="space-y-4">
              {gtmCredentials.length > 0 ? (
                gtmCredentials.map((cred) => (
                  <div key={cred.id} className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-100">{cred.gtm_container_name || 'GTM Container'}</div>
                        <div className="text-sm text-slate-400 mt-2 space-y-1">
                          <div>
                            <strong>Container ID:</strong> {cred.gtm_container_id}
                          </div>
                          <div>
                            <strong>Account ID:</strong> {cred.gtm_account_id}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            Saved {new Date(cred.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-700/20 border border-slate-600/30 rounded-lg">
                  <p className="text-slate-400 mb-2">No GTM credentials saved yet</p>
                  <p className="text-xs text-slate-500">Add your GTM Account ID and Container ID above</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {linkedinCredentials.length > 0 ? (
                linkedinCredentials.map((cred) => (
                  <div key={cred.id} className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-100">LinkedIn Ad Account</div>
                        <div className="text-sm text-slate-400 mt-2 space-y-1">
                          <div>
                            <strong>Ad Account ID:</strong> {cred.linkedin_ad_account_id}
                          </div>
                          <div>
                            <strong>Partner ID:</strong> {cred.partner_id}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            Saved {new Date(cred.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-700/20 border border-slate-600/30 rounded-lg">
                  <p className="text-slate-400 mb-2">No LinkedIn credentials saved yet</p>
                  <p className="text-xs text-slate-500">Add your LinkedIn ad account details above</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="font-bold text-blue-300 mb-3">Where to find these credentials?</h3>
        {activeForm === 'gtm' ? (
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              <strong>GTM Account ID & Container ID:</strong> Available in Google Tag Manager dashboard when you create/view your container
            </li>
            <li>
              <strong>Container Name:</strong> Name your container something descriptive like "verkko.ai Production"
            </li>
            <li>
              <strong>API Key:</strong> Optional - only needed if using GTM API for automation
            </li>
          </ul>
        ) : (
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              <strong>LinkedIn Ad Account ID:</strong> Found in Campaign Manager under "Account Settings" → "Account Details"
            </li>
            <li>
              <strong>Partner ID:</strong> Generated when you create a LinkedIn Insight Tag in Campaign Manager
            </li>
            <li>
              <strong>Insight Tag ID:</strong> The unique ID for your Insight Tag in Campaign Manager
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
