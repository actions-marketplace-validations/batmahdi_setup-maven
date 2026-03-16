"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaven = getMaven;
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const MAVEN_MIRROR = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven';
const ARCHIVE_MIRROR = 'https://archive.apache.org/dist/maven/maven-3';
/**
 * Downloads (or retrieves from cache) the specified Maven version
 * and adds it to PATH. Sets output variables for downstream steps.
 */
async function getMaven(version) {
    let toolPath = tc.find('maven', version);
    if (toolPath) {
        core.info(`Found Maven ${version} in tool cache`);
    }
    else {
        toolPath = await downloadMaven(version);
    }
    const binPath = path.join(toolPath, 'bin');
    core.addPath(binPath);
    core.setOutput('maven-version', version);
    core.setOutput('maven-path', toolPath);
    core.exportVariable('M2_HOME', toolPath);
    core.info(`Maven ${version} installed to ${toolPath}`);
}
async function downloadMaven(version) {
    const isWindows = os.platform() === 'win32';
    const ext = isWindows ? 'zip' : 'tar.gz';
    const archiveName = `apache-maven-${version}-bin.${ext}`;
    const primaryUrl = `${MAVEN_MIRROR}/${version}/${archiveName}`;
    const fallbackUrl = `${ARCHIVE_MIRROR}/${version}/binaries/${archiveName}`;
    let downloadPath;
    try {
        core.info(`Downloading Maven ${version} from ${primaryUrl}`);
        downloadPath = await tc.downloadTool(primaryUrl);
    }
    catch {
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
//# sourceMappingURL=installer.js.map