import React from 'react';
import '../../App.css'

interface PrivacyAgreementProps {
  privacyAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
}

const PrivacyAgreement: React.FC<PrivacyAgreementProps> = ({ privacyAccepted, onPrivacyChange }) => {
  return (
    <div className="agreement-wrapper">
      <input
        type="checkbox"
        id="privacyPolicy"
        checked={privacyAccepted}
        onChange={(e) => onPrivacyChange(e.target.checked)}
        required
      />
      <label htmlFor="privacyPolicy" className="agreement-text">
        You agree to our friendly{' '}
        <span className="agreement-text-underlined">privacy policy</span>
      </label>
    </div>
  );
};

export default PrivacyAgreement;
