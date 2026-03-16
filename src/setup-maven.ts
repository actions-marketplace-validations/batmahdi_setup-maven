import * as core from '@actions/core';
import {getMaven} from './installer';

async function run(): Promise<void> {
  try {
    const version = core.getInput('maven-version', {required: true});
    await getMaven(version);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
