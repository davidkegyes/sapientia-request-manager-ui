
import { pdf, Document, Page, Text, Image, StyleSheet, View } from '@react-pdf/renderer'
import { saveAs } from 'file-saver';

const styles = StyleSheet.create({
    page: {
        paddingTop: 65,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontSize: 14,
        fontFamily: 'Times-Roman'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 20,
    },
    text: {
        textIndent: 15,
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
        paddingBottom: 15
      }
});
export default class RequestPDFService {

    downloadPdf(request, name) {
        this.getPDFDocument(request).toBlob().then(blob => saveAs(blob, name + '.pdf'));
    }

    getRequestPdfFile(request, name) {
        return this.getPDFDocument(request).toBlob(blob => new File([blob], name + '.pdf'));
    }

    getPDFDocument(requestForm) {
        let wrapperMap = {};
        for (let i in requestForm) {
            let part = requestForm[i];
            let elements = wrapperMap[part.wrapper];
            if (elements === undefined) {
                elements = []
            }

            if (part.type === 'text') {
                let subElements = [];
                if (part.variables) {
                    subElements.push((<Text style={this.getStyle(part.style)}>{this.getPDFPart(part.variables, part.text)}</Text>));
                } else {
                    subElements.push(<Text key={'text' + i} style={this.getStyle(part.style)}>{part.text}</Text>);
                }
                elements.push(
                    <Text key={'text' + i} style={this.getStyle(part.style)}>{subElements}</Text>
                );
            } else if (part.type === 'customText') {
                elements.push(
                    <Text style={this.getStyle(part.style)}>{part.value}</Text>
                );
            } else if (part.type === 'dateAndSignature') {
                if (part.signatureValue) {
                    elements.push(
                        <View  style={{ flexDirection: 'row' }}>
                            <View key='signatureDateView' style={{ flex: '1', flexDirection: 'column', textAlign: 'center' }}>
                                <Text>{part.dateText}</Text>
                                <Text>{part.dateValue}</Text>
                            </View>
                            <View key='signatureView' style={{ flex: '1', flexDirection: 'column', textAlign: 'center' }}>
                                <Text key='signatureText' >{part.signatureText}</Text>
                                <Image key='signatureImg' style={{ alignSelf: 'center', width: '100' }} src={part.signatureValue} />
                            </View>
                        </View>
                    );
                } else {
                    elements.push(
                        <View  style={{ flexDirection: 'row' }}>
                            <View key='signatureDateView' style={{ flex: '1', flexDirection: 'column', textAlign: 'center' }}>
                                <Text>{part.dateText}</Text>
                                <Text>{"___________"}</Text>
                            </View>
                            <View key='signatureView' style={{ flex: '1', flexDirection: 'column', textAlign: 'center' }}>
                                <Text key='signatureText' >{part.signatureText}</Text>
                            </View>
                        </View>
                    );
                }
            }
            wrapperMap[part.wrapper] = elements;
        }
        let finalElements = [];
        for (let k in wrapperMap) {
            finalElements.push(
                <View key={k}>
                    {wrapperMap[k]}
                </View>
            );
        }
        const doc = (
            <Document>
                <Page size="A4"key='RequestPDF' style={styles.page}>
                    {finalElements}
                </Page>
            </Document>
        )
        return pdf(doc);
    }

    getStyle(style) {
        if (style) {
            let st = [];
            let sk = style.split(/\s+/g);
            for (let i in sk) {
                if (styles[[sk[i]]]) {
                    st.push(styles[sk[i]]);
                }
            }
            return st;
        }
    }

    getPDFPart(variables, text, style) {
        let result = []
        if (text !== undefined) {
            if (variables !== undefined) {
                let variableMap = this.getVariablesMap(variables);
                let textParts = text.split(/({\w+})/g);
                for (let i = 0; i < textParts.length; i++) {
                    if (variableMap[textParts[i]] !== undefined) {
                        textParts[i] = (<Text>{variableMap[textParts[i]]}</Text>);
                    }
                }
                result.push(textParts);
            } else {
                result.push(text);
            }
        }
        return result;
    }

    getVariablesMap(variables) {
        let map = {};
        variables.forEach((variable) => {
            map['{' + variable.name + '}'] = this.getVariable(variable);
        })
        return map;
    }

    getVariable(variable) {
        if (variable.value) {
            return variable.value;
        } else {
            if (variable.type === 'text') {
                return "____________________________";
            } else if (variable.type === 'date') {
                return "__________";
            } else if (variable.type === 'number') {
                return "____";
            }
        }
    }
}