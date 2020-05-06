export declare type AsyncMap<TInputActivity, TOutputActivity> = (input: TInputActivity) => Promise<TOutputActivity | void> | void;
export declare type AsyncMapper<TInputActivity, TOutputActivity> = (next: AsyncMap<TInputActivity, TOutputActivity>) => AsyncMap<TInputActivity, TOutputActivity> | never;
