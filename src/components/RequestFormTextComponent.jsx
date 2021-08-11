import React, { Component } from "react";

export default class RequestFormTextComponent extends Component {

    getHTMLPart(variables, text) {
        let result = []
        if (text !== undefined) {
            if (variables !== undefined) {
                let variableMap = this.getVariablesMap(variables);
                let textParts = text.split(/({\w+})/g);
                for (let i=0; i < textParts.length; i++){
                    if (variableMap[textParts[i]] !== undefined){
                        textParts[i] = variableMap[textParts[i]]; 
                    }
                }
                result.push(textParts);
            } else {
                result.push(text);
            }
        }
        return result;
    }

    getVariablesMap(variables){
        let  map = {};
        variables.forEach((variable) => {
            map['{'+variable.name + '}'] = this.getVariable(variable);
        })
        return map;
    }

    getVariable(iv) {
        if (iv.type === 'date') {
            return (<input type={iv.type} value={iv.value === undefined ? '' : iv.value} name={iv.name} key={iv.name} ></input>);
        }
        return (<input required aria-invalid={!!iv.error} type={iv.type} value={iv.value === undefined ? '': iv.value} name={iv.name} key={iv.name} onChange={this.props.handleChange} placeholder={iv.placeholder !== null || iv.placeholder !== undefined ? iv.placeholder : ''}></input>);
    }

    render() {
        return (
            this.getHTMLPart(this.props.variables, this.props.text)
        )
    }
}