import { IInternalInOutFunction } from './iofunc.base';
import { IConversionFunction } from './conversion.base';
interface IObjectDictionary<T> {
    [name: string]: T;
}

type FactoryFunction<T> = (adapter: ioBroker.IAdapter, parameters: any) => T;

export var inOutFactory: IObjectDictionary<FactoryFunction<IInternalInOutFunction>> = {};
export var conversionFactory: IObjectDictionary<FactoryFunction<IConversionFunction>> = {};

export var functionFactory = {
    createInOutFunction: function (adapter: ioBroker.IAdapter, inOutFunction: string, inOutParameters?: any): IInternalInOutFunction {
        if (!(inOutFunction in inOutFactory))
            return inOutFactory["const"](adapter, inOutParameters);
        return inOutFactory[inOutFunction](adapter, inOutParameters);
    },
    createConversionFunction: function (adapter: ioBroker.IAdapter, conversionFunction: string, conversionParameters?: any): IConversionFunction {
        if (!(conversionFunction in conversionFactory))
            return conversionFactory["passthrough"](adapter, conversionParameters);
        return conversionFactory[conversionFunction](adapter, conversionParameters);
    }
};

