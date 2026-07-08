import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Use a system Chromium if provided (avoids re-downloading headless shell,
// e.g. in sandboxes/CI).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
// Voice + music are muxed by scripts/assemble.sh after render;
// Remotion renders video only (no audio track needed).
