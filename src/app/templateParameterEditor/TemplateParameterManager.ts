/// <reference path="../main/ArmTemplate.ts" />
/// <reference path="../main/Parameter.ts" />

class TemplateParameterManager {
	armTemplate:ArmTemplate;
	
	constructor(armTemplate:ArmTemplate) {
		this.armTemplate = armTemplate
	}
	
	getParameterNames():string[] {
		return Object.keys(this.armTemplate.parameters)
	}
	
	getParameterData(propertyName:string):Parameter {
		return this.armTemplate.parameters[propertyName];
	}
}