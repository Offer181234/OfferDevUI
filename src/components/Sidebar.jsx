import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import '../css/Sidebar.css';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', permission: 'Dashboard' },
  { label: 'Affiliates', icon: 'users', path: '/affiliates', permission: 'Affiliates' },
  { label: 'Advertisers', icon: 'user', path: '/advertisers', permission: 'Advertisers' }
];

const Sidebar = ({ isCollapsed }) => {

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));
console.log(storedUser);
    if (storedUser) {

      setUser(storedUser);

      const permissions = storedUser.permissions || [];

      const allowedMenu = navItems.filter(item =>
        permissions.map(p => p.toLowerCase())
          .includes(item.permission.toLowerCase())
      );

      setMenu(allowedMenu);
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };

  return (

    <aside className={`of-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>

      <div className="of-logo-row">
        <h1>Offer18</h1>
      </div>

      {!isCollapsed && <p className="of-nav-title">Navigation</p>}

      <nav>

        <ul className="of-nav-list">

          {menu.map((item, index) => (

            <li key={item.label}>

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

      {user?.permissions?.includes("UserManagement") && (

        <div className="of-sidebar-bottom">

          <Link to="/user-manager" className="of-nav-btn of-secondary-row">

            <span className="of-nav-item-main">
              <Icon name="users" className="of-nav-icon" />
              {!isCollapsed && <span>User Manager</span>}
            </span>

            {!isCollapsed && (
              <Icon name="arrowRight" className="of-arrow-icon" />
            )}

          </Link>

        </div>

      )}

      <div className="of-sidebar-foot">

        <div className="of-avatar">
          {user ? user.firstName.charAt(0) : "U"}
        </div>

        {!isCollapsed && user && (

          <div>

            <strong>
              {user.firstName} {user.lastName}
            </strong>

            <p>{user.role}</p>

          </div>

        )}

        {!isCollapsed && (

          <Link
            to="/login"
            className="of-exit-link"
            onClick={handleLogout}
          >
            Logout
          </Link>

        )}

      </div>

    </aside>

  );
};

export default Sidebar;