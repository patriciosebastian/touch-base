import './Features.css';

export default function Features () {
  return (
    <div className="features-container">
      <h2 className="features-heading">
        Simplify how you <span className="gradient-text">manage contacts</span>
      </h2>
      
      <div className="features-grid">
        {/* Feature 1 */}
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6BEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="feature-title">Organize Contacts</h3>
          <p className="feature-description">
            Group, edit, and search your contacts for easy access and management.
          </p>
        </div>
        
        {/* Feature 2 */}
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6BEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h3 className="feature-title">CSV Import</h3>
          <p className="feature-description">
            Simply upload your contacts from a CSV file and let us do the rest.
          </p>
        </div>
        
        {/* Feature 3 */}
        <div className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6BEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <h3 className="feature-title">Seamless Emails</h3>
          <p className="feature-description">
            Send emails to individual contacts or groups directly from the app with ease.
          </p>
        </div>
      </div>
    </div>
  );
};
