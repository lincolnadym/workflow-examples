import { WFJSONParser } from './workflows';
import { NSWFJSONParser } from './workflows';

function runWorkflow() {
  const wfParser = new WFJSONParser(NSWFJSONParser.sampleWorkflow);
  wfParser.doRunWorkflow();
  return wfParser.getWorkflowContext();
}
const result = runWorkflow();
console.log('Result', result);
