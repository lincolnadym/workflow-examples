import { WFJSONParser } from './workflows';
import { NSWFJSONParser } from './workflows';

function runWorkflow() {
  const wfParser = new WFJSONParser(NSWFJSONParser.sampleWorkflow);
  return wfParser.doRunWorkflow();
}
const result = runWorkflow();
console.log('Result', result);
