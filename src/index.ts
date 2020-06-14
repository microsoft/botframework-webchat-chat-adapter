import { Adapter, ReadyState } from './types/AdapterTypes';
import { compose } from 'redux';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import applySetStateMiddleware from './applySetStateMiddleware';
import applySubscribeMiddleware from './applySubscribeMiddleware';
import createAdapter from './createAdapter';
import createIC3AdapterEnhancer from './ic3/createAdapterEnhancer';
import exportDLJSInterface from './enhancers/exportDLJSInterface';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export {
  applyEgressMiddleware,
  applyIngressMiddleware,
  applySetStateMiddleware,
  applySubscribeMiddleware,
  CLOSED,
  compose,
  CONNECTING,
  createIC3AdapterEnhancer,
  exportDLJSInterface,
  OPEN
};

export type { Adapter };

// TODO: Expose the IC3 adapter in a better way.
// TODO: Allow devs to insert enhancer to modify the behavior of the final adapter.

import { IIC3AdapterOptions } from './types/ic3/IIC3AdapterOptions';
import updateIn from 'simple-update-in';
import { IDirectLineActivity } from './types/DirectLineTypes';

window.Microsoft || (window.Microsoft = {});

function englishToHsilgne(value: string, modify: string ): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        // value
        //   .split(' ')
        //   .reverse()
        //   // .map(value => value.split('').reverse().join(''))
        //   .join(' ')
        value + modify
      );
    }, 5000);
  });
}
function testAsyncActivity(activity: IDirectLineActivity){
  return new Promise(resolve => {
    setTimeout(() => {
      let newActivity = Object.assign({}, activity);
      if(newActivity.text){
        newActivity.text = newActivity.text.split(' ').reverse().join(' ');
      }
      resolve(newActivity);
    }, 3000);
  });
}
window.Microsoft.BotFramework = updateIn(
  window.Microsoft.BotFramework || {},
  ['WebChat', 'createIC3Adapter'],
  () => (options: IIC3AdapterOptions, logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger) =>
    // TODO: Why is logger separated out? In the original code, we can put it in options and make it look flushed.
    createAdapter(
      {}, //Questions: adapter options, it is empty as default. How to use it?
      compose(
        exportDLJSInterface(), 
        // applyEgressMiddleware(() => next => async (activity: IDirectLineActivity, options) =>{
        //   console.log("from egress middleware, ", activity, " options: ", options);
        //   if(activity.text){
        //     let hsilgne = await englishToHsilgne(activity.text, "egress");
        //     next({
        //       ...activity,
        //       text: hsilgne
        //     });
        //   }
        //   else {
        //     next(activity)
        //   }
        // }),

        // applyIngressMiddleware(() => next => async (activity: IDirectLineActivity) => {
        //   next(activity);
        //   let ingressText = await englishToHsilgne(activity.text, "ingress");
        //   next(
        //     {
        //       ...activity,
        //       text: ingressText
        //     }
        //   );
        // }),
        createIC3AdapterEnhancer({ ...options, /*logger*/ }),
        // applyIngressMiddleware(() => next => activity => {
        //   console.log("from ingress middleware, ", activity);
        //   next(activity);
        // }),
      )
    )
);
