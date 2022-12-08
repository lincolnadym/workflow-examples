import { ITask, ITaskDefinition, IWorkflowDefinition, TWorkflow, Logger as Log } from 'workflow-chain';
import { NSWFJSONParser } from './ns-wf-json-parser';

/**
 * A sample workflow class that illustrates how you extend the
 * TWorkflow class.  It's also critical that the constructor 
 * implement a loop thru all task-definitions in the workflow
 * definition and create dynamic runtime task class instances.  These
 * runtime tasks are added to the task dictionary.
 * 
 * Within this loop is a Namespace that contains all the task classes,
 * workflow definition.  The DYNAMIC line of code creates task
 * class instances from the classname in the workflow definition.
 */
export class WFJSONParser extends TWorkflow {
  constructor(protected wfDefinition: IWorkflowDefinition) {
    super(wfDefinition);
    console.log('- Workflow Definition -');
    console.log(wfDefinition);
    this.wfDefinition.workflowAttributes.workflowName = this.constructor.name;
    wfDefinition.workflowTasks.forEach((theItem: ITaskDefinition) => {
      //   Log.info(`- TaskLoader - ${wfDefinition.workflowAttributes.workflowName} - Task ${JSON.stringify(theItem)}`);
      let theTask: ITask;
      try {
        // DYNAMIC : Create a class dynamically from a classname.  Use the 
        // Namespace as a "scope"
        theTask = new (<any>NSWFJSONParser)[theItem.taskClass](theItem);
        // DICTIONARY : Store the dynamic class into the dictionary
        this.workflowTasks[theItem.taskName] = theTask;
      } catch (error) {
        Log.info(`Dynamic class creation error ${JSON.stringify(error)}`);
      }
    });
  }
}
