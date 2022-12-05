import { useState, useEffect } from "react"
import { unicode, preeti, KEYCODE, specialchar } from './data'


import devanagiri from '../devanagari/devanagiri.ttf'


import { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';




Font.register({
    family: "Noto Sans Devanagari",
    src: devanagiri,

});


const styles = StyleSheet.create({
    page: {

        backgroundColor: '#E4E4E4',


    },
    section: {
        margin: 10,
        padding: 10,
        fontFamily: "Noto Sans Devanagari",

    }
});


var numm = "";

export default function Nepalitype() {

    const [value, setValue] = useState("");
    const [value2, setValue2] = useState("");

    function mapper(keyCode) {
        return preeti[keyCode - 32]//mapping to preeti or we can map through unicode with the help of unicode.
    }

    const calculate = (event, oldval, changeValue) => {

        event.persist();
        let keyCode = event.key.length === 1 ? event.key.charCodeAt(0) : -1

        const target = event.target
        const cursorStart = target.selectionStart
        const cursorEnd = target.selectionEnd


        if (event.ctrlKey) return;
        if (event.altKey) {

            numm = numm + event.key;
            let char = specialchar.get(numm);

            if (char) {
                let convChar = char;
                const oldValue = oldval
                const partA = oldValue.substring(0, cursorStart) || ""
                const partB = oldValue.substring(cursorEnd, oldValue.length) || ""

                const newvalue = partA + convChar + partB


                changeValue(newvalue)
                adjustCursor(event, convChar);
                event.preventDefault()
            }
            event.preventDefault()
            return
        } else {
            numm = ""
        }


        // for ASCII Characters mapping
        if (keyCode >= KEYCODE.START_ASCII_CODE &&
            keyCode <= KEYCODE.END_ASCII_CODE) {

            let convChar//convert to equivalent nepali font
            try {
                convChar = mapper(keyCode);
            }
            catch (e) {
                convChar = String.fromCharCode(keyCode)

            }
            const oldValue = oldval
            const partA = oldValue.substring(0, cursorStart) || ""
            const partB = oldValue.substring(cursorEnd, oldValue.length) || ""

            const newvalue = partA + convChar + partB

            changeValue(newvalue)
            adjustCursor(event, convChar)
            event.preventDefault()

        }
    }



    const adjustCursor = (event, convChar) => {
        const target = event.target
        const selectionStart = target.selectionStart

        setTimeout(() => {
            target.setSelectionRange(selectionStart + convChar.length + 1, selectionStart + convChar.length + 1)
        }, 10)
    }

    function checkAltkey(e) {
        if (e.keyCode == 18) {
            numm = ""
        }
    }


    // useEffect(() => {
    //     numm = ""
    // }, [])


    return (
        <>

            <input
                type='text'
                onKeyDown={(e) => calculate(e, value, setValue)}
                onChange={(e) => { setValue(e.target.value) }}
                value={value}
                onKeyUp={(e) => checkAltkey(e)}
            />

            <input
                type='text'
                onKeyDown={(e) => calculate(e, value2, setValue2)}
                onChange={(e) => setValue2(e.target.value)}
                value={value2}
                onKeyUp={(e) => checkAltkey(e)}
            />


            <p>{value}</p>
            <p>value2:{value2}</p>
            <div>
                <PDFViewer width="80%" height="900">
                    <Document >
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                <Text>Nepali Text: {value} </Text>

                            </View>


                        </Page>
                    </Document>
                </PDFViewer>
            </div>
        </>
    )
}



