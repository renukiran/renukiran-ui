import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const artifactRoot = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), '..', 'artifacts', 'renukiran-ui-demo')
);
const videoDir = path.join(artifactRoot, 'video-webm');
const screenshotDir = path.join(artifactRoot, 'screenshots');
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const pauseMs = Number(process.env.SMOKE_PAUSE_MS ?? '3600');
const shortPauseMs = Number(process.env.SMOKE_SHORT_PAUSE_MS ?? '1400');
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? '15000');
const navigationTimeoutMs = Number(process.env.SMOKE_NAVIGATION_TIMEOUT_MS ?? '60000');
const viewportWidth = Number(process.env.SMOKE_VIEWPORT_WIDTH ?? '1600');
const viewportHeight = Number(process.env.SMOKE_VIEWPORT_HEIGHT ?? '960');
const browserWindowWidth = Number(process.env.SMOKE_WINDOW_WIDTH ?? '1920');
const browserWindowHeight = Number(process.env.SMOKE_WINDOW_HEIGHT ?? '1080');

const stepLines = [];
const failures = [];
const consoleErrors = [];
const pageErrors = [];
const requestErrors = [];

const uniqueSuffix = String(Date.now()).slice(-6);
const uniquePhoneSuffix = uniqueSuffix.padStart(8, '0');
const candidateName = `Aarti Kumari ${uniqueSuffix}`;
const candidatePhone = `98${uniquePhoneSuffix}`;
const alternatePhone = `97${uniquePhoneSuffix}`;
const coordinatorName = 'Neha Joshi';
const coordinatorEmail = `neha.joshi.${uniqueSuffix}@rwf.org`;
const coordinatorPhone = '9654321087';
const trainerName = 'Sanjay Malik';
const trainerEmail = `sanjay.malik.${uniqueSuffix}@rwf.org`;
const trainerPhone = '9543210876';
const courseName = `Beauty Intensive ${uniqueSuffix}`;
const batchName = `Beauty Morning ${uniqueSuffix}`;
const trainerBatchName = 'Beauty Basic Apr-Jul 2026';
const notificationMessage = `Counselling meeting shared for ${batchName}`;

let browser;
let context;
let page;
let videoPathPromise;

const dedupe = (items) => [...new Set(items.filter(Boolean))];

const sanitizeFileName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'artifact';

const wait = async (ms = pauseMs) => {
  await page.waitForTimeout(ms);
};

const fillField = async (locator, value, pause = shortPauseMs) => {
  await locator.fill(String(value));
  await wait(Math.min(pause, shortPauseMs));
};

const clickAndPause = async (locator, pause = shortPauseMs) => {
  await locator.click();
  await wait(pause);
};

const checkAndPause = async (locator, pause = shortPauseMs) => {
  await locator.check();
  await wait(pause);
};

const selectAndPause = async (locator, value, pause = shortPauseMs) => {
  await locator.selectOption(value);
  await wait(pause);
};

const recordStep = (status, label, detail = '') => {
  const line = `${status} ${label}${detail ? ` :: ${detail}` : ''}`;
  stepLines.push(line);
  console.log(line);
};

const saveFailureShot = async (label) => {
  const fileName = `${String(failures.length + 1).padStart(2, '0')}-${sanitizeFileName(label)}.png`;
  const filePath = path.join(screenshotDir, fileName);
  try {
    await page.screenshot({ path: filePath, fullPage: true });
    return fileName;
  } catch {
    return null;
  }
};

const saveEvidenceShot = async (label) => {
  const fileName = `evidence-${sanitizeFileName(label)}.png`;
  const filePath = path.join(screenshotDir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return fileName;
};

const expectVisibleText = async (text) => {
  await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: timeoutMs });
};

const expectHeadingText = async (text) => {
  const heading = page.locator('h1, h2, h3').filter({ hasText: text }).first();
  await heading.waitFor({ state: 'visible', timeout: timeoutMs });
};

const clickSidebar = async (label) => {
  await page.locator('nav button').filter({ hasText: label }).first().click();
  await wait(shortPauseMs);
};

const resetBrowserZoom = async () => {
  await page.keyboard.press('Control+0').catch(() => {});
  await page.waitForTimeout(250);
};

const ensureNoEmptyState = async (emptyText) => {
  const isVisible = await page.getByText(emptyText, { exact: false }).isVisible().catch(() => false);
  if (isVisible) {
    throw new Error(emptyText);
  }
};

const dismissOpenModal = async () => {
  const cancelButton = page.getByRole('button', { name: 'Cancel' }).last();
  if (await cancelButton.isVisible().catch(() => false)) {
    await cancelButton.click().catch(() => {});
    await wait(shortPauseMs);
    return;
  }

  const closeButton = page.locator('button').filter({ hasText: '×' }).last();
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click().catch(() => {});
    await wait(shortPauseMs);
  }
};

const runStep = async (label, action, verify, pause = pauseMs) => {
  try {
    await action();
    if (verify) {
      await verify();
    }
    await wait(pause);
    recordStep('PASS', label);
    return true;
  } catch (error) {
    const screenshot = await saveFailureShot(label);
    const detail = screenshot ? `${error.message} [${screenshot}]` : error.message;
    failures.push({ label, detail });
    await dismissOpenModal();
    recordStep('FAIL', label, detail);
    return false;
  }
};

const safeLogout = async () => {
  const logoutVisible = await page.getByRole('button', { name: 'Logout' }).isVisible().catch(() => false);
  if (!logoutVisible) {
    return;
  }

  await page.getByRole('button', { name: 'Logout' }).click();
  await expectHeadingText('Sign In');
  await wait(shortPauseMs);
};

const loginAs = async (username, password, roleText, landingText) => {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: navigationTimeoutMs });
  await resetBrowserZoom();
  await expectHeadingText('Sign In');
  await fillField(page.locator('#email'), username, 700);
  await fillField(page.locator('#password'), password, 700);
  await clickAndPause(page.getByRole('button', { name: 'Sign In' }), pauseMs);
  await resetBrowserZoom();
  await page.getByRole('button', { name: 'Logout' }).waitFor({ state: 'visible', timeout: timeoutMs });
  await expectVisibleText(roleText);
  if (landingText) {
    await expectVisibleText(landingText);
  }
};

const openBatchFromManagement = async (searchText) => {
  const searchInput = page.getByPlaceholder('Search batches...');
  await fillField(searchInput, searchText);
  await ensureNoEmptyState('No batches found.');
  const row = page.locator('tbody tr').filter({ hasText: searchText }).first();
  await row.waitFor({ state: 'visible', timeout: timeoutMs });
  await clickAndPause(row);
};

const openCandidateProfile = async (name) => {
  const searchInput = page.getByPlaceholder('Search by name or phone...');
  await fillField(searchInput, name);
  const row = page.locator('tbody tr').filter({ hasText: name }).first();
  await row.waitFor({ state: 'visible', timeout: timeoutMs });
  await clickAndPause(row);
};

const submitApplication = async () => {
  await fillField(page.locator('input[name="fullName"]'), candidateName);
  await fillField(page.locator('input[name="age"]'), '24');
  await fillField(page.locator('input[name="fatherName"]'), 'Ramesh Kumar');
  await fillField(page.locator('input[name="mobile"]'), candidatePhone);
  await fillField(page.locator('input[name="alternateNumber"]'), alternatePhone);
  await fillField(page.locator('textarea[name="address"]'), 'House 123, Garhi Mohalla, Faridabad');
  await checkAndPause(page.locator('input[name="localResident"][value="Yes"]'));
  await checkAndPause(page.locator('input[name="bankAccount"][value="Yes"]'));
  await checkAndPause(page.locator('input[name="caste"][value="OBC"]'));
  await clickAndPause(page.getByRole('button', { name: /Next/i }), pauseMs);

  await expectHeadingText('Household & Socio-Economic Details');
  await fillField(page.locator('input[name="totalFamilyMembers"]'), '5');
  await fillField(page.locator('input[name="workingMembers"]'), '2');
  await fillField(page.locator('input[name="monthlyHouseholdIncome"]'), '8500');
  await fillField(page.locator('input[name="primarySourceOfIncome"]'), 'Daily wage labour');
  await checkAndPause(page.locator('input[name="housingType"][value="Rented"]'));
  await checkAndPause(page.locator('input[name="migrationRisk"][value="Will stay long-term"]'));
  await clickAndPause(page.getByRole('button', { name: /Next/i }), pauseMs);

  await expectHeadingText('Education & Work Background');
  await checkAndPause(page.locator('input[name="educationLevel"][value="Secondary"]'));
  await checkAndPause(page.locator('input[name="stitchingExperience"][value="Basic"]'));
  await checkAndPause(page.locator('input[name="sewingMachineAtHome"][value="Yes"]'));
  await checkAndPause(page.locator('input[name="beautyParlourExperience"][value="Yes"]'));
  await checkAndPause(page.locator('input[name="foodBusinessExperience"][value="No"]'));
  await checkAndPause(page.locator('input[name="handicraftExperience"][value="No"]'));
  await fillField(page.locator('textarea[name="previousSkillTraining"]'), 'Short tailoring and beauty orientation.');
  await clickAndPause(page.getByRole('button', { name: /Next/i }), pauseMs);

  await expectHeadingText('Training Interest & Availability');
  await checkAndPause(page.locator('input[name="preferredEnterpriseTrack"][value="Beauty / Parlour Services"]'));
  await checkAndPause(page.locator('input[name="distanceToTrainingCentre"]').nth(1));
  await checkAndPause(page.locator('input[name="motivationForJoining"][value="Want income immediately"]'));
  await checkAndPause(page.locator('input[name="motivationForJoining"][value="Want to support family"]'));
  await clickAndPause(page.getByRole('button', { name: /Next/i }), pauseMs);

  await expectHeadingText('Need-Based Assessment');
  await checkAndPause(page.locator('input[name="economicSituation"][value="No stable income"]'));
  await checkAndPause(page.locator('input[name="learningSkillNeeds"][value="Foundation-level training"]'));
  await checkAndPause(page.locator('input[name="enterpriseAspirations"][value="Work in mobile parlour"]'));
  await checkAndPause(page.locator('input[name="willingToParticipate"][value="Yes"]'));
  await clickAndPause(page.getByRole('button', { name: 'Submit Application' }), pauseMs + 800);
};

const openPlacementDetail = async () => {
  await ensureNoEmptyState('No placements found.');
  await clickAndPause(page.locator('tbody tr').nth(0));
};

const createCourse = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Add Course' }));
  await expectHeadingText('Add New Course');
  const modal = page.locator('div.fixed.inset-0').last();
  await fillField(modal.locator('input[placeholder="e.g. Advanced Stitching"]'), courseName);
  await selectAndPause(modal.locator('select').first(), { label: 'Beauty' });
  await fillField(modal.locator('input[placeholder="e.g. 3"]'), '4');
  await fillField(modal.locator('input[type="number"]').nth(1), '18');
  await fillField(modal.locator('textarea'), 'Salon, customer service, and income planning for neighbourhood women.');
  await clickAndPause(modal.getByRole('button', { name: 'Save Course' }), pauseMs);
};

const createBatch = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Create Batch' }).first());
  const modal = page.locator('div.fixed.inset-0').last();
  await modal.locator('select').first().waitFor({ state: 'visible', timeout: timeoutMs });
  await selectAndPause(modal.locator('select').first(), { label: courseName });
  await fillField(modal.locator('input[type="text"]').first(), batchName);
  await selectAndPause(modal.locator('select').nth(1), { label: 'Asha Mehra' });
  await fillField(modal.locator('input[placeholder="e.g., Garhi Centre - Room 2"]'), 'Garhi Centre - Room 2');
  await fillField(modal.locator('input[type="date"]').nth(0), '2026-04-20');
  await fillField(modal.locator('input[type="date"]').nth(1), '2026-08-20');
  await fillField(modal.locator('input[type="number"]').last(), '18');
  await clickAndPause(modal.getByRole('button', { name: 'Create Batch' }).last(), pauseMs);
};

const createOfficeCoordinator = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Add Office Coordinator' }));
  const modal = page.locator('div.fixed.inset-0').last();
  await modal.locator('input[placeholder="e.g., Rekha Patel"]').waitFor({ state: 'visible', timeout: timeoutMs });
  await fillField(modal.locator('input[placeholder="e.g., Rekha Patel"]'), coordinatorName);
  await fillField(modal.locator('input[placeholder="rekha@rwf.org"]'), coordinatorEmail);
  await fillField(modal.locator('input[placeholder="9876543210"]'), coordinatorPhone);
  await clickAndPause(modal.getByRole('button', { name: 'Create Office Coordinator' }), pauseMs);
};

const createTrainer = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Add Trainer' }));
  const modal = page.locator('div.fixed.inset-0').last();
  await modal.locator('input[placeholder="e.g., Suman Kumar"]').waitFor({ state: 'visible', timeout: timeoutMs });
  await fillField(modal.locator('input[placeholder="e.g., Suman Kumar"]'), trainerName);
  await fillField(modal.locator('input[placeholder="suman@rwf.org"]'), trainerEmail);
  await fillField(modal.locator('input[placeholder="9876543210"]'), trainerPhone);
  await clickAndPause(modal.getByRole('button', { name: /Beauty/i }).first());
  await clickAndPause(modal.getByRole('button', { name: /Stitching/i }).first());
  await clickAndPause(modal.getByRole('button', { name: 'Create Trainer' }), pauseMs);
};

const assignCandidateToTrainerBatch = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Assign to Batch' }).first());
  await expectHeadingText('Assign to Batch');
  const modal = page.locator('div[style*="position: fixed"]').last();
  await selectAndPause(modal.locator('select').nth(0), { label: candidateName });
  await selectAndPause(modal.locator('select').nth(1), { label: trainerBatchName });
  await clickAndPause(modal.getByRole('button', { name: 'Assign' }), pauseMs);
  await expectVisibleText('Candidate assigned to batch successfully!');
  await clickAndPause(modal.getByRole('button', { name: 'Cancel' }), shortPauseMs);
};

const reviewCandidateProfileTabs = async () => {
  const tabExpectations = [
    { tab: 'Household', text: 'Monthly Household Income' },
    { tab: 'Education', text: 'Education Level' },
    { tab: 'Training', text: 'Preferred Experience Track' },
    { tab: 'Need Assessment', text: 'Economic Situation' },
    { tab: 'Personal', text: 'Father / Husband Name' },
  ];

  for (const item of tabExpectations) {
    await clickAndPause(page.getByRole('button', { name: item.tab }));
    await expectVisibleText(item.text);
  }
};

const openTrainerAttendanceFromDashboard = async () => {
  const markAttendanceButton = page.getByRole('button', { name: 'Mark Attendance' }).first();
  if (await markAttendanceButton.isVisible().catch(() => false)) {
    await clickAndPause(markAttendanceButton, pauseMs);
    return;
  }

  await clickAndPause(page.getByRole('button', { name: 'View Batch' }).first(), pauseMs);
  await clickAndPause(page.getByRole('button', { name: 'Attendance' }), pauseMs);
};

const completeAttendance = async () => {
  await wait(pauseMs);
  await clickAndPause(page.getByRole('button', { name: 'Mark All Present' }));
  await wait(pauseMs);
  const saveResponse = page.waitForResponse((response) => response.url().includes('/attendance') && response.request().method() === 'POST' && response.status() < 400);
  await clickAndPause(page.getByRole('button', { name: 'Save Attendance' }), shortPauseMs);
  await saveResponse;
  await wait(pauseMs);
};

const enterAssessmentScores = async () => {
  await clickAndPause(page.getByRole('button', { name: 'Assessments' }), pauseMs);
  await expectVisibleText('Save Assessments');

  const rows = page.locator('tbody tr').filter({ has: page.locator('input[type="number"]') });
  const rowCount = await rows.count();

  for (let index = 0; index < rowCount; index += 1) {
    const row = rows.nth(index);
    const scoreBase = 72 + index * 3;
    await fillField(row.locator('input[type="number"]').nth(0), scoreBase);
    await fillField(row.locator('input[type="number"]').nth(1), scoreBase + 8);
    await fillField(row.locator('input[type="number"]').nth(2), scoreBase + 5);
  }

  await clickAndPause(page.locator('button').filter({ hasText: /^Remarks/ }).first());
  await fillField(page.locator('textarea').first(), 'Confident practical work and ready for placement interviews.');
  const saveResponse = page.waitForResponse((response) => response.url().includes('/assessments') && !response.url().endsWith('/publish') && response.request().method() === 'POST' && response.status() < 400);
  await clickAndPause(page.getByRole('button', { name: 'Save Assessments' }), shortPauseMs);
  await saveResponse;
  await wait(shortPauseMs);
  const publishResponse = page.waitForResponse((response) => response.url().endsWith('/publish') && response.request().method() === 'POST' && response.status() < 400);
  await clickAndPause(page.getByRole('button', { name: 'Publish Results' }), shortPauseMs);
  await publishResponse;
  await wait(shortPauseMs);
};

const exerciseNotifications = async () => {
  await fillField(page.getByPlaceholder('Enter notification message…'), notificationMessage);
  await clickAndPause(page.getByRole('button', { name: 'Send' }), pauseMs);
  await expectVisibleText(notificationMessage);
  const markAllReadButton = page.getByRole('button', { name: /Mark all read/i });
  if (await markAllReadButton.isVisible().catch(() => false)) {
    await clickAndPause(markAllReadButton, pauseMs);
  }
};

const writeArtifacts = async (finalWebmPath) => {
  const logPath = path.join(artifactRoot, 'guided-validation.log');
  const summaryPath = path.join(artifactRoot, 'smoke-summary.txt');

  const summaryLines = [
    `Base URL: ${baseUrl}`,
    `Candidate name: ${candidateName}`,
    `Created course: ${courseName}`,
    `Created batch: ${batchName}`,
    `Coordinator sample: ${coordinatorName}`,
    `Trainer sample: ${trainerName}`,
    `Notification message: ${notificationMessage}`,
    `Pause (ms): ${pauseMs}`,
    `Steps passed: ${stepLines.filter((line) => line.startsWith('PASS')).length}`,
    `Steps failed: ${failures.length}`,
    `Video (webm): ${finalWebmPath ?? 'not captured'}`,
    '',
    'Step Results:',
    ...stepLines,
    '',
    'Console Errors:',
    ...(dedupe(consoleErrors).length > 0 ? dedupe(consoleErrors) : ['None']),
    '',
    'Page Errors:',
    ...(dedupe(pageErrors).length > 0 ? dedupe(pageErrors) : ['None']),
    '',
    'Request Errors:',
    ...(dedupe(requestErrors).length > 0 ? dedupe(requestErrors) : ['None']),
  ];

  await fs.writeFile(logPath, `${stepLines.join('\n')}\n`, 'utf8');
  await fs.writeFile(summaryPath, `${summaryLines.join('\n')}\n`, 'utf8');
};

const run = async () => {
  await fs.mkdir(artifactRoot, { recursive: true });
  await fs.mkdir(videoDir, { recursive: true });
  await fs.mkdir(screenshotDir, { recursive: true });

  browser = await chromium.launch({
    headless: false,
    slowMo: 300,
    args: [
      '--start-maximized',
      `--window-size=${browserWindowWidth},${browserWindowHeight}`,
      '--force-device-scale-factor=1',
      '--high-dpi-support=1',
    ],
  });
  context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    screen: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: viewportWidth, height: viewportHeight } },
  });
  page = await context.newPage();
  videoPathPromise = page.video()?.path();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.stack || error.message);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      requestErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  const adminLoggedIn = await runStep(
    'admin login',
    () => loginAs('TempAdmin', 'Admin@1234', 'Admin', 'Dashboard'),
    () => expectHeadingText('Dashboard')
  );

  if (adminLoggedIn) {
    await runStep('admin dashboard', () => wait(shortPauseMs), () => expectHeadingText('Dashboard'));

    const adminCoursesPage = await runStep(
      'admin courses',
      async () => {
        await clickSidebar('Courses');
      },
      () => expectHeadingText('Courses')
    );

    if (adminCoursesPage) {
      await runStep(
        'admin create course',
        () => createCourse(),
        () => expectVisibleText(courseName),
        pauseMs + 600
      );

      await runStep(
        'admin batch management',
        async () => {
          await clickAndPause(page.getByRole('button', { name: 'View Batches' }).last(), pauseMs);
        },
        () => expectHeadingText('Batches')
      );

      await runStep(
        'admin create batch',
        () => createBatch(),
        async () => {
          await expectVisibleText(batchName);
        },
        pauseMs + 600
      );

      await runStep(
        'admin batch detail',
        () => openBatchFromManagement(batchName),
        async () => {
          await expectVisibleText('Assign Trainer');
          await expectVisibleText('Candidates');
          await expectVisibleText(batchName);
        }
      );
    }

    const adminUsersPage = await runStep(
      'admin user management',
      () => clickSidebar('Users'),
      () => expectHeadingText('Staff Accounts')
    );

    if (adminUsersPage) {
      await runStep(
        'admin add office coordinator',
        () => createOfficeCoordinator(),
        () => expectVisibleText(coordinatorName),
        pauseMs + 600
      );

      await runStep(
        'admin add trainer',
        () => createTrainer(),
        () => expectVisibleText(trainerName),
        pauseMs + 600
      );
    }

    await safeLogout();
  }

  const coordinatorLoggedIn = await runStep(
    'office coordinator login',
    () => loginAs('TempCoordinator', 'Coordinator@1234', 'Coordinator', 'Dashboard'),
    () => expectHeadingText('Dashboard')
  );

  if (coordinatorLoggedIn) {
    await runStep('office coordinator dashboard', () => wait(shortPauseMs), () => expectHeadingText('Dashboard'));

    const applicationWizardOpened = await runStep(
      'office coordinator application wizard',
      async () => {
        await clickAndPause(page.getByRole('button', { name: /New Application/i }).first(), pauseMs);
      },
      () => expectHeadingText('New Application')
    );

    if (applicationWizardOpened) {
      await runStep(
        'office coordinator application submit',
        () => submitApplication(),
        async () => {
          await expectHeadingText('Candidates');
          await expectVisibleText(candidateName);
        },
        pauseMs + 1000
      );
    }

    const coordinatorCandidateList = await runStep(
      'office coordinator candidate list',
      async () => {
        await fillField(page.getByPlaceholder('Search by name or phone...'), candidateName);
      },
      () => expectVisibleText(candidateName)
    );

    if (coordinatorCandidateList) {
      await runStep(
        'office coordinator candidate assignment',
        () => assignCandidateToTrainerBatch(),
        () => expectHeadingText('Candidates'),
        pauseMs + 600
      );

      await runStep(
        'office coordinator candidate profile',
        async () => {
          await openCandidateProfile(candidateName);
          await reviewCandidateProfileTabs();
        },
        async () => {
          await expectVisibleText(candidateName);
          await expectVisibleText('Father / Husband Name');
        },
        pauseMs + 600
      );

      await runStep(
        'office coordinator candidate list return',
        async () => {
          await clickAndPause(page.locator('button').filter({ hasText: '←' }).first());
        },
        () => expectHeadingText('Candidates'),
        shortPauseMs
      );
    }

    const coordinatorPlacements = await runStep(
      'placement tracking',
      () => clickSidebar('Placements'),
      () => expectHeadingText('Placement Tracking')
    );

    if (coordinatorPlacements) {
      await runStep(
        'placement tracking actions',
        async () => {
          await clickAndPause(page.getByRole('button', { name: 'Record Placement' }), shortPauseMs);
          await fillField(page.getByPlaceholder('Search candidates...'), 'Priya Sharma');
        },
        () => expectVisibleText('Priya Sharma')
      );

      await runStep(
        'placement detail',
        () => openPlacementDetail(),
        () => expectVisibleText('Placement Record')
      );
    }

    await safeLogout();
  }

  const trainerLoggedIn = await runStep(
    'trainer login',
    () => loginAs('TempTrainer', 'Trainer@1234', 'Trainer', 'My Active Batches'),
    () => expectVisibleText('My Active Batches')
  );

  if (trainerLoggedIn) {
    await runStep(
      'trainer dashboard',
      () => wait(shortPauseMs),
      () => expectVisibleText('My Active Batches')
    );

    await runStep(
      'trainer attendance',
      async () => {
        await openTrainerAttendanceFromDashboard();
        await completeAttendance();
        await saveEvidenceShot('trainer-attendance-details');
      },
      async () => {
        await expectVisibleText(candidateName);
        await expectVisibleText('100%');
      }
    );

    await runStep(
      'trainer assessment entry',
      async () => {
        await enterAssessmentScores();
      },
      async () => {
        await expectVisibleText('View Results');
        await expectVisibleText('Published');
      },
      pauseMs + 800
    );

    await runStep(
      'assessment results report',
      async () => {
        await clickAndPause(page.getByRole('button', { name: 'View Results' }), pauseMs);
        await clickAndPause(page.getByRole('button', { name: /Export CSV/i }), shortPauseMs);
      },
      () => expectHeadingText('Assessment Results')
    );

    await runStep(
      'notifications',
      async () => {
        await clickSidebar('Notifications');
        await exerciseNotifications();
      },
      async () => {
        await expectHeadingText('Notifications');
        await expectVisibleText(notificationMessage);
      },
      pauseMs + 600
    );

    await safeLogout();
  }
};

let finalWebmPath = null;

try {
  await run();
} catch (error) {
  failures.push({ label: 'script execution', detail: error.stack || error.message });
  recordStep('FAIL', 'script execution', error.message);
} finally {
  if (context) {
    await context.close().catch(() => {});
  }
  if (browser) {
    await browser.close().catch(() => {});
  }

  const capturedVideoPath = await videoPathPromise?.catch(() => null);
  if (capturedVideoPath) {
    finalWebmPath = path.join(artifactRoot, 'renukiran-ui-guided-smoke.webm');
    await fs.copyFile(capturedVideoPath, finalWebmPath).catch(() => {});
  }

  await writeArtifacts(finalWebmPath);
}

if (failures.length > 0) {
  process.exitCode = 1;
}