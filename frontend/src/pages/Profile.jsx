import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { User, Lock, Shield, CheckCircle, Save, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Profile update state
  const [name, setName] = useState(user?.name || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security update state
  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Name cannot be empty');
      return;
    }

    setIsSavingProfile(true);
    try {
      const result = await updateProfile({ name });
      if (result.success) {
        setProfileSuccess('Profile name updated successfully!');
      } else {
        setProfileError(result.message);
      }
    } catch (err) {
      setProfileError('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSecurityError('');
    setSecuritySuccess('');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    const { oldPassword, password, confirmPassword } = securityData;

    if (!oldPassword || !password || !confirmPassword) {
      setSecurityError('All password fields are required');
      return;
    }

    if (password.length < 6) {
      setSecurityError('New password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setSecurityError('New passwords do not match');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const result = await updateProfile({
        oldPassword,
        password,
      });

      if (result.success) {
        setSecuritySuccess('Password changed successfully!');
        setSecurityData({
          oldPassword: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setSecurityError(result.message);
      }
    } catch (err) {
      setSecurityError('Failed to update password.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="page-header-actions">
        <div>
          <h1>User Profile</h1>
          <p className="subtitle">Manage your account information and login credentials</p>
        </div>
      </div>

      <div className="profile-grid-layout">
        {/* Left Side: General Profile Info & Name Change */}
        <div className="profile-details-column">
          <div className="section-card">
            <div className="card-header flex-header">
              <div className="header-icon-title">
                <User size={22} className="text-indigo" />
                <h3>Personal Information</h3>
              </div>
            </div>
            
            <div className="card-body">
              {profileError && <div className="alert alert-error">{profileError}</div>}
              {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

              <form onSubmit={handleUpdateName} className="profile-name-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="profileEmail">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    id="profileEmail"
                    className="form-input read-only-field"
                    value={user?.email || ''}
                    disabled
                    readOnly
                  />
                  <span className="field-help-text">Email address cannot be changed</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profileName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="profileName"
                    className="form-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setProfileError('');
                    }}
                    disabled={isSavingProfile}
                  />
                </div>

                <div className="profile-meta-info mt-4">
                  <span className="info-label">Account Created:</span>
                  <span className="info-val">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary flex-center-btn mt-6"
                  disabled={isSavingProfile || name === user?.name}
                >
                  <Save size={16} className="btn-icon" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: Password Changes */}
        <div className="profile-security-column">
          <div className="section-card">
            <div className="card-header">
              <div className="header-icon-title">
                <Lock size={22} className="text-rose" />
                <h3>Security Settings</h3>
              </div>
            </div>

            <div className="card-body">
              {securityError && <div className="alert alert-error">{securityError}</div>}
              {securitySuccess && <div className="alert alert-success">{securitySuccess}</div>}

              <form onSubmit={handleUpdatePassword} className="profile-security-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="oldPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={securityData.oldPassword}
                    onChange={handleSecurityChange}
                    disabled={isSavingSecurity}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={securityData.password}
                    onChange={handleSecurityChange}
                    disabled={isSavingSecurity}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm password"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    disabled={isSavingSecurity}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary flex-center-btn mt-6"
                  disabled={isSavingSecurity}
                >
                  <KeyRound size={16} className="btn-icon" />
                  <span>{isSavingSecurity ? 'Changing...' : 'Change Password'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
