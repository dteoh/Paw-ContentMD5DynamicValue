import { fromByteArray } from 'base64-js';

@registerDynamicValueClass
class ContentMD5DynamicValue {
    static identifier = 'com.dteoh.PawExtensions.ContentMD5DynamicValue';
    static title = 'Content-MD5 (RFC 1864)';
    static help = 'https://github.com/dteoh/Paw-ContentMD5DynamicValue';

    evaluate(context) {
        if (context.runtimeInfo.task != 'requestSend') {
            return;
        }
        const req = context.getCurrentRequest();
        return fromByteArray(this.parseHex(this.md5(req.body)));
    }

    md5(str) {
        return new DynamicValue('com.luckymarmot.HashDynamicValue', {
            input: str,
            hashType: 2, // MD5
            encoding: 0, // Hex, for some reason the Base64 option does not work.
        }).getEvaluatedString();
    }

    // This routine is from luckymarmot/Paw-HexToBase64DynamicValue
    parseHex(str) {
        let byteArray = [];
        let idx = 0;
        let len = str.length;

        while (idx < len) {
            let hexDigit = str.substr(idx, 2)
            byteArray.push(parseInt(hexDigit, 16));
            idx += 2;
        }

        return byteArray;
    }
}