import {PARENT_MESSAGE_CUSTOM} from '../types';

const isWorkerThread = () => {
  try {
    const {isMainThread, parentPort} = require('worker_threads');
    return !isMainThread && parentPort;
  } catch (_) {
    return false;
  }
};

const sendCustomMessageToParent = (message: any) => {
  if (isWorkerThread()) {
    const {parentPort} = require('worker_threads');
    parentPort.postMessage([PARENT_MESSAGE_CUSTOM, message]);
  } else if (typeof process.send === 'function') {
    process.send([PARENT_MESSAGE_CUSTOM, message]);
  } else {
    throw new Error(
      'sendCustomMessageToParent can only be used inside a worker',
    );
  }
};

export default sendCustomMessageToParent;