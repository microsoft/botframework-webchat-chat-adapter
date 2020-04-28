// import { Adapter, AdapterCreator, AdapterEnhancer } from '../types/AdapterTypes';
// import convertAdapterActivity from './convertAdapterActivity';

// export default function createConvertActivityEnhancer<TInputActivity, TOutputActivity, TAdapterConfig>(
//   convert: (activity: TInputActivity) => TOutputActivity,
//   convertBack: (activity: TOutputActivity) => TInputActivity
// ): AdapterEnhancer<TInputActivity, TOutputActivity, TAdapterConfig> {
//   return (next: AdapterCreator<TInputActivity, TAdapterConfig>): AdapterCreator<TOutputActivity, TAdapterConfig> => (
//     options: TAdapterConfig
//   ): Adapter<TOutputActivity, TAdapterConfig> => convertAdapterActivity(next(options), convert, convertBack);
// }
