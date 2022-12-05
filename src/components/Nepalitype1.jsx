import { useState, useEffect } from "react"
import { unicode, preeti, KEYCODE, specialchar } from './data'

import './font';

import { jsPDF } from "jspdf";
const myFont = "../devanagari/devanagari.ttf"

var numm = "";

export default function Nepalitype() {



    const [value, setValue] = useState("");
    const [value2, setValue2] = useState("");


    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    doc.text(value, 60, 60);
    // doc.text(value, 10, 10)
    // doc.save("a4.pdf");

    let blob = doc.output("blob");
    let url = URL.createObjectURL(blob);

    doc.addFileToVFS("MyFont.ttf", myFont);
    doc.addFont("MyFont.ttf", "MyFont", "normal");
    doc.setFont("MyFont");

    doc.setFont("Preeti", "normal");
    doc.setFontSize(60);

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

            <iframe
                title="print"
                type="application/pdf"
                frameBorder="0"
                width="415px"
                src={url}
                height="580px"
            ></iframe>

        </>
    )
}



