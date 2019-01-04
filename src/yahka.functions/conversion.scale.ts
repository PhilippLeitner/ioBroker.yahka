import { TYahkaFunctionBase, IConversionFunction } from "./conversion.base";

export interface IIoBrokerConversionScaleParameters {
    "homekit.min": number;
    "homekit.max": number;
    "iobroker.min": number;
    "iobroker.max": number;
}

export class TIoBrokerConversion_Scale extends TYahkaFunctionBase implements IConversionFunction {
    static isScaleParameter(parameters: any): parameters is IIoBrokerConversionScaleParameters {
        const castedParam = <IIoBrokerConversionScaleParameters>parameters;
        return castedParam["homekit.min"] !== undefined &&
            castedParam["homekit.max"] !== undefined &&
            castedParam["iobroker.min"] !== undefined &&
            castedParam["iobroker.max"] !== undefined;
    }
    static create(adapter: ioBroker.IAdapter, parameters: any): IConversionFunction {
        let params: IIoBrokerConversionScaleParameters;
        if (TIoBrokerConversion_Scale.isScaleParameter(parameters)) {
            params = parameters;
        } else {
            params = {
                "homekit.min": 0,
                "homekit.max": 1,
                "iobroker.min": 0,
                "iobroker.max": 1
            }
        }
        return new TIoBrokerConversion_Scale(adapter, params);
    }
    constructor(adapter: ioBroker.IAdapter, protected parameters: IIoBrokerConversionScaleParameters) {
        super(adapter);
    }

    toHomeKit(value) {
        let num: number = TYahkaFunctionBase.castToNumber(value);
        let homeKitMax = this.parameters["homekit.max"];
        let ioBrokerMax = this.parameters["iobroker.max"];
        let homeKitMin = this.parameters["homekit.min"];
        let ioBrokerMin = this.parameters["iobroker.min"];
        let newValue = ((num - ioBrokerMin) / (ioBrokerMax - ioBrokerMin)) * (homeKitMax - homeKitMin);
        this.adapter.log.debug('scaleInt: converting value to homekit: ' + value + ' to ' + newValue);
        return newValue;
    }
    toIOBroker(value) {
        let num: number = TYahkaFunctionBase.castToNumber(value);
        let homeKitMax = this.parameters["homekit.max"];
        let ioBrokerMax = this.parameters["iobroker.max"];
        let homeKitMin = this.parameters["homekit.min"];
        let ioBrokerMin = this.parameters["iobroker.min"];
        let newValue = ((num - homeKitMin) / (homeKitMax - homeKitMin)) * (ioBrokerMax - ioBrokerMin);
        this.adapter.log.debug('scaleInt: converting value to ioBroker: ' + value + ' to ' + newValue);
        return newValue;
    }
}