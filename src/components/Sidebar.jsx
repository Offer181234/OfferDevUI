import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import '../css/Sidebar.css';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'User Manager', icon: 'users', path: '/user-manager' }, // 👈 ADD KIYA
  { label: 'Offers', icon: 'offers', path: '/offers' },
  { label: 'Reports / Logs', icon: 'reports', path: '/reports' },
  { label: 'Affiliates', icon: 'users', path: '/affiliates' },
  { label: 'Advertisers', icon: 'user', path: '/advertisers' },
  { label: 'Fraud Detection', icon: 'shield', path: '/fraud' },
  { label: 'Integration', icon: 'puzzle', path: '/integration' },
  { label: 'Tools', icon: 'tool', path: '/tools' },
  { label: 'Account', icon: 'user', path: '/account' },
  { label: 'Billing', icon: 'wallet', path: '/billing' }
];

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside className={`of-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
      <div className="of-logo-row">
        <h1>Offer18</h1>
      </div>

      {!isCollapsed && <p className="of-user-type">Demo</p>}
      {!isCollapsed && <p className="of-nav-title">Navigation</p>}

      <nav>
        <ul className="of-nav-list">

          {navItems.map((item, index) => (

            <li key={item.label}>

              {/* 👇 Link add kiya */}
              <Link to={item.path} className="of-nav-btn">

                <span className="of-nav-item-main">
                  <Icon name={item.icon} className="of-nav-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </span>

                {!isCollapsed && index !== 0 && (
                  <Icon name="arrowRight" className="of-arrow-icon" />
                )}

              </Link>

            </li>

          ))}

        </ul>
      </nav>

      <div className="of-sidebar-bottom">

        <button type="button" className="of-nav-btn of-secondary-row">
          <span className="of-nav-item-main">
            <Icon name="support" className="of-nav-icon" />
            {!isCollapsed && <span>Support</span>}
          </span>
          {!isCollapsed && <Icon name="arrowRight" className="of-arrow-icon" />}
        </button>

        <button type="button" className="of-nav-btn of-secondary-row">
          <span className="of-nav-item-main">
            <Icon name="settings" className="of-nav-icon" />
            {!isCollapsed && <span>Settings</span>}
          </span>
          {!isCollapsed && <Icon name="arrowRight" className="of-arrow-icon" />}
        </button>

      </div>

      <div className="of-sidebar-foot">
        <div className="of-avatar">D</div>

        {!isCollapsed && (
          <div>
            <strong>DEMO</strong>
            <p>Admin</p>
          </div>
        )}

        {!isCollapsed && (
          <Link to="/login" className="of-exit-link">
            Logout
          </Link>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;