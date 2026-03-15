(function () {
  const ROLE_STORAGE_KEY = 'rwf-lms-mockup-role';
  const roles = {
    admin: {
      label: 'Admin',
      initials: 'VA',
      userName: 'Vijay Anand',
      landingPage: '02-admin-dashboard.html'
    },
    officeCoordinator: {
      label: 'Office Coordinator',
      initials: 'RP',
      userName: 'Rekha Pandey',
      landingPage: '08-oc-dashboard.html'
    },
    trainer: {
      label: 'Trainer',
      initials: 'SK',
      userName: 'Suman Kumari',
      landingPage: '21-trainer-dashboard.html'
    }
  };

  const pages = {
    '02-admin-dashboard.html': { screenId: 'adminDashboard', defaultRole: 'admin' },
    '03-course-management.html': { screenId: 'courseManagement', defaultRole: 'admin' },
    '04-add-course-modal.html': { screenId: 'courseManagement', defaultRole: 'admin' },
    '05-batch-management.html': { screenId: 'batchManagement', defaultRole: 'admin' },
    '05b-create-batch-modal.html': { screenId: 'batchManagement', defaultRole: 'admin' },
    '06-batch-detail.html': { screenId: 'batchManagement', defaultRole: 'admin' },
    '07-user-management.html': { screenId: 'userManagement', defaultRole: 'admin' },
    '07b-add-office-coordinator.html': { screenId: 'userManagement', defaultRole: 'admin' },
    '07c-add-trainer.html': { screenId: 'userManagement', defaultRole: 'admin' },
    '08-oc-dashboard.html': { screenId: 'ocDashboard', defaultRole: 'officeCoordinator' },
    '09-application-wizard.html': { screenId: 'applicationEntry', defaultRole: 'officeCoordinator' },
    '14-candidate-list.html': { screenId: 'candidateList', defaultRole: 'officeCoordinator' },
    '15-candidate-profile.html': { screenId: 'candidateProfile', defaultRole: 'officeCoordinator' },
    '16-attendance.html': { screenId: 'attendance', defaultRole: 'trainer' },
    '17-assessment-entry.html': { screenId: 'assessmentEntry', defaultRole: 'trainer' },
    '18-assessment-results.html': { screenId: 'assessmentResults', defaultRole: 'admin', activeNavByRole: { admin: 'reports' } },
    '18b-admin-reports.html': { screenId: 'reports', defaultRole: 'admin' },
    '19-placement-tracking.html': { screenId: 'placementTracking', defaultRole: 'officeCoordinator' },
    '20-placement-detail.html': { screenId: 'placementTracking', defaultRole: 'officeCoordinator' },
    '21-trainer-dashboard.html': { screenId: 'trainerDashboard', defaultRole: 'trainer' },
    '22-notifications.html': { screenId: 'notifications', defaultRole: 'admin' }
  };

  const navItems = [
    { id: 'adminDashboard', label: 'Admin Dashboard', file: '02-admin-dashboard.html', icon: 'dashboard', roles: ['admin'] },
    { id: 'ocDashboard', label: 'OC Dashboard', file: '08-oc-dashboard.html', icon: 'dashboard', roles: ['admin', 'officeCoordinator'] },
    { id: 'trainerDashboard', label: 'Trainer Dashboard', file: '21-trainer-dashboard.html', icon: 'dashboard', roles: ['admin', 'trainer'] },
    { id: 'courseManagement', label: 'Course Management', file: '03-course-management.html', icon: 'courses', roles: ['admin', 'officeCoordinator'], permissions: { officeCoordinator: 'View only' } },
    { id: 'batchManagement', label: 'Batch Management', file: '05-batch-management.html', icon: 'batches', roles: ['admin', 'officeCoordinator', 'trainer'], permissions: { officeCoordinator: 'Assign candidates', trainer: 'View assigned' } },
    { id: 'userManagement', label: 'User Management', file: '07-user-management.html', icon: 'users', roles: ['admin'] },
    { id: 'applicationEntry', label: 'Application Entry', file: '09-application-wizard.html', icon: 'applications', roles: ['admin', 'officeCoordinator'] },
    { id: 'candidateList', label: 'Candidate List', file: '14-candidate-list.html', icon: 'candidateList', roles: ['admin', 'officeCoordinator'] },
    { id: 'candidateProfile', label: 'Candidate Profile', file: '15-candidate-profile.html', icon: 'candidateProfile', roles: ['admin', 'officeCoordinator', 'trainer'], permissions: { trainer: 'View assigned' } },
    { id: 'attendance', label: 'Attendance Marking', file: '16-attendance.html', icon: 'attendance', roles: ['admin', 'trainer'] },
    { id: 'assessmentEntry', label: 'Assessment Entry', file: '17-assessment-entry.html', icon: 'assessmentEntry', roles: ['admin', 'trainer'] },
    { id: 'assessmentResults', label: 'Assessment Results', file: '18-assessment-results.html', icon: 'assessmentResults', roles: ['officeCoordinator', 'trainer'], permissions: { trainer: 'Own batches' } },
    { id: 'placementTracking', label: 'Placement Tracking', file: '19-placement-tracking.html', icon: 'placements', roles: ['admin', 'officeCoordinator'] },
    { id: 'reports', label: 'Reports', file: '18b-admin-reports.html', icon: 'reports', roles: ['admin'] },
    { id: 'notifications', label: 'Notifications', file: '22-notifications.html', icon: 'notifications', roles: ['admin', 'officeCoordinator', 'trainer'] }
  ];

  function injectStyles() {
    if (document.getElementById('rwf-role-navigation-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'rwf-role-navigation-styles';
    style.textContent = [
      '.rwf-role-switcher { margin: 12px 16px 8px; padding: 12px; border-radius: 10px; border: 1px solid rgba(43,94,167,0.12); background: rgba(43,94,167,0.06); }',
      '.sidebar.rwf-theme-dark .rwf-role-switcher { border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); }',
      '.rwf-role-label { display: block; margin-bottom: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: inherit; opacity: 0.72; }',
      '.rwf-role-select { width: 100%; border: 1px solid rgba(43,94,167,0.16); border-radius: 8px; background: #FFFFFF; color: #18181B; font: inherit; font-size: 13px; padding: 9px 12px; outline: none; }',
      '.sidebar.rwf-theme-dark .rwf-role-select { border-color: rgba(255,255,255,0.12); background: #27272A; color: #FFFFFF; }',
      '.rwf-role-select:focus { border-color: #2B5EA7; box-shadow: 0 0 0 3px rgba(43,94,167,0.12); }',
      '.rwf-nav-copy { min-width: 0; display: flex; flex-direction: column; gap: 1px; }',
      '.rwf-nav-label { display: block; }',
      '.rwf-nav-meta { display: block; font-size: 11px; line-height: 1.3; opacity: 0.72; }',
      '.nav-item.active .rwf-nav-meta { opacity: 0.86; }',
      '.nav-item.is-disabled { opacity: 0.58; cursor: not-allowed; pointer-events: none; }'
    ].join('');
    document.head.appendChild(style);
  }

  function currentFileName() {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  }

  function isDarkSidebar(sidebar) {
    const color = window.getComputedStyle(sidebar).backgroundColor;
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) {
      return false;
    }
    const red = Number(match[0]);
    const green = Number(match[1]);
    const blue = Number(match[2]);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    return luminance < 0.45;
  }

  function getIcon(icon) {
    const icons = {
      dashboard: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect></svg>',
      courses: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5v-14Z"></path><path d="M6.5 4A2.5 2.5 0 0 0 4 6.5C4 7.88 5.12 9 6.5 9H20"></path></svg>',
      batches: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Z"></path><path d="M3 12l9 4.5 9-4.5"></path><path d="M3 16.5 12 21l9-4.5"></path></svg>',
      users: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="3"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a3 3 0 0 1 0 5.74"></path></svg>',
      applications: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"></path><path d="M14 2v5h5"></path><path d="M9 13h6"></path><path d="M9 17h6"></path></svg>',
      candidateList: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle></svg>',
      candidateProfile: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M20 21a8 8 0 1 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      attendance: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M3 10h18"></path><path d="m9 16 2 2 4-5"></path></svg>',
      assessmentEntry: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path></svg>',
      assessmentResults: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>',
      placements: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M3 21h18"></path><path d="M7 16V8"></path><path d="M12 16V3"></path><path d="M17 16v-5"></path></svg>',
      reports: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M3 3v18h18"></path><path d="M7 14h3"></path><path d="M7 10h7"></path><path d="M7 6h11"></path></svg>',
      notifications: '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>'
    };
    return icons[icon] || icons.dashboard;
  }

  function buildNavItem(item, role, activeScreenId, useListMarkup) {
    const isActive = item.id === activeScreenId;
    const stateClass = ['nav-item', isActive ? 'active' : '', item.disabled ? 'is-disabled' : ''].filter(Boolean).join(' ');
    const href = item.file || '#';
    const note = item.permissions && item.permissions[role] ? '<span class="rwf-nav-meta">' + item.permissions[role] + '</span>' : '';
    const anchor = '<a class="' + stateClass + '" href="' + href + '" data-nav-id="' + item.id + '"' + (item.disabled ? ' aria-disabled="true" tabindex="-1"' : '') + '><span class="nav-icon">' + getIcon(item.icon) + '</span><span class="rwf-nav-copy"><span class="rwf-nav-label">' + item.label + '</span>' + note + '</span></a>';
    return useListMarkup ? '<li>' + anchor + '</li>' : anchor;
  }

  function syncRoleLabels(role) {
    const roleInfo = roles[role];
    document.querySelectorAll('.sidebar-role-name, .user-role-tag, .sidebar-user-role').forEach(function (element) {
      element.textContent = roleInfo.label;
    });
    document.querySelectorAll('.sidebar-user-name, .user-name').forEach(function (element) {
      element.textContent = roleInfo.userName;
    });
    document.querySelectorAll('.sidebar-user-avatar, .user-avatar, .topbar-avatar').forEach(function (element) {
      element.textContent = roleInfo.initials;
    });
  }

  function ensureRoleSwitcher(sidebar, activeRole, currentScreenId) {
    let switcher = sidebar.querySelector('.rwf-role-switcher');
    if (!switcher) {
      switcher = document.createElement('div');
      switcher.className = 'rwf-role-switcher';
      switcher.innerHTML = '<label class="rwf-role-label" for="rwf-role-select">Preview role</label><select class="rwf-role-select" id="rwf-role-select"><option value="admin">Admin</option><option value="officeCoordinator">Office Coordinator</option><option value="trainer">Trainer</option></select>';
      const anchor = sidebar.querySelector('.sidebar-role') || sidebar.querySelector('.sidebar-brand') || sidebar.querySelector('.sidebar-logo');
      if (anchor && anchor.parentNode === sidebar) {
        anchor.insertAdjacentElement('afterend', switcher);
      } else {
        sidebar.insertBefore(switcher, sidebar.querySelector('.sidebar-nav'));
      }
    }

    const select = switcher.querySelector('.rwf-role-select');
    select.value = activeRole;
    select.onchange = function (event) {
      const nextRole = event.target.value;
      window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
      const nextRoleCanViewCurrent = navItems.some(function (item) {
        return item.id === currentScreenId && item.roles.indexOf(nextRole) !== -1;
      });
      if (nextRoleCanViewCurrent) {
        window.location.reload();
        return;
      }
      window.location.href = roles[nextRole].landingPage;
    };
  }

  function renderNavigation(role, currentScreenId) {
    const sidebar = document.querySelector('.sidebar');
    const nav = document.querySelector('.sidebar-nav');
    if (!sidebar || !nav) {
      return;
    }

    sidebar.classList.toggle('rwf-theme-dark', isDarkSidebar(sidebar));
    ensureRoleSwitcher(sidebar, role, currentScreenId);
    syncRoleLabels(role);

    const visibleItems = navItems.filter(function (item) {
      return item.roles.indexOf(role) !== -1;
    });
    const useListMarkup = nav.tagName.toUpperCase() === 'UL';
    nav.innerHTML = visibleItems.map(function (item) {
      return buildNavItem(item, role, currentScreenId, useListMarkup);
    }).join('');
  }

  function resolveRole(page) {
    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
    const canUseStoredRole = storedRole && navItems.some(function (item) {
      return item.id === page.screenId && item.roles.indexOf(storedRole) !== -1;
    });
    const role = canUseStoredRole ? storedRole : page.defaultRole;
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    const activeNavId = page.activeNavByRole && page.activeNavByRole[role] ? page.activeNavByRole[role] : page.screenId;
    return { role: role, screenId: activeNavId };
  }

  function init() {
    const page = pages[currentFileName()];
    if (!page) {
      return;
    }

    injectStyles();
    const resolved = resolveRole(page);
    renderNavigation(resolved.role, resolved.screenId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  init();
}());