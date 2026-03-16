import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

const MAVEN_MIRROR =
  'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven';
const ARCHIVE_MIRROR = 'https://archive.apache.org/dist/maven/maven-3';

/**
 * Downloads (or retrieves from cache) the specified Maven version
 * and adds it to PATH. Sets output variables for downstream steps.
 */
export async function getMaven(version: string): Promise<void> {
  let toolPath = tc.find('maven', version);

  if (toolPath) {
    core.info(`Found Maven ${version} in tool cache`);
  } else {
    toolPath = await downloadMaven(version);
  }

  const binPath = path.join(toolPath, 'bin');
  core.addPath(binPath);

  core.setOutput('maven-version', version);
  core.setOutput('maven-path', toolPath);
  core.exportVariable('M2_HOME', toolPath);
  core.info(`Maven ${version} installed to ${toolPath}`);
}

async function downloadMaven(version: string): Promise<string> {
  const isWindows = os.platform() === 'win32';
  const ext = isWindows ? 'zip' : 'tar.gz';
  const archiveName = `apache-maven-${version}-bin.${ext}`;
  const primaryUrl = `${MAVEN_MIRROR}/${version}/${archiveName}`;
  const fallbackUrl = `${ARCHIVE_MIRROR}/${version}/binaries/${archiveName}`;

  let downloadPath: string;
  try {
    core.info(`Downloading Maven ${version} from ${primaryUrl}`);
    downloadPath = await tc.downloadTool(primaryUrl);
  } catch {
    core.warning(`Primary download failed, trying Apache archive mirror…`);
    downloadPath = await tc.downloadTool(fallbackUrl);
  }

  core.info('Extracting archive…');
  const extractedPath = isWindows
    ? await tc.extractZip(downloadPath)
    : await tc.extractTar(downloadPath);

  const toolRoot = path.join(extractedPath, `apache-maven-${version}`);
  return tc.cacheDir(toolRoot, 'maven', version);
}
