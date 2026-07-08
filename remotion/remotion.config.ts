import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);


// Use a system Chromium if provided (avoids re-downloading headless shell,
// e.g. in sandboxes/CI).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
// "chrome-for-testing" runs a full Chrome in new-headless mode (needed for
// reliable FontFace loading); default is the lighter headless shell.
if (process.env.REMOTION_CHROME_MODE) {
  Config.setChromeMode(
    process.env.REMOTION_CHROME_MODE as 'headless-shell' | 'chrome-for-testing',
  );
}
// Voice + music are muxed by scripts/assemble.sh after render;
// Remotion renders video only (no audio track needed).
