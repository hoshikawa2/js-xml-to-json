//https://codebeautify.org/jsonviewer

function ConvertXMLToJSON(xml) {
    var retorno = "";

    var token = 0;
    var tagAtual = "";
    var tagConteudoAtual = "";
    var jsonStr = "";
    var tagLoops = 0;
    var xmltmp = "";
    var strAcumulado = "";
    var limit = 0;

    var c = 0; //contador
    xml = xml.replace(/(\r\n|\n|\r)/gm, "");

    while (c < xml.length){
        if (xml.substr(c, 1) == ">" && token == 0){
            xmltmp = xmltmp + xml.substr(c, 1);
            token = 1;
            c++;
            continue;
        }
        if (xml.substr(c, 1) == "<" && token == 1){
            xmltmp = xmltmp + xml.substr(c, 1);
            token = 0;
            c++;
            continue;
        }
        if (token == 1 && xml.substr(c, 1) != " "){
            xmltmp = xmltmp + strAcumulado + xml.substr(c, 1);
            strAcumulado = "";
            c++;
            token = 0;
            continue;
        }
        if (token == 0){
            strAcumulado = "";
            xmltmp = xmltmp + xml.substr(c, 1);
        }
        if (token == 1 && xml.substr(c, 1) != "<" && xml.substr(c, 1) != ">"){
            strAcumulado = strAcumulado + xml.substr(c, 1);
        }
        c++;
    }

    xml = xmltmp;

    c = 0;
    while (c < xml.length){

        if (xml.substr(c, 2) == "</")
        {
            tagLoops--;
            if (tagLoops < 0) {
                if (jsonStr.substr(jsonStr.length -1, 1) == ","){
                    jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                }
                jsonStr = jsonStr + '},';
                tagLoops = 0;
            }
            var novaPos = c+2;
            var out = 0;
            while (novaPos < xml.length) {
                if (xml.substr(novaPos, 1) == ">")
                {
                    c = novaPos + 1;
                    out = 1;
                    token = 1;
                    break;
                }
                novaPos++;
            }
            if (out == 1){
                if (jsonStr.substr(jsonStr.length -1, 1) == ","){
                    jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                }
                jsonStr = jsonStr + "},";
                continue;
            }

        }

        if (xml.substr(c, 1) == "<") {

            token = 0;
            tagLoops++;

            if (xml.substr(c+1, 1) == "?" && token == 0){
                var novaPos = c+2;
                var out = 0;
                while (novaPos < xml.length) {
                    if (xml.substr(novaPos, 1) == ">")
                    {
                        c = novaPos + 1;
                        out = 1;
                        break;
                    }
                    novaPos++;
                }
                if (out == 1){
                    break;
                }
            }

            var novaPos = c+1;
            var out = 0;
            var acumulaFlag = 1;
            while (novaPos < xml.length) {
                if (xml.substr(novaPos, 1) == ">")
                {
                    c = novaPos + 1;
                    out = 1;
                    token = 1;
                    break;
                }
                if (xml.substr(novaPos, 1) == " " && token == 0)
                {
                    acumulaFlag = 0;
                }
                if (acumulaFlag == 1 && token == 0)
                {
                    if (tagLoops > 1){
                        jsonStr = jsonStr + "{\"" + tagAtual + "\":";
                        if (tagLoops > 1){
                            jsonStr = jsonStr + "{";
                        }

                        tagAtual = "";
                        tagLoops--;
                        if (tagLoops < 0) {
                            if (jsonStr.substr(jsonStr.length -1, 1) == ","){
                                jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                            }
                            jsonStr = jsonStr + '},';
                            tagLoops = 0;
                        }
                    }
                    tagAtual = tagAtual + xml.substr(novaPos, 1);
                }
                novaPos++;
            }
            if (out == 1){
                continue;
            }


        }

        if (token == 1) {
            var novaPos = c;
            var out = 0;
            while (novaPos < xml.length) {

                if (xml.substr(novaPos, 2) == "</")
                {
                    tagLoops--;
                    if (tagLoops < 0) {
                        if (jsonStr.substr(jsonStr.length -1, 1) == ","){
                            jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                        }
                        jsonStr = jsonStr + '},';
                        tagLoops = 0;
                    }
                    var novaPos = novaPos+2;
                    var out = 0;
                    while (novaPos <= xml.length) {
                        if (xml.substr(novaPos, 1) == ">")
                        {
                            c = novaPos + 1;
                            out = 1;
                            token = 1;
                            break;
                        }
                        novaPos++;
                    }
                    if (out == 1){
                        continue;
                    }

                }

                if (xml.substr(novaPos, 1) == ">")
                {
                    c = novaPos + 1;
                    out = 1;
                    token = 0;
                    break;
                }
                if (token == 1)
                {
                    tagConteudoAtual = tagConteudoAtual + xml.substr(novaPos, 1);
                }
                novaPos++;
            }
            if (out == 1){
                if (tagConteudoAtual == "") {
                    jsonStr = jsonStr + '"' + tagAtual + '":';
                } else {
                    jsonStr = jsonStr + '"' + tagAtual + '":"' + tagConteudoAtual + '",';
                }
                if (tagLoops == 0){
                    if (jsonStr.substr(jsonStr.length -1, 1) == ","){
                        jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                    }
                    tagAtual = "";
                    tagConteudoAtual = "";
                    if (tagLoops == 0){
                        jsonStr = jsonStr + ",";
                    } else {
                        jsonStr = jsonStr + "},";
                    }
                }
                continue;
            }

        }

        c++;
    }
    if (jsonStr.substr(jsonStr.length -1, 1) == ","){
        jsonStr = jsonStr.substr(0, jsonStr.length - 1);
    }
    //jsonStr = jsonStr + "}";

    var c = 0; //contador
    out = 0;
    while (c < jsonStr.length) {

        if (jsonStr.substr(c, 1) == "{") {
            if (jsonStr.substr(c + 1, 1) == "{") {
                out=1;
            }
        }
        if (out == 1){
            jsonStr = jsonStr.substr(0, c ) + "[" + jsonStr.substr(c + 1, jsonStr.length);
            out = 0;
            c=0;
            continue;
        }
        c++;
    }

    limit = 0;
    c = 0;
    token = 0;
    out = 0;
    while (c < jsonStr.length) {

        if (jsonStr.substr(c, 1) == "}") {
            out = 1;
            limit = c;
        }
        if (out == 1)
        {
            var d = limit;
            token = 0;
            while (d >= 0) {
                if (jsonStr.substr(d, 1) == "}") {
                    token--;
                }
                if (jsonStr.substr(d, 1) == "{") {
                    token++;
                }
                if (jsonStr.substr(d, 1) == "[") {
                    token++;
                    jsonStr = jsonStr.substr(0, limit ) + "]" + jsonStr.substr(limit + 1, jsonStr.length);
                }
                if (token == 0){
                    c = limit + 1;
                    break;
                }
                d--;
            }
            out = 0;
        }

        c++;
    }

    retorno = jsonStr;
    return retorno;
}
