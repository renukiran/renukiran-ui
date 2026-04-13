const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = process.env.RENUKIRAN_UI_URL || 'http://localhost:3000';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VIEWPORT = { width: 1440, height: 960 };

const parseDelay = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const HEADLESS = process.env.RENUKIRAN_PLAYWRIGHT_HEADLESS !== 'false';
const RECORD_VIDEO = process.env.RENUKIRAN_PLAYWRIGHT_RECORD_VIDEO === 'true';
const DEMO_MODE = process.env.RENUKIRAN_PLAYWRIGHT_DEMO_MODE === 'true' || RECORD_VIDEO;
const STEP_PAUSE_MS = parseDelay(process.env.RENUKIRAN_PLAYWRIGHT_STEP_PAUSE_MS, DEMO_MODE ? 2200 : 0);
const SLOW_MO_MS = parseDelay(process.env.RENUKIRAN_PLAYWRIGHT_SLOW_MO_MS, DEMO_MODE ? 350 : 0);
const ROLE_PAUSE_MS = parseDelay(process.env.RENUKIRAN_PLAYWRIGHT_ROLE_PAUSE_MS, DEMO_MODE ? 2800 : 0);
const TYPE_DELAY_MS = parseDelay(process.env.RENUKIRAN_PLAYWRIGHT_TYPE_DELAY_MS, DEMO_MODE ? 90 : 0);
const VIDEO_DIR = path.resolve(PROJECT_ROOT, process.env.RENUKIRAN_PLAYWRIGHT_VIDEO_DIR || 'playwright-demo-videos');
const VIDEO_BASENAME = process.env.RENUKIRAN_PLAYWRIGHT_VIDEO_BASENAME || 'renukiran-ui-demo';
const FAILURE_SCREENSHOT = path.resolve(PROJECT_ROOT, 'playwright-clickthrough-failure.png');

const USERS = {
  admin: { username: 'TempAdmin', password: 'Admin@1234' },
  coordinator: { username: 'TempCoordinator', password: 'Coordinator@1234' },
  trainer: { username: 'TempTrainer', password: 'Trainer@1234' },
};

const waitForHeading = async (page, name) => {
  await page.getByRole('heading', { name }).waitFor({ state: 'visible', timeout: 15000 });
};

const waitForText = async (page, text) => {
  await page.getByText(text).waitFor({ state: 'visible', timeout: 15000 });
};

const pauseForDemo = async (page, duration = STEP_PAUSE_MS) => {
  if (!DEMO_MODE || duration <= 0) {
    return;
  }

  await page.waitForTimeout(duration);
};

const showDemoCaption = async (page, title, subtitle = '', duration = STEP_PAUSE_MS) => {
  if (!DEMO_MODE) {
    return;
  }

  await page.evaluate(({ titleText, subtitleText }) => {
    const existing = document.getElementById('__renukiran_demo_overlay__');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = '__renukiran_demo_overlay__';
    Object.assign(overlay.style, {
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: '2147483647',
      width: 'min(420px, calc(100vw - 48px))',
      maxWidth: '420px',
      padding: '14px 16px',
      borderRadius: '14px',
      background: 'rgba(15, 23, 42, 0.9)',
      color: '#f8fafc',
      boxShadow: '0 20px 50px rgba(15, 23, 42, 0.35)',
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
    });

    const titleNode = document.createElement('div');
    titleNode.textContent = titleText;
    Object.assign(titleNode.style, {
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '1.3',
    });
    overlay.appendChild(titleNode);

    if (subtitleText) {
      const subtitleNode = document.createElement('div');
      subtitleNode.textContent = subtitleText;
      Object.assign(subtitleNode.style, {
        marginTop: '6px',
        fontSize: '12px',
        lineHeight: '1.45',
        color: 'rgba(226, 232, 240, 0.92)',
      });
      overlay.appendChild(subtitleNode);
    }

    document.body.appendChild(overlay);
  }, { titleText: title, subtitleText: subtitle });

  await pauseForDemo(page, duration);
};

const showRoleIntro = async (page, title, subtitle) => {
  await showDemoCaption(page, title, subtitle, ROLE_PAUSE_MS);
};

const clickSidebar = async (page, label) => {
  await page.locator('nav').getByRole('button', { name: new RegExp(label, 'i') }).first().click();
};

const firstDataRow = (page) => page.locator('tbody tr').filter({ has: page.locator('td') }).first();
const getModal = (page) => page.locator('div.fixed.inset-0').last();

const fillField = async (page, locator, value) => {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await locator.fill(String(value));
  await pauseForDemo(page, Math.min(900, STEP_PAUSE_MS));
};

const typeField = async (page, locator, value) => {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  const text = String(value);

  if (!DEMO_MODE || TYPE_DELAY_MS <= 0) {
    await locator.fill(text);
    return;
  }

  await locator.click();
  await locator.press('Control+A').catch(() => {});
  await locator.press('Delete').catch(() => {});
  await locator.type(text, { delay: TYPE_DELAY_MS });
  await pauseForDemo(page, Math.min(900, STEP_PAUSE_MS));
};

const selectFirstNonPlaceholderOption = async (page, locator) => {
  await locator.waitFor({ state: 'visible', timeout: 15000 });

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const optionCount = await locator.locator('option').count();
    if (optionCount > 1) {
      const option = locator.locator('option').nth(1);
      const optionValue = await option.getAttribute('value');
      const optionLabel = (await option.textContent())?.trim();

      if (optionValue) {
        await locator.selectOption(optionValue);
      } else if (optionLabel) {
        await locator.selectOption({ label: optionLabel });
      }

      await pauseForDemo(page, Math.min(900, STEP_PAUSE_MS));
      return;
    }

    await page.waitForTimeout(250);
  }
};

const checkField = async (page, locator) => {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await locator.check();
  await pauseForDemo(page, Math.min(700, STEP_PAUSE_MS));
};

const demoCourseDraft = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  await showDemoCaption(page, 'Course screen walkthrough', 'Using the course search and status filters for testing purposes', 1800);
  await typeField(page, page.getByPlaceholder('Search courses...'), 'stitch');
  await page.locator('select').first().selectOption({ label: 'Active' }).catch(() => {});
  await pauseForDemo(page, STEP_PAUSE_MS);
};

const demoBatchDraft = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  const firstBatchId = ((await firstDataRow(page).locator('td').nth(0).textContent()) || '').trim();
  if (!firstBatchId) {
    return;
  }

  await showDemoCaption(page, 'Batch screen walkthrough', 'Using the batch search before opening detail pages for testing purposes', 1800);
  await typeField(page, page.getByPlaceholder('Search batches...'), firstBatchId);
  await pauseForDemo(page, STEP_PAUSE_MS);
};

const demoStaffDraft = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  await showDemoCaption(page, 'Staff screen walkthrough', 'Filtering staff accounts by search, role, and status for testing purposes', 1800);
  await typeField(page, page.getByPlaceholder('Search staff...'), 'trainer');
  await page.locator('select').nth(0).selectOption({ label: 'Trainer' }).catch(() => {});
  await page.locator('select').nth(1).selectOption({ label: 'Active' }).catch(() => {});
  await pauseForDemo(page, STEP_PAUSE_MS);
};

const demoNotificationCreate = async (page, prefix) => {
  if (!DEMO_MODE) {
    return;
  }

  const message = `${prefix} test notification ${new Date().toLocaleTimeString('en-US', { hour12: false })}`;
  await showDemoCaption(page, 'Notification flow', 'Composing and sending an in-app notification for testing purposes', 1800);
  await typeField(page, page.getByPlaceholder('Enter notification message…'), message);
  await page.getByRole('button', { name: /^Send$/i }).click();
  await page.getByText(message).first().waitFor({ state: 'visible', timeout: 15000 });
  await pauseForDemo(page, STEP_PAUSE_MS);
};

const demoCandidateSearch = async (page, caption) => {
  if (!DEMO_MODE) {
    return;
  }

  const firstNameCell = firstDataRow(page).locator('td').nth(0);
  const candidateName = ((await firstNameCell.textContent()) || '').trim();
  const keyword = candidateName.split(/\s+/)[0] || candidateName;
  if (!keyword) {
    return;
  }

  await showDemoCaption(page, 'Candidate filter walkthrough', caption, 1600);
  await typeField(page, page.getByPlaceholder('Search by name or phone...'), keyword);
  await pauseForDemo(page, STEP_PAUSE_MS);
};

const demoApplicationDraft = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  await showDemoCaption(page, 'Application wizard walkthrough', 'Filling each step for testing purposes and saving a local draft', ROLE_PAUSE_MS);

  await checkField(page, page.locator('input[name="batch"][value="Batch 1"]'));
  await typeField(page, page.locator('input[name="fullName"]'), 'Sample Applicant');
  await typeField(page, page.locator('input[name="age"]'), '29');
  await typeField(page, page.locator('input[name="fatherName"]'), 'Ramesh Kumar');
  await typeField(page, page.locator('input[name="mobile"]'), '9876543210');
  await typeField(page, page.locator('input[name="alternateNumber"]'), '9123456780');
  await typeField(page, page.locator('textarea[name="address"]'), 'Ward 4, Garhi, Banswara, Rajasthan');
  await checkField(page, page.locator('input[name="localResident"][value="Yes"]'));
  await typeField(page, page.locator('input[name="aadhaar"]'), '123412341234');
  await checkField(page, page.locator('input[name="bankAccount"][value="Yes"]'));
  await checkField(page, page.locator('input[name="caste"][value="OBC"]'));
  await showDemoCaption(page, 'Step 1 complete', 'Personal information entered', 1400);
  await page.getByRole('button', { name: /^Next$/i }).click();

  await typeField(page, page.locator('input[name="totalFamilyMembers"]'), '5');
  await typeField(page, page.locator('input[name="workingMembers"]'), '2');
  await typeField(page, page.locator('input[name="monthlyHouseholdIncome"]'), '9000');
  await typeField(page, page.locator('input[name="primarySourceOfIncome"]'), 'Daily wage labour');
  await checkField(page, page.locator('input[name="housingType"][value="Own (Pucca)"]'));
  await checkField(page, page.locator('input[name="governmentSchemes"][value="Ration Card"]'));
  await checkField(page, page.locator('input[name="migrationRisk"][value="Will stay long-term"]'));
  await showDemoCaption(page, 'Step 2 complete', 'Household and socio-economic details entered', 1400);
  await page.getByRole('button', { name: /^Next$/i }).click();

  await checkField(page, page.locator('input[name="educationLevel"][value="Secondary"]'));
  await checkField(page, page.locator('input[name="stitchingExperience"][value="Basic"]'));
  await checkField(page, page.locator('input[name="sewingMachineAtHome"][value="Yes"]'));
  await checkField(page, page.locator('input[name="beautyParlourExperience"][value="No"]'));
  await checkField(page, page.locator('input[name="foodBusinessExperience"][value="Yes"]'));
  await checkField(page, page.locator('input[name="handicraftExperience"][value="No"]'));
  await typeField(page, page.locator('textarea[name="previousSkillTraining"]'), 'Introductory stitching support from a local community group.');
  await showDemoCaption(page, 'Step 3 complete', 'Education and work background entered', 1400);
  await page.getByRole('button', { name: /^Next$/i }).click();

  await checkField(page, page.locator('input[name="preferredEnterpriseTrack"][value="Stitching / Garment Production"]'));
  await checkField(page, page.locator('input[name="distanceToTrainingCentre"][value="< 1 km"]'));
  await checkField(page, page.locator('input[name="motivationForJoining"][value="Want income immediately"]'));
  await checkField(page, page.locator('input[name="motivationForJoining"][value="Want home-based work"]'));
  await showDemoCaption(page, 'Step 4 complete', 'Training interest and availability captured', 1400);
  await page.getByRole('button', { name: /^Next$/i }).click();

  await checkField(page, page.locator('input[name="economicSituation"][value="Extremely low income"]'));
  await checkField(page, page.locator('input[name="learningSkillNeeds"][value="Confidence building"]'));
  await checkField(page, page.locator('input[name="enterpriseAspirations"][value="Start boutique / home stitching"]'));
  await checkField(page, page.locator('input[name="willingToParticipate"][value="Yes"]'));
  await page.getByRole('button', { name: /save draft/i }).click();
  await waitForText(page, 'Draft saved locally.');
  await showDemoCaption(page, 'Draft saved', 'Saved locally for testing purposes without creating a new application record', ROLE_PAUSE_MS);
};

const demoPlacementDraft = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  await showDemoCaption(page, 'Placement form walkthrough', 'Opening the placement form and entering sample data for testing purposes', 1800);
  await page.getByRole('button', { name: /^Record Placement$/i }).click();
  const modal = getModal(page);
  await modal.getByText('Record Placement').waitFor({ state: 'visible', timeout: 15000 });

  await typeField(page, modal.locator('input').nth(0), 'Sample Candidate');
  await typeField(page, modal.locator('input').nth(1), 'Sample Employer Pvt Ltd');
  await typeField(page, modal.locator('input').nth(2), 'Machine Operator');
  await typeField(page, modal.locator('input[type="number"]'), '13500');
  await typeField(page, modal.locator('input').nth(5), 'Tailoring');
  await typeField(page, modal.locator('input').nth(6), 'APR-2026-A');
  await typeField(page, modal.locator('input').nth(7), '82%');
  await pauseForDemo(page, STEP_PAUSE_MS);
  await modal.getByRole('button', { name: /cancel/i }).click();
  await pauseForDemo(page, 1200);
};

const demoTrainerBatchInputs = async (page) => {
  if (!DEMO_MODE) {
    return;
  }

  await showDemoCaption(page, 'Attendance walkthrough', 'Switching tabs and staging attendance updates for testing purposes', 1800);
  await page.getByRole('button', { name: /^Attendance$/i }).click();
  await page.getByRole('button', { name: /mark all present/i }).waitFor({ state: 'visible', timeout: 15000 });
  await page.getByRole('button', { name: /mark all present/i }).click();
  await pauseForDemo(page, STEP_PAUSE_MS);

  await showDemoCaption(page, 'Assessment walkthrough', 'Entering sample assessment scores and remarks for testing purposes only', 1800);
  await page.getByRole('button', { name: /^Assessments$/i }).click();
  const firstRow = firstDataRow(page);
  await typeField(page, firstRow.locator('input[type="number"]').nth(0), '68');
  await typeField(page, firstRow.locator('input[type="number"]').nth(1), '81');
  await typeField(page, firstRow.locator('input[type="number"]').nth(2), '74');
  await typeField(page, firstRow.locator('textarea'), 'Sample scores entered for testing purposes.');
  await pauseForDemo(page, ROLE_PAUSE_MS);
};

const login = async (page, credentials, readyCheck) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Username').fill(credentials.username);
  await page.locator('#password').fill(credentials.password);
  const loginResponsePromise = page.waitForResponse((response) => response.url().includes('/auth/admin'));
  await page.getByRole('button', { name: /sign in/i }).click();

  const loginResponse = await loginResponsePromise;
  const loginBodyText = await loginResponse.text();

  if (!loginResponse.ok()) {
    throw new Error(`Login request failed with ${loginResponse.status()}: ${loginBodyText}`);
  }

  let loginBody;
  try {
    loginBody = JSON.parse(loginBodyText);
  } catch {
    throw new Error(`Login returned a non-JSON response: ${loginBodyText}`);
  }

  if (!loginBody?.success) {
    throw new Error(`Login rejected: ${loginBody?.message || 'Unknown authentication failure'}`);
  }

  await readyCheck();
};

const runStep = async (page, results, label, action, subtitle = '') => {
  try {
    await action();
    await showDemoCaption(page, label, subtitle);
    results.push({ label, status: 'passed' });
    console.log(`PASS ${label}`);
  } catch (error) {
    results.push({ label, status: 'failed', error: error.message });
    console.error(`FAIL ${label}: ${error.message}`);
    throw error;
  }
};

const runAdminFlow = async (page, results) => {
  await runStep(page, results, 'admin login', async () => {
    await login(page, USERS.admin, async () => {
      await waitForText(page, 'Operational Stats');
    });
  }, 'Admin dashboard entry');

  await runStep(page, results, 'admin courses page', async () => {
    await clickSidebar(page, 'Courses');
    await waitForHeading(page, 'Courses');
    await demoCourseDraft(page);
  }, 'Course management screen with search and filter interaction');

  await runStep(page, results, 'admin batches page', async () => {
    await clickSidebar(page, 'Batches');
    await waitForHeading(page, 'Batches');
    await demoBatchDraft(page);
  }, 'Batch management screen with search and filter interaction');

  await runStep(page, results, 'admin batch detail', async () => {
    await firstDataRow(page).click();
    await waitForText(page, 'Live batch detail, attendance, and assessment data.');
  }, 'Admin batch detail with candidate, attendance, and assessment tabs');

  await runStep(page, results, 'admin users page', async () => {
    await clickSidebar(page, 'Users');
    await waitForHeading(page, 'Staff Accounts');
    await demoStaffDraft(page);
  }, 'Staff account management with search and filter interaction');

  await runStep(page, results, 'admin notifications page', async () => {
    await clickSidebar(page, 'Notifications');
    await waitForHeading(page, 'Notifications');
    await demoNotificationCreate(page, 'Admin');
  }, 'Shared notifications center with a live notification test');

  await runStep(page, results, 'admin candidate list', async () => {
    await clickSidebar(page, 'Dashboard');
    await waitForText(page, 'Operational Stats');
    await page.getByRole('button', { name: /view all/i }).click();
    await waitForHeading(page, 'Candidates');
    await demoCandidateSearch(page, 'Filtering the candidate table before opening a profile');
  }, 'Candidate list from the dashboard workflow with search filtering');

  await runStep(page, results, 'admin candidate profile', async () => {
    await firstDataRow(page).click();
    await waitForText(page, 'Batch Assignment');
  }, 'Candidate profile detail');

  await runStep(page, results, 'admin application form', async () => {
    await clickSidebar(page, 'Dashboard');
    await page.getByRole('button', { name: /view all/i }).click();
    await waitForHeading(page, 'Candidates');
    if (DEMO_MODE) {
      await page.evaluate(() => localStorage.removeItem('renukiran.applicationDraft'));
    }
    await page.getByRole('button', { name: /new application/i }).click();
    await waitForHeading(page, 'New Application');
    await demoApplicationDraft(page);
  }, 'Five-step application wizard with guided sample data entry');
};

const runCoordinatorFlow = async (page, results) => {
  await runStep(page, results, 'coordinator login', async () => {
    await login(page, USERS.coordinator, async () => {
      await waitForText(page, 'Quick Actions');
    });
  }, 'Office coordinator dashboard entry');

  await runStep(page, results, 'coordinator candidate list', async () => {
    await clickSidebar(page, 'Applications');
    await waitForHeading(page, 'Candidates');
    await demoCandidateSearch(page, 'Filtering the candidate queue from the coordinator view');
  }, 'Application and candidate review list with search filtering');

  await runStep(page, results, 'coordinator batches page', async () => {
    await clickSidebar(page, 'Batches');
    await waitForHeading(page, 'Batches');
  }, 'Coordinator batch assignment view');

  await runStep(page, results, 'coordinator batch detail', async () => {
    await firstDataRow(page).click();
    await waitForText(page, 'Live batch detail, attendance, and assessment data.');
  }, 'Coordinator batch detail');

  await runStep(page, results, 'coordinator placements page', async () => {
    await clickSidebar(page, 'Placements');
    await waitForHeading(page, 'Placement Tracking');
    await demoPlacementDraft(page);
  }, 'Placement tracking board with a draft placement form walkthrough');

  await runStep(page, results, 'coordinator placement detail', async () => {
    await firstDataRow(page).click();
    await page.getByRole('heading', { name: /placement record/i }).waitFor({ state: 'visible', timeout: 15000 });
  }, 'Placement detail record');

  await runStep(page, results, 'coordinator notifications page', async () => {
    await clickSidebar(page, 'Notifications');
    await waitForHeading(page, 'Notifications');
    await demoNotificationCreate(page, 'Coordinator');
  }, 'Coordinator notification center with a live notification test');
};

const runTrainerFlow = async (page, results) => {
  await runStep(page, results, 'trainer login', async () => {
    await login(page, USERS.trainer, async () => {
      await waitForText(page, 'My Active Batches');
    });
  }, 'Trainer dashboard entry');

  await runStep(page, results, 'trainer my batches page', async () => {
    await page.getByRole('button', { name: /view batch/i }).first().click();
    await waitForHeading(page, 'My Batches');
  }, 'Assigned batches list');

  await runStep(page, results, 'trainer batch detail', async () => {
    await page.getByRole('button', { name: /open batch/i }).first().click();
    await waitForText(page, 'Live batch detail, attendance, and assessment data.');
    await demoTrainerBatchInputs(page);
  }, 'Trainer batch detail with attendance and assessment input walkthrough');

  await runStep(page, results, 'trainer notifications page', async () => {
    await clickSidebar(page, 'Notifications');
    await waitForHeading(page, 'Notifications');
    await demoNotificationCreate(page, 'Trainer');
  }, 'Trainer notification center with a live notification test');
};

const finalizeVideo = async (video) => {
  if (!video) {
    return null;
  }

  const recordedPath = await video.path();
  const extension = path.extname(recordedPath) || '.webm';
  const targetPath = path.join(VIDEO_DIR, `${VIDEO_BASENAME}${extension}`);

  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }

  fs.renameSync(recordedPath, targetPath);
  return targetPath;
};

const main = async () => {
  if (RECORD_VIDEO) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: HEADLESS, slowMo: SLOW_MO_MS });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    ...(RECORD_VIDEO ? { recordVideo: { dir: VIDEO_DIR, size: VIEWPORT } } : {}),
  });
  const page = await context.newPage();
  const video = page.video();
  const results = [];
  let savedVideoPath = null;

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await showDemoCaption(page, 'Renukiran UI Walkthrough', 'Admin, coordinator, and trainer screen navigation', ROLE_PAUSE_MS);
    await showRoleIntro(page, 'Admin workflow', 'Dashboard, courses, batches, users, notifications, candidate list, candidate profile, and application form');
    await runAdminFlow(page, results);
    await showRoleIntro(page, 'Office coordinator workflow', 'Dashboard, applications, batch assignment, placements, placement detail, and notifications');
    await runCoordinatorFlow(page, results);
    await showRoleIntro(page, 'Trainer workflow', 'Dashboard, my batches, batch detail, and notifications');
    await runTrainerFlow(page, results);
    await showDemoCaption(page, 'Walkthrough complete', 'All configured UI navigation flows were completed', ROLE_PAUSE_MS);
  } catch (error) {
    await page.screenshot({ path: FAILURE_SCREENSHOT, fullPage: true }).catch(() => {});
    console.error(`\nClick-through failed. Screenshot saved to ${FAILURE_SCREENSHOT}`);
    throw error;
  } finally {
    await context.close();
    savedVideoPath = await finalizeVideo(video).catch(() => null);
    await browser.close();
  }

  console.log('\nSummary');
  for (const result of results) {
    console.log(`- ${result.label}: ${result.status}`);
  }

  if (savedVideoPath) {
    console.log(`\nVideo saved to ${savedVideoPath}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});