import {
  IContextItem,
  ITaskDefinition,
  IWorkflowDefinition,
  TWorkflowTask,
} from 'workflow-chain';

/**
 * A sample workflow namespace.  While export of a namespace is
 * considered bad practice, it's the only way to provide a
 * scope within the TWorkflow class to dynamically create the
 * task classses.
 *
 * We typically put the following within the namespace :
 * - Workflow Definition JSON
 * - WotkflowTask classes.  This simplifies the dynamic creation of
 * task classes.
 */
export namespace NSWFCensusData {
  export const wfdCensusData: IWorkflowDefinition = {
    workflowAttributes: {
      workflowName: 'census-data',
      workflowDescription:
        'Implements a sample workflow that processes Census data from an endpoint',
      workflowContext: {
        payload: {
          contextKey: 'data',
          contextValue: { one: '111', two: '222' },
          statusCode: '0',
        },
      },
      workflowNamespace: 'NSWFCensusData',
      workflowStart: 'WFTQueryEndpoint',
    },
    workflowTasks: [
      {
        taskSequence: 1,
        taskId: 'wft-001',
        taskName: 'wft-endpoint',
        taskClass: 'WFTQueryEndpoint',
        nextTasks: ['WFTJsonConvert'],
        taskActive: true,
      },
      {
        taskId: 'wft-002',
        taskName: 'wft-json-convert',
        taskClass: 'WFTJsonConvert',
        nextTasks: [],
        taskActive: true,
      },
    ],
  };

  export class WFTQueryEndpoint extends TWorkflowTask {
    constructor(taskDefinition: ITaskDefinition) {
      super(taskDefinition);
      this.taskDefinition.taskName = this.constructor.name;
    }
    doRunTask(): IContextItem {
      this.log.info(`- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doRunTask() -`);
      return {
        contextKey: `${this.taskDefinition.taskName}:doRunTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
    doPostTask(): IContextItem {
      this.log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPostTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
  }

  export class WFTJsonConvert extends TWorkflowTask {
    constructor(taskDefinition: ITaskDefinition) {
      super(taskDefinition);
      this.taskDefinition.taskName = this.constructor.name;
    }
    // doPreTask(): void {
    //   Log.info(`- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPreTask() -`);
    // }
    doRunTask(): IContextItem {
      this.log.info(`- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doRunTask() -`);
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
    doPostTask(): IContextItem {
      this.log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPostTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
  }
}
