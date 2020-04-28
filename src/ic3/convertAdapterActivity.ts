// import { Adapter, IterateActivitiesOptions, EgressOptions } from '../types/AdapterTypes';
// import Observable, { Subscription } from 'core-js/features/observable';

// export default function convertAdapterActivity<TInputActivity, TOutputActivity, TAdapterConfig>(
//   adapter: Adapter<TInputActivity, TAdapterConfig>,
//   convert: (activity: TInputActivity) => TOutputActivity,
//   convertBack: (activity: TOutputActivity) => TInputActivity
// ): Adapter<TOutputActivity, TAdapterConfig> {
//   return {
//     addEventListener: adapter.addEventListener.bind(adapter),
//     close: adapter.close.bind(adapter),
//     dispatchEvent: adapter.dispatchEvent.bind(adapter),
//     getConfig: adapter.close.bind(adapter),
//     getReadyState: adapter.close.bind(adapter),
//     removeEventListener: adapter.removeEventListener.bind(adapter),
//     setConfig: adapter.close.bind(adapter),
//     setReadyState: adapter.close.bind(adapter),

//     activities: (options?: IterateActivitiesOptions): AsyncIterable<TOutputActivity> => {
//       const activities = adapter.activities(options);

//       return {
//         async *[Symbol.asyncIterator]() {
//           for await (const activity of activities) {
//             yield convert(activity);
//           }
//         }
//       };
//     },

//     egress: async (activity: TOutputActivity, options?: EgressOptions<TOutputActivity>): Promise<void> => {
//       let patchedOptions: EgressOptions<TInputActivity>;

//       if (options && options.progress) {
//         patchedOptions = {
//           progress: (activity: TInputActivity) => options.progress(convert(activity))
//         };
//       }

//       return adapter.egress(convertBack(activity), patchedOptions);
//     },

//     ingress: (activity: TOutputActivity): void => {
//       adapter.ingress(convertBack(activity));
//     },

//     subscribe: (observable: Observable<TOutputActivity> | false): void => {
//       if (!observable) {
//         return adapter.subscribe(observable);
//       }

//       adapter.subscribe(
//         new Observable<TInputActivity>(({ complete, error, next }) => {
//           let thisSubscription: Subscription;

//           observable.subscribe({
//             complete,
//             error,
//             next(value: TOutputActivity) {
//               console.log(value, convertBack(value));

//               next(convertBack(value));
//             },
//             start(subscription: Subscription) {
//               thisSubscription = subscription;
//             }
//           });

//           return () => thisSubscription.unsubscribe();
//         })
//       );
//     }
//   };
// }
